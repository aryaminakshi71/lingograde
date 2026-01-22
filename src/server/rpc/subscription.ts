import { router, procedure } from '@orpc/server'
import { z } from 'zod'
import { db, subscriptions, users } from '../../db'
import { eq, and, desc } from 'drizzle-orm'
import { requireAuth } from '../middleware'
import {
  stripe,
  STRIPE_CONFIG,
  createCheckoutSession,
  createCustomer,
  createPortalSession,
  getSubscription as getStripeSubscription,
  cancelSubscription as cancelStripeSubscription,
} from '../../lib/stripe'
import { sendSubscriptionEmail } from '../../lib/email'
import { captureException } from '../../lib/sentry'
import { analytics } from '../../lib/analytics'

const PLAN_PRICES: Record<string, string> = {
  pro: STRIPE_CONFIG.prices.proMonthly,
  team: STRIPE_CONFIG.prices.teamMonthly,
  enterprise: STRIPE_CONFIG.prices.enterpriseMonthly,
}

export const subscriptionRouter = router({
  // Get current subscription
  getSubscription: procedure.use(requireAuth).query(async ({ ctx }) => {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, ctx.user.id),
          eq(subscriptions.status, 'active')
        )
      )
      .orderBy(desc(subscriptions.createdAt))
      .limit(1)
    return subscription || null
  }),

  // Create checkout session for subscription
  createCheckout: procedure
    .input(
      z.object({
        tier: z.enum(['pro', 'team', 'enterprise']),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .use(requireAuth)
    .mutation(async ({ input, ctx }) => {
      if (!stripe) {
        throw new Error('Stripe is not configured')
      }

      try {
        const priceId = PLAN_PRICES[input.tier]
        if (!priceId) {
          throw new Error('Invalid plan tier')
        }

        // Get or create Stripe customer
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1)

        let customerId = user?.stripeCustomerId

        if (!customerId && user?.email) {
          const customer = await createCustomer({
            email: user.email,
            name: user.name || undefined,
            metadata: { userId: ctx.user.id },
          })
          customerId = customer.id

          // Save customer ID
          await db
            .update(users)
            .set({ stripeCustomerId: customerId })
            .where(eq(users.id, ctx.user.id))
        }

        const session = await createCheckoutSession({
          customerId: customerId || undefined,
          priceId,
          successUrl: input.successUrl,
          cancelUrl: input.cancelUrl,
          metadata: {
            userId: ctx.user.id,
            tier: input.tier,
          },
        })

        return { sessionId: session.id, url: session.url }
      } catch (error) {
        captureException(error, {
          user: { id: ctx.user.id },
          tags: { feature: 'subscription-checkout' },
        })
        throw new Error('Failed to create checkout session')
      }
    }),

  // Create billing portal session
  createPortal: procedure
    .input(
      z.object({
        returnUrl: z.string().url(),
      })
    )
    .use(requireAuth)
    .mutation(async ({ input, ctx }) => {
      if (!stripe) {
        throw new Error('Stripe is not configured')
      }

      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1)

        if (!user?.stripeCustomerId) {
          throw new Error('No billing account found')
        }

        const session = await createPortalSession({
          customerId: user.stripeCustomerId,
          returnUrl: input.returnUrl,
        })

        return { url: session.url }
      } catch (error) {
        captureException(error, {
          user: { id: ctx.user.id },
          tags: { feature: 'subscription-portal' },
        })
        throw new Error('Failed to create billing portal session')
      }
    }),

  // Cancel subscription
  cancel: procedure.use(requireAuth).mutation(async ({ ctx }) => {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, ctx.user.id),
            eq(subscriptions.status, 'active')
          )
        )
        .limit(1)

      if (!subscription) {
        throw new Error('No active subscription found')
      }

      if (subscription.stripeSubscriptionId && stripe) {
        await cancelStripeSubscription(subscription.stripeSubscriptionId)
      }

      // Update local subscription
      await db
        .update(subscriptions)
        .set({
          status: 'cancelled',
          cancelledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, subscription.id))

      // Track analytics
      if (typeof window !== 'undefined') {
        analytics.subscriptionCancelled(subscription.tier)
      }

      return { success: true }
    } catch (error) {
      captureException(error, {
        user: { id: ctx.user.id },
        tags: { feature: 'subscription-cancel' },
      })
      throw new Error('Failed to cancel subscription')
    }
  }),

  // Sync subscription from Stripe (webhook or manual)
  sync: procedure.use(requireAuth).mutation(async ({ ctx }) => {
    try {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1)

      if (!subscription?.stripeSubscriptionId || !stripe) {
        return subscription || null
      }

      const stripeSubscription = await getStripeSubscription(
        subscription.stripeSubscriptionId
      )

      // Update local subscription
      const [updated] = await db
        .update(subscriptions)
        .set({
          status: stripeSubscription.status === 'active' ? 'active' : 'cancelled',
          currentPeriodEnd: stripeSubscription.current_period_end
            ? new Date(stripeSubscription.current_period_end * 1000)
            : null,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, subscription.id))
        .returning()

      return updated
    } catch (error) {
      captureException(error, {
        user: { id: ctx.user.id },
        tags: { feature: 'subscription-sync' },
      })
      throw new Error('Failed to sync subscription')
    }
  }),

  // Update subscription (legacy - for non-Stripe updates)
  updateSubscription: procedure
    .input(
      z.object({
        tier: z.enum(['free', 'pro', 'team', 'enterprise']),
      })
    )
    .use(requireAuth)
    .mutation(async ({ input, ctx }) => {
      const [existing] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1)

      if (existing) {
        const [updated] = await db
          .update(subscriptions)
          .set({
            tier: input.tier,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, existing.id))
          .returning()
        return updated
      } else {
        const [created] = await db
          .insert(subscriptions)
          .values({
            userId: ctx.user.id,
            tier: input.tier,
            status: 'active',
          })
          .returning()

        // Send welcome email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1)

        if (user?.email) {
          await sendSubscriptionEmail(user.email, input.tier)
        }

        return created
      }
    }),

  // Get available plans
  getPlans: procedure.query(() => {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        features: [
          '5 lessons per day',
          'Basic vocabulary',
          'Limited speech practice',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 9.99,
        interval: 'month',
        priceId: STRIPE_CONFIG.prices.proMonthly,
        features: [
          'Unlimited lessons',
          'Full vocabulary access',
          'Unlimited speech practice',
          'Progress tracking',
          'Pronunciation feedback',
        ],
      },
      {
        id: 'team',
        name: 'Team',
        price: 19.99,
        interval: 'month',
        priceId: STRIPE_CONFIG.prices.teamMonthly,
        features: [
          'Everything in Pro',
          'Up to 5 team members',
          'Team progress dashboard',
          'Priority support',
        ],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 49.99,
        interval: 'month',
        priceId: STRIPE_CONFIG.prices.enterpriseMonthly,
        features: [
          'Everything in Team',
          'Unlimited team members',
          'Custom vocabulary lists',
          'API access',
          'Dedicated support',
          'SSO integration',
        ],
      },
    ]
  }),
})

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - Stripe features disabled')
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  : null

export const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  prices: {
    proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    teamMonthly: process.env.STRIPE_PRICE_TEAM_MONTHLY || '',
    enterpriseMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
  },
}

// Create a checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata,
}: {
  customerId?: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  if (!stripe) throw new Error('Stripe not configured')

  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  })
}

// Create a customer
export async function createCustomer({
  email,
  name,
  metadata,
}: {
  email: string
  name?: string
  metadata?: Record<string, string>
}) {
  if (!stripe) throw new Error('Stripe not configured')

  return stripe.customers.create({
    email,
    name,
    metadata,
  })
}

// Get customer portal session
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  if (!stripe) throw new Error('Stripe not configured')

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// Get subscription
export async function getSubscription(subscriptionId: string) {
  if (!stripe) throw new Error('Stripe not configured')

  return stripe.subscriptions.retrieve(subscriptionId)
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) throw new Error('Stripe not configured')

  return stripe.subscriptions.cancel(subscriptionId)
}

// Verify webhook signature
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  if (!stripe) throw new Error('Stripe not configured')
  if (!STRIPE_CONFIG.webhookSecret) throw new Error('Webhook secret not configured')

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    STRIPE_CONFIG.webhookSecret
  )
}

export type StripeEvent = Stripe.Event

import { middleware } from '@orpc/server'
import { auth } from './auth'
import { getAppUser } from './user-helper'

export const requireAuth = middleware(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: ctx.headers,
  })

  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // Get the app user record (integer ID) from Better Auth user (string ID)
  const appUser = await getAppUser(session.user.id, session.user.email)

  return next({
    ctx: {
      ...ctx,
      user: appUser, // Use app user with integer ID
      betterAuthUser: session.user, // Keep Better Auth user for reference
      session: session.session,
    },
  })
})

export const requireAdmin = middleware(async ({ ctx, next }) => {
  // Check if user is admin
  // This depends on your user model structure
  if (!ctx.user || (ctx.user as any).role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  return next({ ctx })
})

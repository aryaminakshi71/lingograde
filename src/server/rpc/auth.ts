import { os } from '@orpc/server'
import { z } from 'zod'
import { auth } from '../auth'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
  nativeLanguage: z.string().default('en'),
  targetLanguage: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const authRouter = {
  register: os
    .input(registerSchema)
    .handler(async ({ input, context: ctx }: { input: any; context: any }) => {
      const result = await auth.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.fullName || input.email.split('@')[0],
        },
      })

      if (!result) {
        throw new Error('Registration failed')
      }

      // Create app user record with additional fields
      const { getAppUser } = await import('../user-helper')
      const appUser = await getAppUser(result.user.id, result.user.email)

      return {
        user: {
          ...appUser,
          betterAuthUser: result.user,
        },
        session: (result as any).session || { token: (result as any).token },
      }
    }),

  login: os
    .input(loginSchema)
    .handler(async ({ input, context: ctx }: { input: any; context: any }) => {
      const result = await auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
        },
      })

      if (!result) {
        throw new Error('Invalid email or password')
      }

      return {
        user: result.user,
        session: (result as any).session || { token: (result as any).token },
      }
    }),

  demoLogin: os
    .handler(async ({ context: ctx }: { context: any }) => {
      const email = 'demo@company.com'
      const passwords = ['DemoPassword123!', 'demo', 'Test@123']

      for (const password of passwords) {
        try {
          const result = await auth.api.signInEmail({
            body: {
              email,
              password,
            },
          })
          if (result) {
            return {
              user: result.user,
              session: (result as any).session || { token: (result as any).token },
            }
          }
        } catch (e) {
          // Continue to next password
        }
      }

      // If all logins failed, try to sign up
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email,
            password: 'DemoPassword123!',
            name: 'Demo User',
          },
        })

        const { getAppUser } = await import('../user-helper')
        const appUser = await getAppUser(result.user.id, result.user.email)

        return {
          user: {
            ...appUser,
            betterAuthUser: result.user,
          },
          session: (result as any).session || { token: (result as any).token },
        }
      } catch (signUpError) {
        throw new Error('Demo login failed. User might already exist with a different password. Please use the regular login page.')
      }
    }),

  logout: os
    .handler(async ({ context: ctx }: { context: any }) => {
      return { success: true }
    }),

  getSession: os
    .handler(async ({ context: ctx }: { context: any }) => {
      const session = await auth.api.getSession({
        headers: ctx.headers,
      })
      return session
    }),

  me: os
    .handler(async ({ context: ctx }: { context: any }) => {
      const session = await auth.api.getSession({
        headers: ctx.headers,
      })
      if (!session?.user) {
        throw new Error('Not authenticated')
      }
      return session.user
    }),
}

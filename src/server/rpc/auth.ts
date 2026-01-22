import { router, procedure } from '@orpc/server'
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

export const authRouter = router({
  register: procedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await auth.signUp.email({
        email: input.email,
        password: input.password,
        name: input.fullName,
      })

      if (!result.data) {
        const errorMessage = result.error?.message || 'Registration failed'
        console.error('Registration failed for', input.email, ':', errorMessage)
        throw new Error(errorMessage)
      }

      // Create app user record with additional fields
      const { getAppUser } = await import('../user-helper')
      const appUser = await getAppUser(result.data.user.id, result.data.user.email)

      return {
        user: {
          ...appUser,
          betterAuthUser: result.data.user,
        },
        session: result.data.session,
      }
    }),

  login: procedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await auth.signIn.email({
        email: input.email,
        password: input.password,
      })

      if (!result.data) {
        const errorMessage = result.error?.message || 'Invalid email or password'
        console.error('Login failed for', input.email, ':', errorMessage)
        
        // Provide more helpful error message
        let userFriendlyMessage = errorMessage
        if (errorMessage.toLowerCase().includes('user not found') || 
            errorMessage.toLowerCase().includes('invalid') ||
            errorMessage.toLowerCase().includes('incorrect')) {
          userFriendlyMessage = 'Invalid email or password. If you don\'t have an account, please register first.'
        }
        
        throw new Error(userFriendlyMessage)
      }

      return {
        user: result.data.user,
        session: result.data.session,
      }
    }),

  logout: procedure
    .mutation(async ({ ctx }) => {
      await auth.signOut({
        fetchOptions: {
          headers: {
            cookie: ctx.headers.get('cookie') || '',
          },
        },
      })
      return { success: true }
    }),

  getSession: procedure
    .query(async ({ ctx }) => {
      const session = await auth.api.getSession({
        headers: ctx.headers,
      })
      return session
    }),

  me: procedure
    .query(async ({ ctx }) => {
      const session = await auth.api.getSession({
        headers: ctx.headers,
      })
      if (!session?.user) {
        throw new Error('Not authenticated')
      }
      return session.user
    }),
})

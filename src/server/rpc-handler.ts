import { createORPCHandler } from '@orpc/server'
import { appRouter } from './rpc'
import { auth } from './auth'

export const rpcHandler = createORPCHandler({
  router: appRouter,
  createContext: async (req) => {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    return {
      user: session?.user,
      session: session?.session,
      headers: req.headers,
    }
  },
})

import { RPCHandler } from '@orpc/server/fetch'
import { appRouter } from './rpc'
import { auth } from './auth'

const handler = new RPCHandler(appRouter)

export const rpcHandler = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  const result = await handler.handle(req, {
    prefix: '/api/rpc',
    context: {
      user: session?.user,
      session: session?.session,
      headers: req.headers,
    }
  })

  if (result.matched) {
    return result.response
  }

  return new Response('Not Found', { status: 404 })
}

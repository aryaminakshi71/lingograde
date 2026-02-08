import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { AppRouter } from '../server/rpc'

// Get RPC URL - ensure it's a valid string
const getRpcUrl = () => {
  const envUrl = import.meta.env.VITE_RPC_URL
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim()
  }
  // Check for server-side execution
  if (typeof window === 'undefined') {
    return 'http://localhost:3009/api/rpc'
  }
  // Client-side - construct absolute URL
  return new URL('/api/rpc', window.location.origin).toString()
}

const link = new RPCLink({
  url: getRpcUrl(),
  fetch: typeof window !== 'undefined' ? window.fetch.bind(window) : fetch,
})

export const orpcClient = createORPCClient<AppRouter>(link)

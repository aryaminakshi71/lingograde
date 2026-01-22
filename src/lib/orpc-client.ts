import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { AppRouter } from '../server/rpc'

// Get RPC URL - ensure it's a valid string
const getRpcUrl = () => {
  const envUrl = import.meta.env.VITE_RPC_URL
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim()
  }
  // Default to relative path for same-origin requests
  return '/api/rpc'
}

const link = new RPCLink({
  url: getRpcUrl(),
  fetch: typeof window !== 'undefined' ? window.fetch : fetch,
})

export const orpcClient = createORPCClient<AppRouter>(link)

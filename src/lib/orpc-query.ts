import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { orpcClient } from './orpc-client'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

export const orpc = createTanstackQueryUtils(orpcClient, queryClient)

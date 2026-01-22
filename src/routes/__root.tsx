import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/orpc-query'
import { ThemeProvider, ToastProvider } from '@shared/saas-core'
import { Analytics, usePageTracking } from '../components/Analytics'

function RootComponent() {
  usePageTracking()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Outlet />
        <ToastProvider />
        <Analytics />
        {/* Router devtools can be added by installing @tanstack/router-devtools */}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})

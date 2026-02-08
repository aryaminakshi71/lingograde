import { HeadContent, Scripts, Outlet, createRootRoute } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/orpc-query'
import '@/styles/globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'LingoGrade - Language Learning & Assessment' },
      {
        name: 'description',
        content:
          'Language learning platform with AI-powered assessment and personalized lessons.',
      },
    ],
  }),
  component: RootDocument,
  notFoundComponent: () => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full rounded-lg bg-white p-6 text-center shadow">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
            <p className="text-gray-600">The page you are looking for does not exist.</p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  ),
})

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  )
}

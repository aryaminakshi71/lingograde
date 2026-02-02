import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/orpc-query';
import { ThemeProvider, ToastProvider } from '@shared/saas-core';
import { Analytics, usePageTracking } from '../components/Analytics';
import { ErrorPage, NotFoundPage } from '../components/error';
import { generateOrganizationSchema, generateWebSiteSchema, getLingoGradeOrganizationSchema } from '../lib/structured-data';

import stylesCss from '../styles/globals.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LingoGrade - Language Learning Platform | Master Languages Online" },
      { name: "description", content: "Comprehensive language learning platform with interactive lessons, progress tracking, and personalized learning paths. Master new languages at your own pace." },
      { name: "keywords", content: "language learning, online language courses, language education, learn languages, language platform, multilingual learning" },
      { property: "og:title", content: "LingoGrade - Language Learning Platform" },
      { property: "og:description", content: "Master new languages with our comprehensive online language learning platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://api.your-domain.com" },
      { rel: "stylesheet", href: stylesCss },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: RootDocument,
  errorComponent: ({ error }) => <ErrorPage error={error} />,
  notFoundComponent: () => <NotFoundPage />,
});

function RootDocument() {
  usePageTracking();

  const organizationSchema = generateOrganizationSchema(getLingoGradeOrganizationSchema())
  const websiteSchema = generateWebSiteSchema({
    name: 'LingoGrade',
    url: import.meta.env.VITE_PUBLIC_SITE_URL || 'https://lingograde.your-domain.com',
    description: 'AI-powered language learning platform with personalized lessons.',
  })

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white focus:rounded-br-lg"
        >
          Skip to main content
        </a>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main id="main-content">
              <Outlet />
            </main>
            <ToastProvider />
            <Analytics />
            <Scripts />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

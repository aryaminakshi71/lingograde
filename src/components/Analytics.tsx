'use client'

import { useEffect } from 'react'
import {
  ANALYTICS_CONFIG,
  isGAConfigured,
  isPostHogConfigured,
  getGAScript,
  getPostHogScript,
  analytics,
} from '../lib/analytics'

export function Analytics() {
  useEffect(() => {
    // Track initial page view (only in browser)
    if (typeof window !== 'undefined') {
      try {
        analytics.pageView(window.location.pathname, document.title)
      } catch (error) {
        console.warn('Analytics error:', error)
      }
    }
  }, [])

  if (!isGAConfigured && !isPostHogConfigured) {
    return null
  }

  return (
    <>
      {/* Google Analytics */}
      {isGAConfigured && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.gaId}`}
          />
          <script
            dangerouslySetInnerHTML={{ __html: getGAScript() }}
          />
        </>
      )}

      {/* PostHog */}
      {isPostHogConfigured && (
        <script
          dangerouslySetInnerHTML={{ __html: getPostHogScript() }}
        />
      )}
    </>
  )
}

// Hook for tracking page views on route change
export function usePageTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleRouteChange = () => {
      try {
        analytics.pageView(window.location.pathname, document.title)
      } catch (error) {
        console.warn('Analytics tracking error:', error)
      }
    }

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])
}

export { analytics }

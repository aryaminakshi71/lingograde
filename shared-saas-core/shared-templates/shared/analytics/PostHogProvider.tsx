'use client'

import { useEffect, useRef, ReactNode, JSX } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface PostHog {
  init: (key: string, options?: any) => void
  capture: (event: string, properties?: any) => void
  identify: (userId: string, traits?: any) => void
  reset: () => void
  onFeatureFlags: (callback: () => void) => void
}

declare global {
  interface Window {
    posthog?: PostHog
  }
}

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_demo_key'

function PostHogTracker({ appName }: { appName: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && typeof window !== 'undefined') {
      initialized.current = true

      const script = document.createElement('script')
      script.innerHTML = `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}var c="disable time_on_page features_for_user remote_config".split(" "),h="add_feature_flags add_on_feature_flags get_feature_flag getFeatureFlag getFlags getFlagsLocked on onOnce onFeatureFlags".split(" "),l="supporlesged set_config set_user_property reset resetUUID".split(" ");for(o=0;o<c.length;o++)g(e,c[o]);for(o=0;o<h.length;o++)g(e,h[o]);for(o=0;o<l.length;o++)g(e,l[o]);for(o=0;o<p.length;o++)g(e,p[o]);e._i.push([i,s,a])},e.__SV=1.6,o=t.createElement("script"),o.type="text/javascript",o.src="https://cdn.jsdelivr.net/npm/@posthog/posthog-js@1.160.0/dist/array.js",n=t.getElementsByTagName("script")[0],n.parentNode.insertBefore(o,n),e.initialized=!0,e._SV=1.6}(document,window.posthog||[]);
        window.posthog.init('${POSTHOG_KEY}',{
          api_host:'https://app.posthog.com',
          debug:${process.env.NODE_ENV === 'development'},
          capture_pageview:!1,
          persistence:'localStorage'
        });
      `
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (pathname && window.posthog) {
      let url = pathname
      if (searchParams?.toString()) {
        url += '?' + searchParams.toString()
      }
      window.posthog.capture('$pageview', {
        $current_url: url,
        $pathname: pathname,
        $search: searchParams?.toString() || '',
        app: appName,
      })
    }
  }, [pathname, searchParams, appName])

  return null
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(eventName, properties)
  }
}

export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.identify(userId, traits)
  }
}

export function resetPostHog() {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.reset()
  }
}

export function withPostHog<P extends object>(Component: React.ComponentType<P>, appName: string) {
  return function WrappedComponent(props: P) {
    return (
      <>
        <PostHogTracker appName={appName} />
        <Component {...props} />
      </>
    )
  }
}

export function PostHogProvider({ children, appName }: { children: ReactNode; appName: string }) {
  return (
    <>
      <PostHogTracker appName={appName} />
      {children}
    </>
  )
}

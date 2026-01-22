// Analytics configuration and helpers

export const ANALYTICS_CONFIG = {
  gaId: import.meta.env.VITE_GA_ID || import.meta.env.NEXT_PUBLIC_GA_ID || '',
  posthogKey: import.meta.env.VITE_POSTHOG_KEY || import.meta.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  posthogHost: 'https://app.posthog.com',
}

// Check if analytics are configured
export const isGAConfigured = !!ANALYTICS_CONFIG.gaId && ANALYTICS_CONFIG.gaId !== 'G-XXXXXXXXXX'
export const isPostHogConfigured = !!ANALYTICS_CONFIG.posthogKey && ANALYTICS_CONFIG.posthogKey !== 'phc_your_posthog_key'

// Google Analytics event tracking
export function trackGAEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined' || !isGAConfigured) return

  // @ts-expect-error gtag is loaded via script
  window.gtag?.('event', eventName, params)
}

// Google Analytics page view
export function trackGAPageView(url: string, title?: string) {
  if (typeof window === 'undefined' || !isGAConfigured) return

  // @ts-expect-error gtag is loaded via script
  window.gtag?.('config', ANALYTICS_CONFIG.gaId, {
    page_path: url,
    page_title: title,
  })
}

// PostHog event tracking
export function trackPostHogEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window === 'undefined' || !isPostHogConfigured) return

  // @ts-expect-error posthog is loaded via script
  window.posthog?.capture(eventName, properties)
}

// PostHog identify user
export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return

  // @ts-expect-error posthog is loaded via script
  window.posthog?.identify(userId, properties)

  // Also set GA user ID
  if (isGAConfigured) {
    // @ts-expect-error gtag is loaded via script
    window.gtag?.('set', { user_id: userId })
  }
}

// Reset user (on logout)
export function resetAnalytics() {
  if (typeof window === 'undefined') return

  // @ts-expect-error posthog is loaded via script
  window.posthog?.reset()
}

// Combined event tracking (sends to both GA and PostHog)
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  trackGAEvent(eventName, properties as Record<string, string | number | boolean>)
  trackPostHogEvent(eventName, properties)
}

// Common event helpers
export const analytics = {
  // Page views
  pageView: (url: string, title?: string) => {
    trackGAPageView(url, title)
    trackPostHogEvent('$pageview', { $current_url: url, title })
  },

  // User events
  userSignedUp: (method: string) => {
    trackEvent('sign_up', { method })
  },

  userLoggedIn: (method: string) => {
    trackEvent('login', { method })
  },

  userLoggedOut: () => {
    trackEvent('logout')
    resetAnalytics()
  },

  // Subscription events
  subscriptionStarted: (plan: string, price: number) => {
    trackEvent('subscription_started', { plan, price })
    trackGAEvent('purchase', {
      currency: 'USD',
      value: price,
      items: [{ item_name: plan }],
    } as Record<string, string | number | boolean>)
  },

  subscriptionCancelled: (plan: string) => {
    trackEvent('subscription_cancelled', { plan })
  },

  // Lesson events
  lessonStarted: (lessonId: string, lessonName: string, language: string) => {
    trackEvent('lesson_started', { lessonId, lessonName, language })
  },

  lessonCompleted: (
    lessonId: string,
    lessonName: string,
    score: number,
    duration: number
  ) => {
    trackEvent('lesson_completed', {
      lessonId,
      lessonName,
      score,
      duration,
    })
  },

  exerciseCompleted: (
    exerciseType: string,
    score: number,
    language: string
  ) => {
    trackEvent('exercise_completed', { exerciseType, score, language })
  },

  // Speech events
  speechRecorded: (language: string, duration: number) => {
    trackEvent('speech_recorded', { language, duration })
  },

  pronunciationAssessed: (language: string, score: number) => {
    trackEvent('pronunciation_assessed', { language, score })
  },

  // Feature usage
  featureUsed: (featureName: string, context?: Record<string, unknown>) => {
    trackEvent('feature_used', { featureName, ...context })
  },

  // Errors
  errorOccurred: (errorType: string, errorMessage: string) => {
    trackEvent('error', { errorType, errorMessage })
  },
}

// GA Script loader
export function getGAScript() {
  if (!isGAConfigured) return ''

  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${ANALYTICS_CONFIG.gaId}', {
      page_path: window.location.pathname,
    });
  `
}

// PostHog Script loader
export function getPostHogScript() {
  if (!isPostHogConfigured) return ''

  const isDev = import.meta.env.DEV
  return `
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('${ANALYTICS_CONFIG.posthogKey}', {
      api_host: '${ANALYTICS_CONFIG.posthogHost}',
      loaded: function(posthog) {
        if (${isDev}) posthog.debug();
      }
    });
  `
}

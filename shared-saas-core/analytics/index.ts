// Analytics Integration - Post-hoc Analytics

export type AnalyticsEvent = 
  | 'page_view'
  | 'button_click'
  | 'form_submit'
  | 'signup_started'
  | 'signup_completed'
  | 'login_started'
  | 'login_completed'
  | 'subscription_started'
  | 'subscription_completed'
  | 'demo_started'
  | 'feature_used'
  | 'error_occurred'

interface AnalyticsConfig {
  provider: 'plausible' | 'ga4' | 'mixpanel' | 'none'
  domain?: string
  apiKey?: string
  debug?: boolean
}

interface EventProperties {
  [key: string]: string | number | boolean
}

// PostHoc Analytics Class
export class Analytics {
  private config: AnalyticsConfig
  private initialized: boolean = false

  constructor(config: AnalyticsConfig) {
    this.config = config
  }

  // Initialize analytics
  init(): void {
    if (this.initialized || this.config.provider === 'none') return

    switch (this.config.provider) {
      case 'plausible':
        this.initPlausible()
        break
      case 'ga4':
        this.initGA4()
        break
      case 'mixpanel':
        this.initMixpanel()
        break
    }

    this.initialized = true
  }

  private initPlausible(): void {
    if (typeof window === 'undefined') return
    
    const script = document.createElement('script')
    script.defer = true
    script.dataset.domain = this.config.domain || window.location.hostname
    script.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(script)
  }

  private initGA4(): void {
    if (typeof window === 'undefined') return
    
    const gtagScript = document.createElement('script')
    gtagScript.async = true
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.apiKey}`
    document.head.appendChild(gtagScript)

    ;(window as any).dataLayer = (window as any).dataLayer || []
    function gtag(...args: any[]) {
      ;(window as any).dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', this.config.apiKey)
  }

  private initMixpanel(): void {
    if (typeof window === 'undefined') return
    
    ;(window as any).mixpanel = (window as any).mixpanel || []
    const mp = (window as any).mixpanel
    mp.push(['track', 'page_view'])
  }

  // Track page view
  trackPageView(url: string, referrer?: string): void {
    this.track('page_view', {
      url,
      referrer: referrer || document.referrer,
      timestamp: new Date().toISOString(),
    })
  }

  // Track custom event
  track(event: AnalyticsEvent, properties?: EventProperties): void {
    if (this.config.provider === 'none') return

    const enrichedProperties = {
      ...properties,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
    }

    switch (this.config.provider) {
      case 'plausible':
        if (typeof window !== 'undefined' && (window as any).plausible) {
          ;(window as any).plausible(event, { props: enrichedProperties })
        }
        break
      case 'ga4':
        if (typeof window !== 'undefined' && (window as any).gtag) {
          ;(window as any).gtag('event', event, enrichedProperties)
        }
        break
      case 'mixpanel':
        if ((window as any).mixpanel) {
          ;(window as any).mixpanel.track(event, enrichedProperties)
        }
        break
    }

    if (this.config.debug) {
      console.log('[Analytics]', event, enrichedProperties)
    }
  }

  // Identify user
  identify(userId: string, traits?: Record<string, any>): void {
    if (this.config.provider === 'none') return

    switch (this.config.provider) {
      case 'mixpanel':
        if ((window as any).mixpanel) {
          ;(window as any).mixpanel.identify(userId)
          if (traits) {
            ;(window as any).mixpanel.people.set(traits)
          }
        }
        break
      case 'ga4':
        if (typeof window !== 'undefined' && (window as any).gtag) {
          ;(window as any).gtag('set', { user_id: userId })
        }
        break
    }
  }

  // Reset user identity (on logout)
  reset(): void {
    switch (this.config.provider) {
      case 'mixpanel':
        if ((window as any).mixpanel) {
          ;(window as any).mixpanel.reset()
        }
        break
    }
  }
}

// Analytics instance factory
export function createAnalytics(config: AnalyticsConfig): Analytics {
  const analytics = new Analytics(config)
  analytics.init()
  return analytics
}

// Marketing pixel configurations
export const MARKETING_PIXELS = {
  facebook: {
    pixelId: '',
    enabled: false,
  },
  google: {
    conversionId: '',
    enabled: false,
  },
  twitter: {
    pixelId: '',
    enabled: false,
  },
  linkedin: {
    partnerId: '',
    enabled: false,
  },
}

// Online marketing tracking
export function trackMarketingConversion(source: string, campaign: string): void {
  // This would integrate with various ad platforms
  console.log(`[Marketing] Conversion tracked: ${source} - ${campaign}`)
  
  // Example integrations
  const fbq = (globalThis as { fbq?: (...args: unknown[]) => void }).fbq
  if (MARKETING_PIXELS.facebook.enabled && typeof fbq === 'function') {
    fbq('track', 'Lead', { source, campaign })
  }
  const gtag = (globalThis as { gtag?: (...args: unknown[]) => void }).gtag
  if (MARKETING_PIXELS.google.enabled && typeof gtag === 'function') {
    gtag('event', 'conversion', { send_to: MARKETING_PIXELS.google.conversionId })
  }
}

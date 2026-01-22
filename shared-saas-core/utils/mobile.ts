// Mobile optimization utilities

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false

  return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768
}

/**
 * Check if device is touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

/**
 * Get viewport dimensions
 */
export function getViewport(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Check if viewport is mobile size (< 768px)
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * Check if viewport is tablet size (768px - 1024px)
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false
  const width = window.innerWidth
  return width >= 768 && width < 1024
}

/**
 * Check if viewport is desktop size (>= 1024px)
 */
export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}

/**
 * Get responsive breakpoint
 */
export function getBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  if (isMobileViewport()) return 'mobile'
  if (isTabletViewport()) return 'tablet'
  return 'desktop'
}

// Note: useResize hook should be created in hooks/ directory
// This utility file is for non-React utilities

/**
 * Optimize images for mobile
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  quality: number = 80
): string {
  if (!width) {
    width = isMobileViewport() ? 400 : isTabletViewport() ? 800 : 1200
  }

  // If using an image CDN, add optimization parameters
  // This is a placeholder - adjust based on your image service
  if (url.includes('cdn.example.com')) {
    return `${url}?w=${width}&q=${quality}`
  }

  return url
}

/**
 * Prevent zoom on double tap (iOS Safari)
 */
export function preventDoubleTapZoom(): void {
  if (typeof window === 'undefined') return

  let lastTouchEnd = 0
  document.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    },
    false
  )
}

/**
 * Add mobile-specific meta tags
 */
export function addMobileMetaTags(): void {
  if (typeof document === 'undefined') return

  const viewport = document.querySelector('meta[name="viewport"]')
  if (!viewport) {
    const meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content =
      'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
    document.head.appendChild(meta)
  }
}


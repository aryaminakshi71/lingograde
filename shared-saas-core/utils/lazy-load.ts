// Lazy loading utilities

import { lazy, ComponentType, LazyExoticComponent } from 'react'

/**
 * Create a lazy-loaded component with error boundary support
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(importFn)
}

/**
 * Preload a lazy component
 */
export function preloadComponent(
  importFn: () => Promise<any>
): Promise<void> {
  return importFn().then(() => {})
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  placeholder?: string
): void {
  if (placeholder) {
    img.src = placeholder
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src
          observer.unobserve(img)
        }
      })
    },
    { rootMargin: '50px' }
  )

  observer.observe(img)
}

/**
 * Lazy load script
 */
export function lazyLoadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

/**
 * Lazy load stylesheet
 */
export function lazyLoadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`))
    document.head.appendChild(link)
  })
}

// Note: useIntersectionObserver hook should be created in hooks/ directory
// This utility file is for non-React utilities


'use client'

import { useState, useEffect, RefObject } from 'react'

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  elementRef: RefObject<HTMLElement> | HTMLElement | null,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const element = elementRef instanceof HTMLElement ? elementRef : elementRef?.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return isIntersecting
}


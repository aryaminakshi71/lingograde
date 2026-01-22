'use client'

import { useEffect } from 'react'

/**
 * Debounced resize handler hook
 */
export function useResize(
  callback: (width: number, height: number) => void,
  delay: number = 250
): void {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        callback(window.innerWidth, window.innerHeight)
      }, delay)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [callback, delay])
}


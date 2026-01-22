// Client-side caching utilities

interface CacheEntry<T> {
  data: T
  expires: number
  timestamp: number
}

export class MemoryCache {
  private cache: Map<string, CacheEntry<any>>
  private defaultTTL: number

  constructor(defaultTTL: number = 300000) {
    // Default 5 minutes
    this.cache = new Map()
    this.defaultTTL = defaultTTL
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, {
      data,
      expires,
      timestamp: Date.now(),
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key)
      }
    }
  }

  size(): number {
    this.cleanup()
    return this.cache.size
  }
}

// LocalStorage-based cache
export class LocalStorageCache {
  private prefix: string
  private defaultTTL: number

  constructor(prefix: string = 'cache_', defaultTTL: number = 300000) {
    this.prefix = prefix
    this.defaultTTL = defaultTTL
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set<T>(key: string, data: T, ttl?: number): void {
    if (typeof window === 'undefined') return

    try {
      const entry: CacheEntry<T> = {
        data,
        expires: Date.now() + (ttl || this.defaultTTL),
        timestamp: Date.now(),
      }
      localStorage.setItem(this.getKey(key), JSON.stringify(entry))
    } catch (error) {
      console.warn('Failed to set cache in localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null

    try {
      const item = localStorage.getItem(this.getKey(key))
      if (!item) return null

      const entry: CacheEntry<T> = JSON.parse(item)

      if (Date.now() > entry.expires) {
        localStorage.removeItem(this.getKey(key))
        return null
      }

      return entry.data
    } catch (error) {
      console.warn('Failed to get cache from localStorage:', error)
      return null
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.getKey(key))
  }

  clear(): void {
    if (typeof window === 'undefined') return

    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  invalidate(pattern: string): void {
    if (typeof window === 'undefined') return

    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.prefix) && key.includes(pattern)) {
        localStorage.removeItem(key)
      }
    })
  }

  cleanup(): void {
    if (typeof window === 'undefined') return

    const now = Date.now()
    const keys = Object.keys(localStorage)

    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = localStorage.getItem(key)
          if (item) {
            const entry: CacheEntry<any> = JSON.parse(item)
            if (now > entry.expires) {
              localStorage.removeItem(key)
            }
          }
        } catch {
          // Invalid entry, remove it
          localStorage.removeItem(key)
        }
      }
    })
  }
}

// Create default instances
export const memoryCache = new MemoryCache()
export const localStorageCache = new LocalStorageCache()

// Auto-cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    memoryCache.cleanup()
    localStorageCache.cleanup()
  }, 300000) // 5 minutes
}


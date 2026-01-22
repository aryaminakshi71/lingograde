// API Client with caching and error handling

export interface ApiClientOptions {
  baseURL?: string
  timeout?: number
  cache?: {
    enabled: boolean
    ttl?: number // Time to live in seconds
  }
}

export interface ApiResponse<T = any> {
  data: T
  error?: string
  status: number
  cached?: boolean
}

class ApiClient {
  private baseURL: string
  private timeout: number
  private cache: Map<string, { data: any; expires: number }>
  private cacheEnabled: boolean
  private cacheTTL: number

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || ''
    this.timeout = options.timeout || 30000
    this.cache = new Map()
    this.cacheEnabled = options.cache?.enabled ?? true
    this.cacheTTL = (options.cache?.ttl || 300) * 1000 // Convert to milliseconds
  }

  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET'
    const body = options?.body ? JSON.stringify(options.body) : ''
    return `${method}:${url}:${body}`
  }

  private getCached<T>(key: string): T | null {
    if (!this.cacheEnabled) return null

    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() > cached.expires) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  private setCache<T>(key: string, data: T): void {
    if (!this.cacheEnabled) return

    this.cache.set(key, {
      data,
      expires: Date.now() + this.cacheTTL,
    })
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const cacheKey = this.getCacheKey(url, options)
    const method = options.method || 'GET'

    // Check cache for GET requests
    if (method === 'GET') {
      const cached = this.getCached<T>(cacheKey)
      if (cached) {
        return {
          data: cached,
          status: 200,
          cached: true,
        }
      }
    }

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      // Add auth token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken')
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
      }

      const response = await this.fetchWithTimeout(url, {
        ...options,
        headers,
      })

      let data: T
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = (await response.text()) as T
      }

      if (!response.ok) {
        return {
          data: data as T,
          error: (data as any)?.message || `HTTP ${response.status}`,
          status: response.status,
        }
      }

      // Cache successful GET requests
      if (method === 'GET' && response.status === 200) {
        this.setCache(cacheKey, data)
      }

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      }
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  clearCache(): void {
    this.cache.clear()
  }

  invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.clearCache()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

// Create default instance
export const apiClient = new ApiClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  cache: {
    enabled: true,
    ttl: 300, // 5 minutes
  },
})

// Create custom instance helper
export function createApiClient(options: ApiClientOptions): ApiClient {
  return new ApiClient(options)
}


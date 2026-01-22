'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient, ApiResponse } from '../utils/api-client'

interface UseApiOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

export function useApi<T = any>(options: UseApiOptions<T>) {
  const { url, method = 'GET', body, immediate = true, onSuccess, onError } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let response: ApiResponse<T>

      switch (method) {
        case 'GET':
          response = await apiClient.get<T>(url)
          break
        case 'POST':
          response = await apiClient.post<T>(url, body)
          break
        case 'PUT':
          response = await apiClient.put<T>(url, body)
          break
        case 'PATCH':
          response = await apiClient.patch<T>(url, body)
          break
        case 'DELETE':
          response = await apiClient.delete<T>(url)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }

      if (response.error) {
        throw new Error(response.error)
      }

      setData(response.data)
      if (onSuccess) onSuccess(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      if (onError) onError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, method, body, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  }
}


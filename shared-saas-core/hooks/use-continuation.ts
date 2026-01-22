'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface ContinuationState<T = unknown> {
  data: T | null
  timestamp: number
  checksum: string
}

export interface UseContinuationOptions<T> {
  key: string
  maxAge?: number
  storage?: 'localStorage' | 'sessionStorage' | 'memory'
  encrypt?: boolean
  onRestore?: (data: T | null) => void
  onSave?: (data: T) => void
}

const generateChecksum = (data: unknown): string => {
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

const simpleEncrypt = (str: string): string => {
  return btoa(str.split('').reverse().join(''))
}

const simpleDecrypt = (str: string): string => {
  return atob(str).split('').reverse().join('')
}

export function useContinuation<T = unknown>(options: UseContinuationOptions<T>) {
  const { key, maxAge = 24 * 60 * 60 * 1000, storage = 'localStorage', encrypt = false, onRestore, onSave } = options
  const [data, setData] = useState<T | null>(null)
  const [isRestored, setIsRestored] = useState(false)
  const storageRef = useRef<Storage | null>(null)

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        storageRef.current = storage === 'sessionStorage' ? sessionStorage : localStorage
        const stored = storageRef.current?.getItem(key)
        
        if (stored) {
          try {
            const decrypted = encrypt ? simpleDecrypt(stored) : stored
            const parsed: ContinuationState<T> = JSON.parse(decrypted)
            
            const isExpired = Date.now() - parsed.timestamp > maxAge
            const isValid = parsed.data !== undefined && parsed.checksum === generateChecksum(parsed.data)
            
            if (!isExpired && isValid) {
              setData(parsed.data)
              onRestore?.(parsed.data)
            } else {
              onRestore?.(null)
              storageRef.current?.removeItem(key)
            }
          } catch (e) {
            onRestore?.(null)
            storageRef.current?.removeItem(key)
          }
        } else {
          onRestore?.(null)
        }
        setIsRestored(true)
      }
    } catch (e) {
      setIsRestored(true)
    }
  }, [key, maxAge, encrypt, onRestore, storage])

  const save = useCallback((newData: T) => {
    const state: ContinuationState<T> = {
      data: newData,
      timestamp: Date.now(),
      checksum: generateChecksum(newData)
    }
    
    const serialized = JSON.stringify(state)
    const toStore = encrypt ? simpleEncrypt(serialized) : serialized
    
    storageRef.current?.setItem(key, toStore)
    setData(newData)
    onSave?.(newData)
  }, [key, encrypt, onSave])

  const clear = useCallback(() => {
    storageRef.current?.removeItem(key)
    setData(null)
  }, [key])

  const update = useCallback((updater: (prev: T | null) => T) => {
    const newData = updater(data)
    save(newData)
  }, [data, save])

  return {
    data,
    save,
    clear,
    update,
    isRestored,
    isEmpty: isRestored && data === null,
    isStale: data !== null && Date.now() - (JSON.parse(storageRef.current?.getItem(key) || '{}').timestamp || 0) > maxAge
  }
}

export function useContinuationForm<T extends Record<string, unknown>>(key: string, options?: Partial<UseContinuationOptions<T>>) {
  const continuation = useContinuation<T>({
    key: `form:${key}`,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    ...options
  })

  const reset = useCallback(() => {
    continuation.save({} as T)
  }, [continuation])

  return {
    ...continuation,
    reset,
    field: useCallback((field: keyof T, value: unknown) => {
      continuation.update(prev => ({
        ...(prev || {}),
        [field]: value
      }) as T)
    }, [continuation])
  }
}

export function useContinuationPagination(key: string) {
  const continuation = useContinuation<{ page: number; pageSize: number; filters: Record<string, unknown> }>({
    key: `pagination:${key}`,
    maxAge: 30 * 60 * 1000
  })

  const setPage = useCallback((page: number) => {
    continuation.update(prev => ({
      ...(prev || { page: 1, pageSize: 10, filters: {} }),
      page
    }))
  }, [continuation])

  const setPageSize = useCallback((pageSize: number) => {
    continuation.update(prev => ({
      ...(prev || { page: 1, pageSize: 10, filters: {} }),
      pageSize
    }))
  }, [continuation])

  const setFilters = useCallback((filters: Record<string, unknown>) => {
    continuation.update(prev => ({
      ...(prev || { page: 1, pageSize: 10, filters: {} }),
      filters,
      page: 1
    }))
  }, [continuation])

  const nextPage = useCallback(() => {
    continuation.update(prev => ({
      ...(prev || { page: 1, pageSize: 10, filters: {} }),
      page: (prev?.page || 1) + 1
    }))
  }, [continuation])

  const prevPage = useCallback(() => {
    continuation.update(prev => ({
      ...(prev || { page: 1, pageSize: 10, filters: {} }),
      page: Math.max(1, (prev?.page || 1) - 1)
    }))
  }, [continuation])

  return {
    ...continuation,
    setPage,
    setPageSize,
    setFilters,
    nextPage,
    prevPage,
    page: continuation.data?.page || 1,
    pageSize: continuation.data?.pageSize || 10,
    filters: continuation.data?.filters || {}
  }
}

export function useContinuationTable<T extends Record<string, unknown>>(key: string, columns: (keyof T)[]) {
  const pagination = useContinuationPagination(key)
  const sorting = useContinuation<{ sortBy: keyof T; sortOrder: 'asc' | 'desc' }>({
    key: `sorting:${key}`,
    maxAge: 30 * 60 * 1000
  })

  const setSort = useCallback((sortBy: keyof T, sortOrder: 'asc' | 'desc' = 'asc') => {
    sorting.save({ sortBy, sortOrder })
  }, [sorting])

  const toggleSort = useCallback((sortBy: keyof T) => {
    const current = sorting.data
    if (current?.sortBy === sortBy) {
      sorting.save({ sortBy, sortOrder: current.sortOrder === 'asc' ? 'desc' : 'asc' })
    } else {
      sorting.save({ sortBy, sortOrder: 'asc' })
    }
  }, [sorting])

  return {
    ...pagination,
    ...sorting,
    setSort,
    toggleSort,
    sortBy: sorting.data?.sortBy,
    sortOrder: sorting.data?.sortOrder || 'asc'
  }
}

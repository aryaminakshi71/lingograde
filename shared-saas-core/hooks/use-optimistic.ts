'use client'

import { useState, useCallback, useRef } from 'react'

export interface OptimisticState<T> {
  data: T
  isOptimistic: boolean
  isPending: boolean
  error: Error | null
}

export interface UseOptimisticOptions<T> {
  onOptimistic?: (data: T) => void
  onSuccess?: (data: T) => void
  onError?: (error: Error, previousData: T) => void
  rollbackOnError?: boolean
}

export function useOptimistic<T>(
  initialData: T,
  options: UseOptimisticOptions<T> = {}
) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isOptimistic: false,
    isPending: false,
    error: null
  })

  const previousDataRef = useRef<T>(initialData)

  const optimisticUpdate = useCallback((newData: T | ((prev: T) => T)) => {
    const computedData = typeof newData === 'function' 
      ? (newData as (prev: T) => T)(state.data)
      : newData

    previousDataRef.current = state.data
    setState({
      data: computedData,
      isOptimistic: true,
      isPending: true,
      error: null
    })

    options.onOptimistic?.(computedData)
    return computedData
  }, [state.data, options])

  const confirmUpdate = useCallback((confirmedData?: T) => {
    const finalData = confirmedData ?? state.data
    
    setState({
      data: finalData,
      isOptimistic: false,
      isPending: false,
      error: null
    })

    options.onSuccess?.(finalData)
  }, [state.data, options])

  const rejectUpdate = useCallback((error: Error) => {
    if (options.rollbackOnError !== false) {
      setState({
        data: previousDataRef.current,
        isOptimistic: false,
        isPending: false,
        error
      })
    } else {
      setState(prev => ({
        ...prev,
        isOptimistic: false,
        isPending: false,
        error
      }))
    }

    options.onError?.(error, previousDataRef.current)
  }, [options])

  const reset = useCallback((data?: T) => {
    const newData = data ?? previousDataRef.current
    previousDataRef.current = newData
    setState({
      data: newData,
      isOptimistic: false,
      isPending: false,
      error: null
    })
  }, [])

  return {
    data: state.data,
    isOptimistic: state.isOptimistic,
    isPending: state.isPending,
    error: state.error,
    optimisticUpdate,
    confirmUpdate,
    rejectUpdate,
    reset,
    setData: (data: T | ((prev: T) => T)) => {
      const computedData = typeof data === 'function' 
        ? (data as (prev: T) => T)(state.data)
        : data
      setState(prev => ({ ...prev, data: computedData }))
    }
  }
}

export interface OptimisticListItem {
  id: string | number
}

export function useOptimisticList<T extends OptimisticListItem>(
  initialItems: T[],
  options: UseOptimisticOptions<T[]> = {}
) {
  const [items, setItems] = useState<T[]>(initialItems)
  const pendingOperations = useRef<Map<string, T>>(new Map())

  const addOptimistic = useCallback((item: T) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const optimisticItem = { ...item, id: tempId } as T & { tempId?: string }
    
    pendingOperations.current.set(String(tempId), optimisticItem)
    setItems(prev => [optimisticItem, ...prev])
    
    options.onOptimistic?.([optimisticItem, ...items])
    return tempId
  }, [items, options])

  const removeOptimistic = useCallback((tempId: string) => {
    pendingOperations.current.delete(tempId)
    setItems(prev => prev.filter(item => String((item as T & { tempId?: string }).id || item.id) !== tempId))
  }, [])

  const confirmAdd = useCallback((tempId: string, realItem: T) => {
    const tempItem = pendingOperations.current.get(tempId)
    if (tempItem) {
      pendingOperations.current.delete(tempId)
      setItems(prev => prev.map(item => 
        String((item as T & { tempId?: string }).id || item.id) === tempId ? realItem : item
      ))
      options.onSuccess?.(items)
    }
  }, [items, options])

  const rejectAdd = useCallback((tempId: string) => {
    removeOptimistic(tempId)
    options.onError?.(new Error('Add operation failed'), items)
  }, [items, options, removeOptimistic])

  const updateOptimistic = useCallback((id: string | number, updates: Partial<T>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const confirmUpdate = useCallback((id: string | number, realItem: T) => {
    setItems(prev => prev.map(item => 
      item.id === id ? realItem : item
    ))
    options.onSuccess?.(items)
  }, [items, options])

  const rejectUpdate = useCallback((id: string | number, originalItem: T) => {
    setItems(prev => prev.map(item => 
      item.id === id ? originalItem : item
    ))
    options.onError?.(new Error('Update operation failed'), items)
  }, [items, options])

  const deleteOptimistic = useCallback((id: string | number) => {
    const itemToDelete = items.find(item => item.id === id)
    if (itemToDelete) {
      pendingOperations.current.set(`delete-${id}`, itemToDelete)
      setItems(prev => prev.filter(item => item.id !== id))
      options.onOptimistic?.(items.filter(item => item.id !== id))
    }
  }, [items, options])

  const confirmDelete = useCallback((id: string | number) => {
    pendingOperations.current.delete(`delete-${id}`)
    options.onSuccess?.(items.filter(item => item.id !== id))
  }, [items, options])

  const rejectDelete = useCallback((id: string | number) => {
    const deletedItem = pendingOperations.current.get(`delete-${id}`)
    if (deletedItem) {
      pendingOperations.current.delete(`delete-${id}`)
      setItems(prev => [...prev, deletedItem])
      options.onError?.(new Error('Delete operation failed'), items)
    }
  }, [items, options])

  const moveOptimistic = useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => {
      const newItems = [...prev]
      const [removed] = newItems.splice(fromIndex, 1)
      newItems.splice(toIndex, 0, removed)
      return newItems
    })
  }, [])

  const confirmMove = useCallback(() => {
    options.onSuccess?.(items)
  }, [items, options])

  const rejectMove = useCallback((fromIndex: number, toIndex: number, originalItems: T[]) => {
    setItems(originalItems)
    options.onError?.(new Error('Move operation failed'), items)
  }, [items, options])

  return {
    items,
    setItems,
    addOptimistic,
    removeOptimistic,
    confirmAdd,
    rejectAdd,
    updateOptimistic,
    confirmUpdate,
    rejectUpdate,
    deleteOptimistic,
    confirmDelete,
    rejectDelete,
    moveOptimistic,
    confirmMove,
    rejectMove,
    pendingCount: pendingOperations.current.size,
    isPending: pendingOperations.current.size > 0
  }
}

export function useOptimisticMutation<TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<TOutput>,
  options: {
    onMutate?: (input: TInput) => void
    onSuccess?: (output: TOutput, input: TInput) => void
    onError?: (error: Error, input: TInput) => void
  } = {}
) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(async (input: TInput): Promise<{ data?: TOutput; error?: Error }> => {
    setIsPending(true)
    setError(null)

    try {
      options.onMutate?.(input)
      const data = await mutationFn(input)
      options.onSuccess?.(data, input)
      setIsPending(false)
      return { data }
    } catch (err) {
      const error = err as Error
      setError(error)
      options.onError?.(error, input)
      setIsPending(false)
      return { error }
    }
  }, [mutationFn, options])

  return {
    mutate,
    isPending,
    error,
    reset: () => {
      setIsPending(false)
      setError(null)
    }
  }
}

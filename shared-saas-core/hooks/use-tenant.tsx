// Tenant Hook

'use client'

import type {ReactNode} from 'react';
import {createContext, useContext, useState, useEffect, useCallback} from 'react'
import type {Tenant} from '../types/common'

interface TenantContextType {
  tenant: Tenant | null
  loading: boolean
  error: string | null
  updateTenant: (data: Partial<Tenant>) => Promise<void>
  refreshTenant: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | null>(null)

export function TenantProvider({ 
  children, 
  initialTenant 
}: { 
  children: ReactNode
  initialTenant?: Tenant | null
}) {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant || null)
  const [loading, setLoading] = useState(!initialTenant)
  const [error, setError] = useState<string | null>(null)

  const fetchTenant = useCallback(async () => {
    try {
      const response = await fetch('/api/tenant')
      const data = await response.json()
      
      if (data.success) {
        setTenant(data.data)
      }
    } catch {
      setError('Failed to load tenant')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialTenant) {
      fetchTenant()
    }
  }, [initialTenant, fetchTenant])

  const updateTenant = useCallback(async (data: Partial<Tenant>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/tenant', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Update failed')
      }
      
      setTenant(result.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshTenant = useCallback(async () => {
    await fetchTenant()
  }, [fetchTenant])

  return (
    <TenantContext.Provider
      value={{
        tenant,
        loading,
        error,
        updateTenant,
        refreshTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

export function useOptionalTenant() {
  return useContext(TenantContext)
}

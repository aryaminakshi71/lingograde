// Compliance Hook

'use client'

import type {ReactNode} from 'react';
import {createContext, useContext, useState, useCallback, useEffect} from 'react'
import type {ConsentRecord, DataRequest, AuditLogEntry} from '../types/common'

interface ComplianceContextType {
  // Consent
  consents: ConsentRecord[]
  hasConsent: (type: string) => boolean
  requestConsent: (type: string) => Promise<void>
  withdrawConsent: (type: string) => Promise<void>
  
  // Data requests
  dataRequests: DataRequest[]
  requestDataExport: () => Promise<void>
  requestDataDeletion: () => Promise<void>
  cancelDataRequest: (requestId: string) => Promise<void>
  
  // Audit
  auditLogs: AuditLogEntry[]
  fetchAuditLogs: (filters?: { entityType?: string; action?: string; limit?: number }) => Promise<void>
  
  // Status
  complianceStatus: {
    isCompliant: boolean
    issues: string[]
  }
}

const ComplianceContext = createContext<ComplianceContextType | null>(null)

export function ComplianceProvider({ 
  children, 
  tenantId 
}: { 
  children: ReactNode
  tenantId?: string 
}) {
  const [consents, setConsents] = useState<ConsentRecord[]>([])
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [complianceStatus, setComplianceStatus] = useState({
    isCompliant: true,
    issues: [] as string[],
  })

  // Fetch initial data
  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        const [consentsRes, requestsRes, statusRes] = await Promise.all([
          fetch('/api/compliance/consents'),
          fetch('/api/compliance/requests'),
          fetch('/api/compliance/status'),
        ])
        
        const consentsData = await consentsRes.json()
        const requestsData = await requestsRes.json()
        const statusData = await statusRes.json()
        
        if (consentsData.success) setConsents(consentsData.data)
        if (requestsData.success) setDataRequests(requestsData.data)
        if (statusData.success) setComplianceStatus(statusData.data)
      } catch (err) {
        console.error('Failed to fetch compliance data:', err)
      }
    }
    
    fetchComplianceData()
  }, [tenantId])

  const hasConsent = useCallback((type: string) => {
    const latestConsent = consents
      .filter(c => c.type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    return latestConsent?.granted ?? false
  }, [consents])

  const requestConsent = useCallback(async (type: string) => {
    try {
      const response = await fetch('/api/compliance/consent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({type, granted: true}),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setConsents(prev => [...prev, data.data])
      }
    } catch (err) {
      console.error('Failed to record consent:', err)
      throw err
    }
  }, [])

  const withdrawConsent = useCallback(async (type: string) => {
    try {
      const response = await fetch('/api/compliance/consent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({type, granted: false}),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setConsents(prev => [...prev, data.data])
      }
    } catch (err) {
      console.error('Failed to withdraw consent:', err)
      throw err
    }
  }, [])

  const requestDataExport = useCallback(async () => {
    try {
      const response = await fetch('/api/compliance/data-export', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({type: 'access'}),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDataRequests(prev => [...prev, data.data])
      }
    } catch (err) {
      console.error('Failed to request data export:', err)
      throw err
    }
  }, [])

  const requestDataDeletion = useCallback(async () => {
    try {
      const response = await fetch('/api/compliance/data-deletion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({type: 'erasure'}),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDataRequests(prev => [...prev, data.data])
      }
    } catch (err) {
      console.error('Failed to request data deletion:', err)
      throw err
    }
  }, [])

  const cancelDataRequest = useCallback(async (requestId: string) => {
    try {
      const response = await fetch(`/api/compliance/requests/${requestId}/cancel`, {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDataRequests(prev =>
          prev.map(r => r.id === requestId ? {...r, status: 'cancelled'} : r)
        )
      }
    } catch (err) {
      console.error('Failed to cancel data request:', err)
      throw err
    }
  }, [])

  const fetchAuditLogs = useCallback(async (filters?: { entityType?: string; action?: string; limit?: number }) => {
    try {
      const params = new URLSearchParams()
      if (filters?.entityType) params.set('entityType', filters.entityType)
      if (filters?.action) params.set('action', filters.action)
      if (filters?.limit) params.set('limit', String(filters.limit))
      
      const response = await fetch(`/api/compliance/audit-logs?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setAuditLogs(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err)
    }
  }, [])

  return (
    <ComplianceContext.Provider
      value={{
        consents,
        hasConsent,
        requestConsent,
        withdrawConsent,
        dataRequests,
        requestDataExport,
        requestDataDeletion,
        cancelDataRequest,
        auditLogs,
        fetchAuditLogs,
        complianceStatus,
      }}
    >
      {children}
    </ComplianceContext.Provider>
  )
}

export function useCompliance() {
  const context = useContext(ComplianceContext)
  if (!context) {
    throw new Error('useCompliance must be used within a ComplianceProvider')
  }
  return context
}

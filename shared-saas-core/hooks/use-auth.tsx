// Authentication Hook

'use client'

import type {ReactNode} from 'react';
import {createContext, useContext, useState, useEffect, useCallback} from 'react'
import type {User} from '../types/common'
import { DEMO_USER, DEMO_MODE, isDemoMode, enableDemoMode, disableDemoMode } from '../config/test-users'

interface AuthContextType {
  user: User | null
  loading: boolean
  isLoading: boolean // alias for loading
  error: string | null
  isAuthenticated: boolean
  isDemo: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<void>
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  updateUser: (data: Partial<User>) => void
  startDemo: () => void
  endDemo: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)

  // Check for existing session or demo mode on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check demo mode first
      if (isDemoMode()) {
        setUser({
          id: 'demo-user-id',
          email: DEMO_USER.email,
          firstName: DEMO_USER.firstName,
          lastName: DEMO_USER.lastName,
          avatar: '',
          tenantId: 'demo-tenant-id',
          locale: 'en',
          timezone: 'UTC',
          currency: 'USD',
          role: 'demo',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as User)
        setIsDemo(true)
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        
        if (data.success && data.data?.user) {
          setUser(data.data.user)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
  }, [])

  const startDemo = useCallback(() => {
    enableDemoMode()
    setUser({
      id: 'demo-user-id',
      email: DEMO_USER.email,
      firstName: DEMO_USER.firstName,
      lastName: DEMO_USER.lastName,
      avatar: '',
      tenantId: 'demo-tenant-id',
      locale: 'en',
      timezone: 'UTC',
      currency: 'USD',
      role: 'demo',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User)
    setIsDemo(true)
    
    // Dispatch event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'))
    }
  }, [])

  const endDemo = useCallback(() => {
    disableDemoMode()
    setUser(null)
    setIsDemo(false)
    
    // Dispatch event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'))
    }
  }, [])

  const login = useCallback(async (email: string, password: string, remember?: boolean) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, remember}),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Login failed')
      }
      
      setUser(data.data.user)
      setIsDemo(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Registration failed')
      }
      
      setUser(result.data.user)
      setIsDemo(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    
    try {
      await fetch('/api/auth/logout', {method: 'POST'})
      setUser(null)
      setIsDemo(false)
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh')
      const data = await response.json()
      
      if (data.success && data.data?.user) {
        setUser(data.data.user)
      } else {
        setUser(null)
        setIsDemo(false)
      }
    } catch (err) {
      console.error('Session refresh error:', err)
      setUser(null)
      setIsDemo(false)
    }
  }, [])

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? {...prev, ...data} : null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoading: loading,
        error,
        isAuthenticated: !!user,
        isDemo,
        login,
        register,
        logout,
        refreshSession,
        updateUser,
        startDemo,
        endDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(_requireAuth?: boolean) {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      user: null,
      loading: false,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isDemo: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      refreshSession: async () => {},
      updateUser: () => {},
      startDemo: () => {},
      endDemo: () => {},
    }
  }
  return context
}

export function useOptionalAuth() {
  return useContext(AuthContext)
}

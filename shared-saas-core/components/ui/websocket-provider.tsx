'use client'

import * as React from 'react'
import { useEffect, useState, useRef, type ReactNode } from 'react'

interface WebSocketContextType {
  isConnected: boolean
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'authorized'
  lastMessage: any
  sendMessage: (data: any) => void
  reconnectAttempts: number
  lastError: string | null
}

const WebSocketContext = React.createContext<WebSocketContextType | null>(null)

export function useWebSocket() {
  const context = React.useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

interface WebSocketProviderProps {
  children: ReactNode
  url?: string
}

export function WebSocketProvider({ children, url = 'ws://localhost:8080' }: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'authorized'>('disconnected')
  const [lastMessage, setLastMessage] = useState<any>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = () => {
    try {
      setConnectionState('connecting')
      setLastError(null)
      
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setConnectionState('connected')
        setReconnectAttempts(0)
        setLastError(null)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
        } catch {
          setLastMessage(event.data)
        }
      }

      ws.onclose = () => {
        setIsConnected(false)
        setConnectionState('disconnected')
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          setReconnectAttempts(prev => prev + 1)
          connect()
        }, 3000)
      }

      ws.onerror = (error) => {
        setLastError('WebSocket error occurred')
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      setLastError('Failed to connect')
      setConnectionState('disconnected')
    }
  }

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [url])

  const sendMessage = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        connectionState,
        lastMessage,
        sendMessage,
        reconnectAttempts,
        lastError,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

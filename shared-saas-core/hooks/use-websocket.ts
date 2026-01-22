'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createWebSocket, WebSocketClient, WebSocketMessage } from '../utils/websocket'

interface UseWebSocketOptions {
  url: string | null
  onMessage?: (data: any) => void
  onError?: (error: any) => void
  onOpen?: () => void
  onClose?: () => void
  reconnect?: boolean
  reconnectAttempts?: number
}

export function useWebSocket(options: UseWebSocketOptions) {
  const {
    url,
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnect = true,
    reconnectAttempts = 5,
  } = options

  const wsRef = useRef<WebSocketClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)

  const send = useCallback((data: WebSocketMessage | any) => {
    if (wsRef.current && wsRef.current.isConnected) {
      wsRef.current.send(data)
    }
  }, [])

  useEffect(() => {
    if (!url) return

    const ws = createWebSocket(url)
    wsRef.current = ws

    ws.on('open', () => {
      setIsConnected(true)
      if (onOpen) onOpen()
    })

    ws.on('close', () => {
      setIsConnected(false)
      if (onClose) onClose()
    })

    ws.on('error', (error) => {
      if (onError) onError(error)
    })

    ws.on('message', (message: WebSocketMessage) => {
      setLastMessage(message.data)
      if (onMessage) onMessage(message.data)
    })

    ws.connect().catch((error) => {
      if (onError) onError(error)
    })

    return () => {
      ws.disconnect()
    }
  }, [url, onMessage, onError, onOpen, onClose])

  return {
    send,
    isConnected,
    lastMessage,
  }
}


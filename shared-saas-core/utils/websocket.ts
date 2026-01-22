// WebSocket client for real-time updates

export type WebSocketEventType = 'message' | 'error' | 'open' | 'close' | 'reconnect'

export interface WebSocketMessage {
  type: string
  data: any
  timestamp?: number
}

export type WebSocketEventHandler = (data: any) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null
  private eventHandlers: Map<WebSocketEventType, Set<WebSocketEventHandler>> = new Map()
  private messageHandlers: Map<string, Set<WebSocketEventHandler>> = new Map()
  private isManualClose = false

  constructor(url: string) {
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          this.reconnectAttempts = 0
          this.isManualClose = false
          this.startHeartbeat()
          this.emit('open', null)
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            
            // Handle heartbeat
            if (message.type === 'ping') {
              this.send({ type: 'pong' })
              return
            }

            // Emit message event
            this.emit('message', message)

            // Emit type-specific handlers
            if (message.type) {
              const handlers = this.messageHandlers.get(message.type)
              if (handlers) {
                handlers.forEach((handler) => handler(message.data))
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onerror = (error) => {
          this.emit('error', error)
          reject(error)
        }

        this.ws.onclose = () => {
          this.stopHeartbeat()
          this.emit('close', null)

          // Auto-reconnect if not manually closed
          if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000) // Max 30 seconds

            this.reconnectTimer = setTimeout(() => {
              this.connect().catch(console.error)
            }, this.reconnectDelay)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    this.isManualClose = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(data: WebSocketMessage | any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: typeof data === 'object' && data.type ? data.type : 'message',
        data: typeof data === 'object' && data.type ? data.data : data,
        timestamp: Date.now(),
      }
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  on(event: WebSocketEventType, handler: WebSocketEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)
  }

  off(event: WebSocketEventType, handler: WebSocketEventHandler): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  onMessage(type: string, handler: WebSocketEventHandler): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set())
    }
    this.messageHandlers.get(type)!.add(handler)
  }

  offMessage(type: string, handler: WebSocketEventHandler): void {
    const handlers = this.messageHandlers.get(type)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  private emit(event: WebSocketEventType, data: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' })
      }
    }, 30000) // Send ping every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Create WebSocket instance helper
export function createWebSocket(url: string): WebSocketClient {
  return new WebSocketClient(url)
}

// React hook for WebSocket (to be used in components)
export function useWebSocket(url: string | null) {
  if (typeof window === 'undefined') {
    return {
      ws: null,
      connect: () => Promise.resolve(),
      disconnect: () => {},
      send: () => {},
      isConnected: false,
    }
  }

  const ws = url ? createWebSocket(url) : null

  return {
    ws,
    connect: () => ws?.connect() ?? Promise.resolve(),
    disconnect: () => ws?.disconnect(),
    send: (data: any) => ws?.send(data),
    isConnected: ws?.isConnected ?? false,
  }
}


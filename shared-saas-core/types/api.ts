// API Types

import type {NextRequest} from 'next/server'

// ============================================================================
// Route Handler Types
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS'

export interface RouteContext {
  params: Record<string, string>
  searchParams: Record<string, string | string[] | undefined>
}

export type RouteHandler = (
  request: NextRequest,
  context: RouteContext
) => Promise<Response>

// ============================================================================
// Request Validation
// ============================================================================

export interface ValidationSchema<T = any> {
  parse: (data: unknown) => T
  safeParse: (data: unknown) => { success: boolean; data?: T; error?: any }
}

export interface RequestValidator {
  body?: ValidationSchema
  query?: ValidationSchema
  params?: ValidationSchema
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  tenantName?: string
  locale?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: 'Bearer'
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    avatar?: string
    role: string
    tenantId?: string
    tenantName?: string
    tenantPlan?: string
  }
  tokens: AuthTokens
}

// ============================================================================
// Rate Limiting
// ============================================================================

export interface RateLimitConfig {
  windowMs: number
  max: number
  message?: string
  headers?: boolean
}

// RateLimitResult is defined in lib/rate-limit.ts

// ============================================================================
// Error Codes (Standardized)
// ============================================================================

export const ErrorCodes = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  REFRESH_TOKEN_INVALID: 'REFRESH_TOKEN_INVALID',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_VALUE: 'INVALID_VALUE',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Rate Limiting
  RATE_LIMITED: 'RATE_LIMITED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  
  // Compliance
  CONSENT_REQUIRED: 'CONSENT_REQUIRED',
  DATA_REQUEST_PENDING: 'DATA_REQUEST_PENDING',
  COMPLIANCE_ERROR: 'COMPLIANCE_ERROR',
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

// ============================================================================
// Pagination
// ============================================================================

export interface PaginationInput {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CursorPaginationInput {
  cursor?: string
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit)
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface WebhookEvent<T = any> {
  id: string
  type: string
  timestamp: Date
  data: T
}

export interface WebhookPayload {
  event: string
  timestamp: string
  data: Record<string, any>
  tenantId?: string
  userId?: string
}

export interface WebhookSubscription {
  id: string
  url: string
  events: string[]
  secret: string
  active: boolean
  createdAt: Date
  lastTriggeredAt?: Date
}

// ============================================================================
// Search & Filter
// ============================================================================

export interface SearchParams {
  query?: string
  filters?: Record<string, any>
  dateRange?: {
    field: string
    from: Date
    to: Date
  }
}

export interface SortParams {
  field: string
  order: 'asc' | 'desc'
}

// ============================================================================
// File Upload
// ============================================================================

export interface UploadConfig {
  maxSize: number // in bytes
  allowedTypes: string[]
  generateFilename?: (originalName: string) => string
}

export interface UploadResult {
  url: string
  path: string
  filename: string
  size: number
  type: string
}

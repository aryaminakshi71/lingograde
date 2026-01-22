// Common Types for All Apps

import {type LucideIcon} from 'lucide-react'

// ============================================================================
// User & Authentication
// ============================================================================

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  phone?: string
  locale: string
  timezone: string
  currency: string
  tenantId?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer' | 'demo'

export interface Session {
  user: User
  accessToken: string
  refreshToken?: string
  expiresAt: Date
}

// ============================================================================
// Tenant (Organization)
// ============================================================================

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: SubscriptionPlan
  status: TenantStatus
  logo?: string
  website?: string
  
  // Compliance
  gdprEnabled: boolean
  dataResidency?: DataResidencyRegion
  complianceFeatures: ComplianceFeature[]
  
  // Subscription
  stripeCustomerId?: string
  subscriptionEndsAt?: Date
  
  createdAt: Date
  updatedAt: Date
}

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise'
export type TenantStatus = 'active' | 'suspended' | 'cancelled' | 'trial'
export type DataResidencyRegion = 'eu' | 'us' | 'in' | 'cn' | 'au' | 'jp' | 'br' | 'global'
export type ComplianceFeature = 'gdpr' | 'ccpa' | 'hipaa' | 'pci' | 'soc2' | 'iso27001'

// ============================================================================
// Localization
// ============================================================================

export interface LocaleConfig {
  code: string
  name: string
  nativeName: string
  rtl: boolean
  currency: string
  dateFormat: string
  numberFormat: string
  timezone: string
}

export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
  decimalDigits: number
  thousandsSeparator: string
  decimalSeparator: string
}

export interface TimezoneConfig {
  name: string
  abbreviation: string
  offset: string
  dst: boolean
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: true
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, any>
    validation?: ValidationError[]
  }
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  fullWidth?: boolean
  onClick?: () => void
}

export interface InputProps extends BaseProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  value?: string
  defaultValue?: string
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onChange?: (value: string) => void
}

export interface CardProps extends BaseProps {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  shadow?: boolean
}

export interface ModalProps extends BaseProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlay?: boolean
  showCloseButton?: boolean
}

// ============================================================================
// Feature Flags
// ============================================================================

export interface FeatureFlags {
  // Core features
  multiTenant: boolean
  customBranding: boolean
  whiteLabel: boolean
  
  // Compliance
  gdpr: boolean
  ccpa: boolean
  hipaa: boolean
  pciDss: boolean
  
  // Integrations
  apiAccess: boolean
  webhooks: boolean
  sso: boolean
  twoFactor: boolean
  
  // Analytics
  analytics: boolean
  auditLogs: boolean
  customReports: boolean
}

// ============================================================================
// Compliance Types
// ============================================================================

export interface ConsentRecord {
  userId: string
  tenantId?: string
  type: 'gdpr' | 'ccpa' | 'hipaa' | 'marketing' | 'analytics' | 'terms' | 'privacy'
  granted: boolean
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  version: string
}

export interface DataRequest {
  id: string
  userId: string
  tenantId?: string
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection'
  status: 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled'
  requestedAt: Date
  dueAt: Date
  completedAt?: Date
  cancelledAt?: Date
  rejectedAt?: Date
  rejectedReason?: string
  notes?: string
  format?: string
  priority: 'normal' | 'urgent'
}

export interface AuditLogEntry {
  id: string
  userId?: string
  tenantId?: string
  action: string
  entityType: string
  entityId?: string
  oldValue?: Record<string, any>
  newValue?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  location?: string
  timestamp: Date
}

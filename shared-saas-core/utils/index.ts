// Utility Functions

import {clsx, type ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'

// ============================================================================
// Class Name Utilities
// ============================================================================

/**
 * Merge Tailwind CSS classes with clsx - use this instead of clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Conditionally join class names
 */
export function cc(condition: boolean, trueClass: string, falseClass: string = ''): string {
  return condition ? trueClass : falseClass
}

/**
 * Join array of classes, filtering out empty values
 */
export function joinClasses(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ')
}

// ============================================================================
// String Utilities
// ============================================================================

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')        // Remove all non-word chars
    .replace(/-+/g, '-')            // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '')             // Trim - from end
}

/**
 * Generate a unique ID
 */
export function generateId(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Convert to title case
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get initials from a name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('')
}

/**
 * Mask email for privacy
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  
  const maskedLocal = local.charAt(0) + '*'.repeat(Math.max(local.length - 2, 1)) + local.charAt(local.length - 1)
  return `${maskedLocal}@${domain}`
}

/**
 * Mask phone number for privacy
 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '*'.repeat(digits.length)
  return '*'.repeat(digits.length - 4) + digits.slice(-4)
}

// ============================================================================
// Number Utilities
// ============================================================================

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format number with locale-specific separators
 */
export function formatNumber(num: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Format large numbers (1K, 1M, 1B, etc.)
 */
export function formatCompactNumber(num: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(num)
}

/**
 * Format percentage
 */
export function formatPercent(
  value: number,
  options?: {
    decimals?: number
    showSign?: boolean
    locale?: string
  }
): string {
  const {decimals = 0, showSign = false, locale = 'en'} = options || {}
  
  const formatted = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
  
  return showSign && value > 0 ? `+${formatted}` : formatted
}

/**
 * Parse number from locale-formatted string
 */
export function parseNumber(value: string, locale: string = 'en'): number {
  // Remove thousand separators and replace decimal separator with dot
  const normalized = value
    .replace(new RegExp(`\\s|${Intl.NumberFormat(locale).format(1111).replace(/1/g, '')}`, 'g'), '')
    .replace(Intl.NumberFormat(locale).format(1.1).replace(/1/g, ''), '.')
  
  return parseFloat(normalized) || 0
}

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'en'
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    short: {month: 'numeric', day: 'numeric', year: '2-digit'},
    medium: {month: 'short', day: 'numeric', year: 'numeric'},
    long: {month: 'long', day: 'numeric', year: 'numeric'},
    full: {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'},
  }
  
  return new Intl.DateTimeFormat(locale, formats[format]).format(d)
}

/**
 * Format time for display
 */
export function formatTime(
  date: Date | string,
  format: '12h' | '24h' = '12h',
  locale: string = 'en'
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12h',
  }).format(d)
}

/**
 * Format date and time together
 */
export function formatDateTime(
  date: Date | string,
  format: 'short' | 'medium' = 'medium',
  locale: string = 'en'
): string {
  return `${formatDate(date, format, locale)} ${formatTime(date, '12h', locale)}`
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string, locale: string = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  const rtf = new Intl.RelativeTimeFormat(locale, {numeric: 'auto'})
  
  if (diffSecs < 60) return rtf.format(-diffSecs, 'second')
  if (diffMins < 60) return rtf.format(-diffMins, 'minute')
  if (diffHours < 24) return rtf.format(-diffHours, 'hour')
  if (diffDays < 30) return rtf.format(-diffDays, 'day')
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month')
  return rtf.format(-Math.floor(diffDays / 365), 'year')
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('At least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('At least one number')
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('At least one special character')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

// ============================================================================
// Object Utilities
// ============================================================================

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Remove undefined/null values from object
 */
export function cleanObject<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
  ) as T
}

/**
 * Pick specific keys from object
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key]
    return acc
  }, {} as Pick<T, K>)
}

/**
 * Omit specific keys from object
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = {...obj}
  keys.forEach(key => delete result[key])
  return result
}

// ============================================================================
// Async Utilities
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options?: {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
    onRetry?: (error: any, attempt: number) => void
  }
): Promise<T> {
  const {maxAttempts = 3, baseDelay = 1000, maxDelay = 10000, onRetry} = options || {}
  
  let lastError: any
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (onRetry) onRetry(error, attempt)
      
      if (attempt < maxAttempts) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)
        await sleep(delay)
      }
    }
  }
  
  throw lastError
}

// ============================================================================
// Color Utilities
// ============================================================================

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Check if color is dark
 */
export function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex)
  if (!rgb) return true
  
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance < 0.5
}

/**
 * Generate contrasting text color (black or white) for a background
 */
export function getContrastColor(hex: string): string {
  return isColorDark(hex) ? '#ffffff' : '#000000'
}

// ============================================================================
// Additional Utility Functions
// ============================================================================

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str
    .toLowerCase()
    .split('_')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('')
}

/**
 * Generate a color from a string (for avatars, etc.)
 */
export function generateColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}

/**
 * Group array items by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * Sort array by a key
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Get unique items from array, optionally by key
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (!key) return [...new Set(array)]
  const seen = new Set()
  return array.filter((item) => {
    const val = item[key]
    if (seen.has(val)) return false
    seen.add(val)
    return true
  })
}

/**
 * Split array into chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Download data as JSON file
 */
export function downloadAsJson(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Download data as CSV file
 */
export function downloadAsCsv(data: any[], filename: string): void {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header]
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value ?? ''
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// Export new utilities
export * from './api-client'
export * from './cache'
export * from './lazy-load'
export * from './mobile'

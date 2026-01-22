export const APP_CONFIG = {
  name: 'ABC Software',
  description: 'Modern SaaS Platform',
  version: '1.0.0',
  apiVersion: 'v1',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
} as const;

export const AUTH_CONFIG = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  passwordMinLength: 8,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  mfaEnabled: true,
} as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;

export const DATE_FORMATS = {
  display: 'MMM d, yyyy',
  displayTime: 'MMM d, yyyy h:mm a',
  displayDateTime: 'MMM d, yyyy h:mm a',
  api: 'yyyy-MM-dd',
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  time: 'h:mm a',
} as const;

export const CURRENCY = {
  default: 'USD',
  locales: ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'ja-JP'],
} as const;

export const TIMEZONE = {
  default: 'UTC',
} as const;

export const LOCALE = {
  default: 'en',
  supported: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'pt', 'ar'],
} as const;

export const ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
  MFA_REQUIRED: 'MFA_REQUIRED',
  INVALID_MFA_CODE: 'INVALID_MFA_CODE',
  
  // Authorization
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // File upload
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  VIEWER: 'viewer',
} as const;

export const PERMISSIONS = {
  // Users
  'users:read': 'View users',
  'users:write': 'Create/edit users',
  'users:delete': 'Delete users',
  'users:manage_roles': 'Manage user roles',
  
  // Settings
  'settings:read': 'View settings',
  'settings:write': 'Edit settings',
  
  // Reports
  'reports:read': 'View reports',
  'reports:export': 'Export reports',
  
  // API
  'api:read': 'Use API',
  'api:manage': 'Manage API keys',
} as const;

export const FEATURE_FLAGS = {
  mfa: 'Enable MFA',
  socialLogin: 'Social login',
  apiAccess: 'API access',
  analytics: 'Analytics',
  export: 'Export data',
  darkMode: 'Dark mode',
  notifications: 'Notifications',
} as const;

export const ANALYTICS_EVENTS = {
  // User events
  SIGN_UP: 'user.sign_up',
  SIGN_IN: 'user.sign_in',
  SIGN_OUT: 'user.sign_out',
  PASSWORD_RESET: 'user.password_reset',
  PROFILE_UPDATE: 'user.profile_update',
  
  // Feature events
  FEATURE_USED: 'feature.used',
  PAGE_VIEW: 'page.view',
  SEARCH: 'search.query',
  
  // Business events
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPGRADED: 'subscription.upgraded',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  PAYMENT_RECEIVED: 'payment.received',
  
  // Error events
  ERROR_OCCURRED: 'error.occurred',
  API_ERROR: 'api.error',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  PREFERENCES: 'preferences',
  LAST_SYNC: 'last_sync',
  OFFLINE_DATA: 'offline_data',
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verifyEmail: '/api/auth/verify-email',
    enableMfa: '/api/auth/enable-mfa',
    verifyMfa: '/api/auth/verify-mfa',
  },
  users: {
    list: '/api/users',
    get: '/api/users/:id',
    create: '/api/users',
    update: '/api/users/:id',
    delete: '/api/users/:id',
  },
  settings: {
    get: '/api/settings',
    update: '/api/settings',
  },
  analytics: {
    dashboard: '/api/analytics/dashboard',
    metrics: '/api/analytics/metrics',
    events: '/api/analytics/events',
  },
} as const;

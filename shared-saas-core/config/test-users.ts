// Test User Configuration - For development and demo purposes
// ⚠️ WARNING: Remove or change these credentials before production deployment

export const TEST_USER = {
  email: 'test@company.com',
  password: 'Test@123',
  firstName: 'Test',
  lastName: 'User',
  company: 'Demo Company',
  avatarUrl: '',
}

export const DEMO_USER = {
  email: 'demo@company.com',
  password: 'demo',
  firstName: 'Demo',
  lastName: 'User',
  company: 'Demo Company',
  role: 'demo',
}

// Seed data for testing
export const SEED_DATA = {
  users: [
    {
      email: 'test@company.com',
      password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Pre-hashed "Test@123"
      firstName: 'Test',
      lastName: 'User',
      role: 'owner',
    },
    {
      email: 'admin@company.com',
      password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Pre-hashed "Admin@123"
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
    {
      email: 'demo@company.com',
      password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Pre-hashed "demo"
      firstName: 'Demo',
      lastName: 'User',
      role: 'member',
    },
  ],
  tenants: [
    {
      name: 'Demo Company',
      slug: 'demo-company',
      plan: 'professional',
      status: 'active',
      maxUsers: 100,
    },
    {
      name: 'Test Organization',
      slug: 'test-organization',
      plan: 'starter',
      status: 'trial',
      maxUsers: 10,
    },
  ],
}

// API endpoints for auth (all apps share the same auth system)
export const AUTH_ENDPOINTS = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  session: '/api/auth/session',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/reset-password',
  verifyEmail: '/api/auth/verify-email',
}

// Demo mode configuration
export const DEMO_MODE = {
  enabled: true,
  cookieName: 'demo_mode',
  localStorageKey: 'demo_mode',
  durationDays: 14,
  features: {
    allowAllFeatures: true,
    showWatermark: false,
    maxRecords: 100,
    dataPersists: false,
  },
}

// Check if running in demo mode
export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    localStorage.getItem(DEMO_MODE.localStorageKey) === 'true' ||
    document.cookie.includes(`${DEMO_MODE.cookieName}=true`)
  )
}

// Enable demo mode
export function enableDemoMode(): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(DEMO_MODE.localStorageKey, 'true')
  document.cookie = `${DEMO_MODE.cookieName}=true; max-age=${DEMO_MODE.durationDays * 24 * 60 * 60}; path=/`
  
  // Dispatch event for other components to react
  window.dispatchEvent(new Event('demo-mode-enabled'))
}

// Disable demo mode
export function disableDemoMode(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(DEMO_MODE.localStorageKey)
  document.cookie = `${DEMO_MODE.cookieName}=; max-age=0; path=/`
  
  // Dispatch event for other components to react
  window.dispatchEvent(new Event('demo-mode-disabled'))
}

// Get demo user object (for display purposes)
export function getDemoUser() {
  return {
    ...DEMO_USER,
    isDemo: true,
    tenant: {
      name: 'Demo Company',
      plan: 'professional',
    },
  }
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, Button, Input, Alert } from '@shared/saas-core/components/ui'

interface EnhancedLoginProps {
  appName: string
  logo?: string
  primaryColor?: string
  redirectTo?: string
  showDemo?: boolean
  demoEmail?: string
  apiEndpoint?: string
}

export default function EnhancedLogin({
  appName,
  logo,
  primaryColor = '#3b82f6',
  redirectTo = '/dashboard',
  showDemo = true,
  demoEmail,
  apiEndpoint = '/api/auth/login'
}: EnhancedLoginProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [redirect, setRedirect] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const redirectParam = searchParams.get('redirect')
    if (redirectParam) {
      setRedirect(redirectParam)
    }
    
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          router.push('/apps')
        }
      } finally {
        setIsChecking(false)
      }
    }
    checkAuth()
  }, [searchParams, router])

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Please enter a valid email'
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEmailError('')
    setPasswordError('')

    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)

    if (emailErr) {
      setEmailError(emailErr)
      return
    }
    if (passwordErr) {
      setPasswordError(passwordErr)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
        window.dispatchEvent(new Event('auth-change'))
        
        setTimeout(() => {
          const redirectPath = redirect || redirectTo
          if (redirectPath === '/') {
            window.location.href = '/'
          } else {
            router.push(redirectPath)
          }
        }, 100)
      } else {
        setError(data.error?.message || 'Invalid email or password')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    window.location.href = '/api/auth/google'
  }

  const handleDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_mode', 'true')
      localStorage.setItem('user', JSON.stringify({ 
        id: 'demo', 
        email: demoEmail || `demo@${appName.toLowerCase().replace(/\s+/g, '')}.com`, 
        firstName: 'Demo', 
        role: 'admin' 
      }))
      window.dispatchEvent(new Event('auth-change'))
      router.push('/apps')
    }
  }

  const handleForgotPassword = () => {
    router.push(`/forgot-password${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`)
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {logo && <span className="text-4xl mb-3 block">{logo}</span>}
            <h1 className="text-3xl font-bold text-white mt-3">{appName}</h1>
          </div>
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2" style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} className="rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          {logo && <span className="text-4xl mb-3 block">{logo}</span>}
          <h1 className="text-3xl font-bold text-white mt-3">{appName}</h1>
          <p className="text-slate-400 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError('')
              }}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${emailError ? 'border-red-500' : 'border-slate-600'}`}
              autoComplete="email"
            />
            {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-white mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) setPasswordError('')
                }}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-blue-500 pr-12 ${passwordError ? 'border-red-500' : 'border-slate-600'}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9 011.563.97 0-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-slate-400 text-sm">Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm hover:underline"
              style={{ color: primaryColor }}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-600 rounded-lg text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>
        </div>

        {showDemo && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Or try the demo</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemo}
              className="mt-4 w-full py-3 rounded-lg text-white font-medium transition-colors bg-green-600 hover:bg-green-700"
            >
              Try Demo (No Sign In Required)
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-slate-400">
            Don't have an account?{' '}
            <Link 
              href={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'} 
              className="font-medium hover:underline"
              style={{ color: primaryColor }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

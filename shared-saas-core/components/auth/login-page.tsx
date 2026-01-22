'use client'

// Standardized Login Page Component - Used across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import * as React from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Mail, Lock, ArrowLeft, LogIn } from 'lucide-react'
import { cn } from '../../lib'

interface LoginPageProps {
  appName?: string
  themeColor?: string
  themeColorSecondary?: string
  logoIcon?: React.ReactNode
  dashboardHref?: string
  registerHref?: string
  demoHref?: string
  onLogin?: (email: string, password: string) => Promise<boolean>
}

export function LoginPage({
  appName = 'App',
  themeColor,
  themeColorSecondary,
  logoIcon,
  dashboardHref = '/dashboard',
  registerHref = '/register',
  demoHref = '/demo',
  onLogin,
}: LoginPageProps) {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (onLogin) {
        const success = await onLogin(email, password)
        if (success) {
          navigate({ to: dashboardHref })
        } else {
          setError('Invalid credentials')
        }
      } else {
        // Default demo login - accept any credentials
        const user = {
          id: 'user-' + Date.now(),
          email: email,
          firstName: email.split('@')[0],
          lastName: '',
          role: 'user',
          createdAt: new Date().toISOString(),
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user))
        }
        navigate({ to: dashboardHref })
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex flex-col dark:from-background dark:via-background dark:to-muted/10">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              {logoIcon || (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground">
                  <span className="font-bold text-lg">{appName.charAt(0)}</span>
                </div>
              )}
              <span className="text-xl font-bold text-foreground">{appName}</span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center text-muted-foreground hover:text-foreground no-underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-primary/10 dark:bg-primary/20">
              <LogIn className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Sign in to your {appName} account
            </p>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium no-underline hover:underline text-primary"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-semibold bg-primary text-primary-foreground flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">Or</span>
              </div>
            </div>

            <Link
              to={demoHref}
              className="w-full py-4 rounded-xl font-semibold border-2 border-border flex items-center justify-center gap-2 transition-all hover:bg-accent hover:border-accent no-underline text-foreground"
            >
              Try Demo Instead
            </Link>

            <p className="text-center text-muted-foreground mt-6">
              Don&apos;t have an account?{' '}
              <Link 
                to={registerHref} 
                className="font-medium no-underline hover:underline text-primary"
              >
                Sign Up
              </Link>
            </p>

            {/* Test Credentials Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs font-semibold text-foreground mb-2">Test Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Test User:</span> test@company.com / Test@123
                </div>
                <div>
                  <span className="font-medium">Demo User:</span> demo@company.com / demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

// Standardized Demo Page Component - Used across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import * as React from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Play, ArrowLeft, Sparkles } from 'lucide-react'
import { cn } from '../../lib'

interface DemoPageProps {
  appName?: string
  appDescription?: string
  themeColor?: string
  themeColorSecondary?: string
  logoIcon?: React.ReactNode
  dashboardHref?: string
  features?: string[]
  onStartDemo?: () => void
}

export function DemoPage({
  appName = 'App',
  appDescription = 'Experience the full power of our platform',
  themeColor,
  themeColorSecondary,
  logoIcon,
  dashboardHref = '/dashboard',
  features = [
    'Full access to all features',
    'Sample data pre-loaded',
    'No credit card required',
    'Demo resets after 24 hours',
  ],
  onStartDemo,
}: DemoPageProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleStartDemo = async () => {
    setIsLoading(true)
    
    if (typeof window === 'undefined') return
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin',
      isDemo: true,
      createdAt: new Date().toISOString(),
    }
    
    localStorage.setItem('user', JSON.stringify(demoUser))
    localStorage.setItem('isDemo', 'true')
    localStorage.setItem('demo_mode', 'true')
    
    if (onStartDemo) {
      await onStartDemo()
    }
    
    setTimeout(() => {
      navigate({ to: dashboardHref })
    }, 500)
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
              <Sparkles className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              Try {appName} Demo
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {appDescription}
            </p>

            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg 
                    className="w-5 h-5 mr-3 flex-shrink-0 text-primary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartDemo}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-semibold bg-primary text-primary-foreground flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Starting Demo...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Demo
                </>
              )}
            </button>

            <p className="text-center text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium no-underline hover:underline text-primary"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

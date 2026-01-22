'use client'

// Unified Navigation Component - Used across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth as useAuthHook } from '../../hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Dropdown, DropdownItem } from '../ui/dropdown'
import { ThemeToggle } from '../ui/theme-toggle'
import { cn } from '../../lib/index'
import type { User } from '../../types/common'

interface NavItem {
  label: string
  href: string
}

interface NavigationProps {
  logo?: React.ReactNode
  logoText?: string
  navItems?: NavItem[]
  ctaText?: string
  ctaHref?: string
  signInHref?: string
  themeColor?: string
  className?: string
}

// Safe hook wrapper that returns default values if context is not available
function useAuth() {
  try {
    const auth = useAuthHook()
    return auth
  } catch {
    return {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isDemo: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      refreshSession: async () => {},
      updateUser: () => {},
      startDemo: () => {},
      endDemo: () => {},
    }
  }
}

export function Navigation({
  logo,
  logoText = 'App',
  navItems = [],
  ctaText,
  ctaHref,
  signInHref = '/login',
  themeColor,
  className,
}: NavigationProps) {
  const { user, loading, logout, isDemo, startDemo } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded">
        Skip to main content
      </a>
      <nav className={cn('border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50', className)} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {logo || (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground"
                  aria-hidden="true"
                >
                  <span className="font-bold text-lg">{logoText.charAt(0)}</span>
                </div>
              )}
              <Link to="/" className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity" aria-label={`${logoText} Home`}>
                {logoText}
              </Link>
            </div>

            {navItems.length > 0 && (
              <div className="hidden md:flex items-center space-x-8" role="menubar">
                {navItems.map((item, index) => {
                  // Handle hash links (like #features) differently
                  if (item.href.startsWith('#')) {
                    return (
                      <a
                        key={index}
                        href={item.href}
                        className="text-muted-foreground font-medium hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded"
                        role="menuitem"
                        aria-label={item.label}
                      >
                        {item.label}
                      </a>
                    )
                  }
                  return (
                    <Link
                      key={index}
                      to={item.href}
                      className="text-muted-foreground font-medium hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded"
                      role="menuitem"
                      aria-label={item.label}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-muted-foreground font-medium hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded px-2 py-1"
                    aria-label="Go to Dashboard"
                  >
                    Dashboard
                  </Link>
                  <Dropdown
                    trigger={
                      <button 
                        className="flex items-center space-x-2 focus:outline-none cursor-pointer rounded focus:ring-2 focus:ring-offset-2 focus:ring-ring px-2 py-1"
                        aria-label="User menu"
                        aria-expanded={false}
                        aria-haspopup="true"
                      >
                        <Avatar className="h-8 w-8" aria-hidden="true">
                          {(user as any).avatarUrl ? (
                            <AvatarImage src={(user as any).avatarUrl} alt={`${(user as any).firstName || 'User'} avatar`} />
                          ) : (
                            <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                              {(user as any).firstName ? getInitials(`${(user as any).firstName} ${(user as any).lastName || ''}`) : 'U'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-foreground font-medium hidden sm:block" aria-hidden="true">
                          {(user as any).firstName || (user as any).email?.split('@')[0] || 'User'}
                        </span>
                      </button>
                    }
                  >
                    <DropdownItem onClick={() => { if (typeof window !== 'undefined') window.location.href = '/settings' }} role="menuitem">
                      Settings
                    </DropdownItem>
                    <DropdownItem onClick={() => { if (typeof window !== 'undefined') window.location.href = '/billing' }} role="menuitem">
                      Billing
                    </DropdownItem>
                    {isDemo && (
                      <DropdownItem onClick={startDemo} role="menuitem">
                        Try Full Version
                      </DropdownItem>
                    )}
                    <DropdownItem onClick={handleLogout} className="text-destructive" role="menuitem">
                      Sign Out
                    </DropdownItem>
                  </Dropdown>
                </>
              ) : !loading ? (
                <>
                  <Link
                    to="/demo"
                    className="text-muted-foreground font-medium hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded px-2 py-1"
                    aria-label="Try demo version"
                  >
                    Try Demo
                  </Link>
                  <Link
                    to={signInHref}
                    className="text-muted-foreground font-medium hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring rounded px-2 py-1"
                    aria-label="Sign in to your account"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <div className="h-8 w-20 bg-muted animate-pulse rounded" aria-label="Loading" />
              )}
            </div>
          </div>
        </div>
      </nav>
      <main id="main-content" tabIndex={-1} />
    </>
  )
}

// Default nav items for reference
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Industries', href: '/apps' },
]

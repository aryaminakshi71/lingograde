'use client'

// Standardized SaaS Header Component - Used across all apps
// Includes: Logo, Nav Links, Try Demo, Sign In

import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '../../lib/index'

interface NavItem {
  label: string
  href: string
}

interface SaaSHeaderProps {
  logo?: React.ReactNode
  logoText?: string
  logoIcon?: React.ReactNode
  navItems?: NavItem[]
  themeColor?: string
  themeColorSecondary?: string
  className?: string
  demoHref?: string
  signInHref?: string
  showDemo?: boolean
  showSignIn?: boolean
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
]

export function SaaSHeader({
  logo,
  logoText = 'App',
  logoIcon,
  navItems = DEFAULT_NAV_ITEMS,
  themeColor = '#3b82f6',
  themeColorSecondary,
  className,
  demoHref = '/demo',
  signInHref = '/login',
  showDemo = true,
  showSignIn = true,
}: SaaSHeaderProps) {
  const gradientTo = themeColorSecondary || `${themeColor}dd`

  return (
    <nav className={cn('border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 no-underline">
            {logo || (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${themeColor}, ${gradientTo})` }}
              >
                {logoIcon || (
                  <span className="text-white font-bold text-lg">{logoText.charAt(0)}</span>
                )}
              </div>
            )}
            <span className="text-xl font-bold text-gray-900">{logoText}</span>
          </Link>

          {/* Nav Items + Auth */}
          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
            {navItems.map((item, index) => {
              // Handle hash links (like #features) differently
              if (item.href.startsWith('#')) {
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="text-gray-600 font-medium hover:text-gray-900 no-underline hidden md:block"
                  >
                    {item.label}
                  </a>
                )
              }
              return (
                <Link
                  key={index}
                  to={item.href}
                  className="text-gray-600 font-medium hover:text-gray-900 no-underline hidden md:block"
                >
                  {item.label}
                </Link>
              )
            })}

            {/* Try Demo */}
            {showDemo && (
              <Link
                to={demoHref}
                className="text-gray-600 font-medium hover:text-gray-900 no-underline"
              >
                Try Demo
              </Link>
            )}

            {/* Sign In */}
            {showSignIn && (
              <Link
                to={signInHref}
                className="text-gray-600 font-medium hover:text-gray-900 no-underline"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export { DEFAULT_NAV_ITEMS as HEADER_DEFAULT_NAV_ITEMS }

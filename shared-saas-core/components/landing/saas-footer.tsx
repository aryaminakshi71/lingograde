'use client'

// Standardized SaaS Footer Component - Used across all apps

import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '../../lib/index'

interface FooterLink {
  label: string
  href: string
}

interface SaaSFooterProps {
  appName?: string
  themeColor?: string
  showStripe?: boolean
  className?: string
  links?: FooterLink[]
  showNewsletter?: boolean
  newsletterTitle?: string
  newsletterSubtitle?: string
}

export function SaaSFooter({
  appName = 'App',
  themeColor = '#3b82f6',
  showStripe = true,
  className,
  links = [],
  showNewsletter = false,
  newsletterTitle = 'Stay Updated',
  newsletterSubtitle = 'Get tips and product updates.',
}: SaaSFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <>
      {/* Newsletter Section (Optional) */}
      {showNewsletter && (
        <section 
          className="py-20 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: themeColor }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">{newsletterTitle}</h2>
            <p className="text-xl text-white/80 mb-8">{newsletterSubtitle}</p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-5 py-3 rounded-xl text-gray-900" 
              />
              <button 
                type="submit" 
                className="px-8 py-3 bg-white rounded-xl font-semibold"
                style={{ color: themeColor }}
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-white/60 mt-4">No spam, unsubscribe anytime.</p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={cn('bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8', className)}>
        <div className="max-w-7xl mx-auto">
          {links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {links.map((link, index) => {
                // Handle hash links and external links
                if (link.href.startsWith('#') || link.href.startsWith('http')) {
                  return (
                    <a
                      key={index}
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors no-underline"
                    >
                      {link.label}
                    </a>
                  )
                }
                return (
                  <Link
                    key={index}
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          )}
          <div className="text-center">
            <p className="text-sm">© {currentYear} {appName}. All rights reserved.</p>
            {showStripe && (
              <p className="text-xs text-gray-500 mt-2">Powered by Stripe for secure payments</p>
            )}
          </div>
        </div>
      </footer>
    </>
  )
}

// Unified Landing Page Component - Used across all apps

import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Hero } from './hero'
import { FeatureGrid } from './feature-grid'
import { Navigation, DEFAULT_NAV_ITEMS } from './navigation'
import { NewsletterSignup } from './newsletter-signup'
import { cn } from '../../lib/index'

interface Feature {
  icon?: React.ComponentType<{ className?: string }>
  iconNode?: React.ReactNode
  title: string
  description: string
  href?: string
}

interface PricingTier {
  name: string
  price: string
  period?: string
  features: string[]
  ctaText: string
  ctaHref: string
  popular?: boolean
  themeColor?: string
}

interface Industry {
  name: string
  icon: string
  href?: string
}

interface LandingPageProps {
  // Navigation
  logoText?: string
  logo?: React.ReactNode
  navItems?: Array<{ label: string; href: string }>
  ctaText?: string
  ctaHref?: string
  signInHref?: string

  // Hero
  heroTitle: string
  heroSubtitle: string
  heroCtaText?: string
  heroCtaHref?: string
  heroSecondaryCtaText?: string
  heroSecondaryCtaHref?: string
  heroTrustText?: string
  heroIcon?: React.ReactNode
  themeColor?: string

  // Features
  featuresTitle?: string
  features?: Feature[]
  featuresColumns?: 2 | 3 | 4

  // Industries
  industriesTitle?: string
  industries?: Industry[]
  industriesHref?: string

  // Pricing
  pricingTitle?: string
  pricingSubtitle?: string
  pricingTiers?: PricingTier[]

  // Footer
  showNewsletter?: boolean
  footerText?: string

  className?: string
}

export function LandingPage({
  // Navigation
  logoText = 'App',
  logo,
  navItems = DEFAULT_NAV_ITEMS,
  ctaText = 'Start Free Trial',
  ctaHref = '/register',
  signInHref = '/login',

  // Hero
  heroTitle,
  heroSubtitle,
  heroCtaText,
  heroCtaHref,
  heroSecondaryCtaText = 'Try Demo',
  heroSecondaryCtaHref = '/demo',
  heroTrustText = 'Trusted by 500+ organizations',
  heroIcon,
  themeColor = '#3b82f6',

  // Features
  featuresTitle = 'Key Features',
  features = [],
  featuresColumns = 3,

  // Industries
  industriesTitle = 'Industry-Specific Apps',
  industries = [],
  industriesHref = '/apps',

  // Pricing
  pricingTitle = 'Simple Pricing',
  pricingSubtitle = 'Choose the plan that fits your business',
  pricingTiers = [],

  // Footer
  showNewsletter = true,
  footerText,

  className,
}: LandingPageProps) {
  return (
    <div className={cn('min-h-screen bg-white', className)}>
      {/* Navigation */}
      <Navigation
        logo={logo}
        logoText={logoText}
        navItems={navItems}
        ctaText={ctaText}
        ctaHref={ctaHref}
        signInHref={signInHref}
        themeColor={themeColor}
      />

      {/* Hero */}
      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        ctaText={heroCtaText}
        ctaHref={heroCtaHref}
        secondaryCtaText={heroSecondaryCtaText}
        secondaryCtaHref={heroSecondaryCtaHref}
        trustText={heroTrustText}
        icon={heroIcon}
        themeColor={themeColor}
      />

      {/* Features */}
      {features.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{featuresTitle}</h2>
            </div>
            <FeatureGrid
              features={features}
              columns={featuresColumns}
              themeColor={themeColor}
            />
          </div>
        </section>
      )}

      {/* Industries */}
      {industries.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{industriesTitle}</h2>
              <Link
                to={industriesHref}
                className="inline-flex items-center mt-4 font-medium hover:opacity-80 transition-opacity"
                style={{ color: themeColor }}
              >
                View all industry apps <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {industries.map((industry, index) => (
                <Link
                  key={index}
                  to={industry.href || industriesHref}
                  className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition text-center no-underline"
                >
                  <div className="text-4xl mb-3">{industry.icon}</div>
                  <h3 className="font-semibold text-gray-900">{industry.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      {pricingTiers.length > 0 && (
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{pricingTitle}</h2>
              <p className="text-xl text-gray-600">{pricingSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className={cn(
                    'bg-white rounded-xl p-8 border',
                    tier.popular
                      ? 'border-2 shadow-lg'
                      : 'border-gray-200'
                  )}
                  style={tier.popular ? { borderColor: themeColor } : {}}
                >
                  {tier.popular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold text-white rounded-full"
                      style={{ backgroundColor: themeColor }}
                    >
                      Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    {tier.period && <span className="text-gray-500">/{tier.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={tier.ctaHref}
                    className={cn(
                      'block w-full py-3 text-center rounded-lg font-medium transition-colors no-underline',
                      tier.popular
                        ? 'text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                    style={tier.popular ? { backgroundColor: themeColor } : {}}
                  >
                    {tier.ctaText}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      {showNewsletter && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <NewsletterSignup />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            {footerText || `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
        </div>
      </footer>
    </div>
  )
}

// Default feature icons
export const DEFAULT_FEATURES: Feature[] = [
  {
    icon: undefined,
    title: 'Easy to Use',
    description: 'Intuitive interface that your team will love from day one.',
  },
  {
    icon: undefined,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with SOC 2 compliance.',
  },
  {
    icon: undefined,
    title: '24/7 Support',
    description: 'Round-the-clock customer support whenever you need it.',
  },
]

// Default pricing tiers
export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$29',
    period: 'month',
    features: ['Up to 100 users', 'Basic features', 'Email support'],
    ctaText: 'Get Started',
    ctaHref: '/register?plan=starter',
  },
  {
    name: 'Professional',
    price: '$79',
    period: 'month',
    features: ['Unlimited users', 'Advanced features', 'Priority support'],
    ctaText: 'Get Started',
    ctaHref: '/register?plan=professional',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Unlimited everything', 'Custom integrations', 'Dedicated support'],
    ctaText: 'Contact Sales',
    ctaHref: '/contact',
  },
]

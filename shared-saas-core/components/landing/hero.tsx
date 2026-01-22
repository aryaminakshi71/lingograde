// Hero Component - Unified across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import * as React from 'react'
import { Link } from '@tanstack/react-router'
import {ArrowRight, Play, CheckCircle2} from 'lucide-react'
import {Button} from '../ui/button'
import {cn} from '../../lib/index'
import type {Locale} from '../../i18n/config'

interface HeroProps {
  title: string
  subtitle: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  demoVideoUrl?: string
  showTrustBadges?: boolean
  trustText?: string
  icon?: React.ReactNode
  themeColor?: string
  locale?: Locale
  className?: string
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  demoVideoUrl,
  showTrustBadges = true,
  trustText = 'Trusted by 500+ organizations',
  icon,
  themeColor,
  locale,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background',
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {showTrustBadges && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-primary/10 text-primary border border-primary/20">
              {icon || <CheckCircle2 className="w-4 h-4" />}
              <span>{trustText}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {ctaText && ctaHref && (
              <Link to={ctaHref} className="no-underline">
                <Button
                  size="lg"
                  className="w-full sm:w-auto min-w-[180px]"
                >
                  {ctaText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}

            {secondaryCtaText && secondaryCtaHref && (
              <Link to={secondaryCtaHref} className="no-underline">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {demoVideoUrl ? (
                    <>
                      <Play className="mr-2 w-4 h-4" />
                      {secondaryCtaText}
                    </>
                  ) : (
                    secondaryCtaText
                  )}
                </Button>
              </Link>
            )}
          </div>

          {/* Trust text */}
          <p className="text-sm text-muted-foreground">
            14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>

        {/* Demo Video / Screenshot */}
        {demoVideoUrl && (
          <div className="mt-16 relative">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card aspect-video max-w-5xl mx-auto"
              style={{aspectRatio: '16/9'}}
            >
              <iframe
                src={demoVideoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

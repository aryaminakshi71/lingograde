// Feature Card Component - Unified across all apps

import * as React from 'react'
import type {LucideIcon} from 'lucide-react'
import {cn} from '../../lib/index'

interface FeatureCardProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
  iconNode?: React.ReactNode
  title: string
  description: string
  href?: string
  themeColor?: string
  className?: string
}

export function FeatureCard({
  icon: Icon,
  iconNode,
  title,
  description,
  href,
  themeColor = '#3b82f6',
  className,
}: FeatureCardProps) {
  const content = (
    <div
      className={cn(
        'group bg-white rounded-2xl p-6 border border-gray-100',
        'hover:shadow-lg hover:shadow-gray-200/50',
        'transition-all duration-300',
        'hover:-translate-y-1',
        className
      )}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{backgroundColor: `${themeColor}15`}}
      >
        {Icon ? (
          <Icon className="w-6 h-6" style={{color: themeColor}} />
        ) : (
          iconNode
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>

      {/* Arrow indicator for clickable cards */}
      {href && (
        <div
          className="mt-4 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{color: themeColor}}
        >
          Learn more
          <svg
            className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}

// ============================================================================
// Feature Grid Component
// ============================================================================

interface FeatureGridProps {
  features: Array<{
    icon?: LucideIcon | React.ComponentType<{ className?: string }>
    iconNode?: React.ReactNode
    title: string
    description: string
    href?: string
  }>
  columns?: 2 | 3 | 4
  themeColor?: string
  className?: string
}

export function FeatureGrid({
  features,
  columns = 3,
  themeColor = '#3b82f6',
  className,
}: FeatureGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          {...feature}
          themeColor={themeColor}
        />
      ))}
    </div>
  )
}

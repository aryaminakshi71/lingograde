'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, X } from 'lucide-react'
import { cn } from '../../utils'

interface Insight {
  id: string
  type: 'success' | 'warning' | 'info' | 'opportunity'
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  priority: 'high' | 'medium' | 'low'
  timestamp: Date
}

interface AIInsightsProps {
  appName?: string
  insights?: Insight[]
  onDismiss?: (id: string) => void
  className?: string
}

const typeConfig = {
  success: {
    icon: TrendingUp,
    color: 'bg-green-50 border-green-200 text-green-800',
    iconColor: 'text-green-600',
  },
  warning: {
    icon: AlertTriangle,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconColor: 'text-yellow-600',
  },
  info: {
    icon: Lightbulb,
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    iconColor: 'text-blue-600',
  },
  opportunity: {
    icon: Sparkles,
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    iconColor: 'text-purple-600',
  },
}

export function AIInsights({
  appName = 'App',
  insights = [],
  onDismiss,
  className,
}: AIInsightsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]))
    if (onDismiss) onDismiss(id)
  }

  const visibleInsights = insights.filter((insight) => !dismissed.has(insight.id))

  if (visibleInsights.length === 0) return null

  // Sort by priority
  const sortedInsights = [...visibleInsights].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  return (
    <div className={cn('space-y-3', className)}>
      {sortedInsights.slice(0, 5).map((insight) => {
        const config = typeConfig[insight.type]
        const Icon = config.icon

        return (
          <div
            key={insight.id}
            className={cn(
              'relative p-4 rounded-lg border',
              config.color,
              'animate-in slide-in-from-right duration-300'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn('flex-shrink-0', config.iconColor)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                <p className="text-sm opacity-90">{insight.description}</p>
                {insight.action && (
                  <button
                    onClick={insight.action.onClick}
                    className="mt-2 text-sm font-medium underline hover:no-underline"
                  >
                    {insight.action.label}
                  </button>
                )}
              </div>
              {onDismiss && (
                <button
                  onClick={() => handleDismiss(insight.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}


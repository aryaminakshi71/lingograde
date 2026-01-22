'use client'

import { ReactNode } from 'react'
import { cn } from '../../utils'
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label?: string
    positive?: boolean
  }
  icon?: LucideIcon
  iconColor?: string
  className?: string
  loading?: boolean
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'bg-blue-100 text-blue-600',
  className,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className={cn('bg-white rounded-xl p-5 border border-gray-100 shadow-sm', className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow', className)}>
      <div className="flex items-center justify-between mb-3">
        {Icon && (
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {change && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              change.positive !== false ? 'text-green-600' : 'text-red-600'
            )}
          >
            {change.positive !== false ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change.value > 0 ? '+' : ''}
            {change.value}%{change.label && ` ${change.label}`}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  )
}


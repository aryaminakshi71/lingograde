'use client'

import { ReactNode } from 'react'
import { cn } from '../../utils'

interface ChartContainerProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  loading?: boolean
  error?: string | null
  height?: number
}

export function ChartContainer({
  title,
  description,
  children,
  className,
  loading = false,
  error = null,
  height = 300,
}: ChartContainerProps) {
  if (error) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
        <div className="flex items-center justify-center h-[300px] text-red-600">
          <p>Error loading chart: {error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-[300px] bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
      )}
      <div style={{ height: `${height}px` }} className="w-full">
        {children}
      </div>
    </div>
  )
}


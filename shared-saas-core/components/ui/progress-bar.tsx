'use client'

import * as React from 'react'
import { cn } from '../../lib/index'

export interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

const ProgressBar = ({
  value,
  max = 100,
  className,
  showLabel = false,
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-1">{Math.round(percentage)}%</p>
      )}
    </div>
  )
}

export { ProgressBar }

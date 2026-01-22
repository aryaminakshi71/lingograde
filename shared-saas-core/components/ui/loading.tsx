'use client'

import * as React from 'react'
import { cn } from '../../lib/index'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Loading = ({ size = 'md', className }: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size]
        )}
      />
    </div>
  )
}

export { Loading }

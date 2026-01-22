// Alert Component - Based on existing shared-ui patterns

import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {cn} from '../../lib/index'
import {X} from 'lucide-react'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-900 border-gray-200',
        destructive: 'border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600',
        success: 'border-green-500/50 text-green-600 bg-green-50',
        warning: 'border-yellow-500/50 text-yellow-600 bg-yellow-50',
        info: 'border-blue-500/50 text-blue-600 bg-blue-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
    onClose?: () => void
  }
>(({className, variant, children, onClose, ...props}, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({variant}), className)}
    {...props}
  >
    {children}
    {onClose && (
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    )}
  </div>
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({className, ...props}, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export {Alert, AlertTitle, AlertDescription}

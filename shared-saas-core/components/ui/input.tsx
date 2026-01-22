// Input Component - Based on existing shared-ui patterns

import * as React from 'react'
import {cn} from '../../lib/index'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
   ({className, type, label, error, helperText, leftIcon, rightIcon, id, ...props}, ref) => {
     const inputId = id || props.name
     const errorId = error ? `${inputId}-error` : undefined
     const helperId = helperText ? `${inputId}-helper` : undefined
 
     return (
       <div className="w-full">
         {label && (
           <label
             htmlFor={inputId}
             className="block text-sm font-medium text-gray-700 mb-1"
             id={`${inputId}-label`}
           >
             {label}
             {props.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
           </label>
         )}
         <div className="relative">
           {leftIcon && (
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400" aria-hidden="true">
               {leftIcon}
             </div>
           )}
           <input
             type={type}
             id={inputId}
             className={cn(
               'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-400',
               'focus:outline-none focus:ring-2 focus:ring-offset-0',
               error
                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                 : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
               leftIcon && 'pl-10',
               rightIcon && 'pr-10',
               props.disabled && 'bg-gray-50 cursor-not-allowed',
               className
             )}
             ref={ref}
             aria-invalid={error ? 'true' : undefined}
             aria-describedby={errorId || helperId || undefined}
             aria-labelledby={`${inputId}-label`}
             aria-required={props.required ? 'true' : undefined}
             {...props}
           />
           {rightIcon && (
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400" aria-hidden="true">
               {rightIcon}
             </div>
           )}
         </div>
         {error && (
           <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">{error}</p>
         )}
         {helperText && !error && (
           <p id={helperId} className="mt-1 text-sm text-gray-500">{helperText}</p>
         )}
       </div>
     )
   }
)
Input.displayName = 'Input'

export {Input}

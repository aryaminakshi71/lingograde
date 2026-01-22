'use client'

import * as React from 'react'
import { cn } from '../../lib/index'

export interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
  className?: string
}

const Dropdown = ({ trigger, children, align = 'right', className }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('relative', className)} ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  )
}

export interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  role?: string
}

const DropdownItem = ({ children, onClick, className, role = 'menuitem' }: DropdownItemProps) => {
  return (
    <button
      onClick={onClick}
      role={role}
      className={cn(
        'w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100',
        className
      )}
    >
      {children}
    </button>
  )
}

export { Dropdown, DropdownItem }

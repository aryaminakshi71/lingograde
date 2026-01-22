'use client'

import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Home, BarChart3, Users, FileText, Settings, LogOut, Bell } from 'lucide-react'
import { cn } from '../../lib'

interface SidebarItem {
  name: string
  href: string
  icon?: string | React.ReactNode
  active?: boolean
  children?: SidebarItem[] // Support for sub-links
}

interface SidebarProps {
  items: SidebarItem[]
  appName: string
  themeColor?: string
  logoIcon?: React.ReactNode
  className?: string
}

export function Sidebar({ items, appName, themeColor, logoIcon, className }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        setUser(JSON.parse(userStr))
      }
    } catch (e) {
      console.error('Error reading user from localStorage:', e)
    }
  }, [])

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(href)) {
        next.delete(href)
      } else {
        next.add(href)
      }
      return next
    })
  }

  const getIcon = (icon?: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      const IconMap: Record<string, React.ReactNode> = {
        'H': <Home className="w-5 h-5" />,
        'T': <FileText className="w-5 h-5" />,
        '$': <BarChart3 className="w-5 h-5" />,
        'W': <Users className="w-5 h-5" />,
        'S': <Settings className="w-5 h-5" />,
      }
      return IconMap[icon] || <FileText className="w-5 h-5" />
    }
    return icon || <FileText className="w-5 h-5" />
  }

  const renderNavItem = (item: SidebarItem, depth: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.href)

    return (
      <div key={item.href}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.href)}
            className={cn(
              'w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-xl font-medium transition-colors',
              'text-foreground/70 hover:text-foreground hover:bg-accent',
              item.active && 'bg-primary text-primary-foreground'
            )}
            style={{ paddingLeft: `${1 + depth}rem` }}
          >
            <div className="flex items-center space-x-3">
              {getIcon(item.icon)}
              <span>{item.name}</span>
            </div>
            <span className={cn('transition-transform', isExpanded && 'rotate-90')}>›</span>
          </button>
        ) : (
          <Link
            to={item.href}
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors no-underline',
              item.active
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/70 hover:text-foreground hover:bg-accent'
            )}
            style={{ paddingLeft: `${1 + depth}rem` }}
          >
            {getIcon(item.icon)}
            <span>{item.name}</span>
          </Link>
        )}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <aside 
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border',
          'transform transition-transform duration-200 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-2 p-4 border-b border-border">
            {logoIcon || (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg">
                {appName.charAt(0)}
              </div>
            )}
            <span className="text-lg font-bold text-foreground">{appName}</span>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items.map((item) => renderNavItem(item, 0))}
          </nav>

          {user && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground font-medium">
                  {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium truncate">
                    {user.firstName || user.email?.split('@')[0]}
                  </p>
                  <p className="text-muted-foreground text-sm truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}

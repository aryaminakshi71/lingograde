'use client'

// Standardized Dashboard Page Component - Used across all apps
// Uses Tailwind design tokens for consistent dark/light mode support

import * as React from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  BarChart3,
  Users,
  FileText,
  Bell
} from 'lucide-react'
import { cn } from '../../lib'

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  children?: NavItem[] // Support for nested navigation
}

interface DashboardPageProps {
  appName?: string
  themeColor?: string
  themeColorSecondary?: string
  logoIcon?: React.ReactNode
  children?: React.ReactNode
  navItems?: NavItem[]
  activeNavItem?: string
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Users', href: '/dashboard/users', icon: <Users className="w-5 h-5" /> },
  { label: 'Reports', href: '/dashboard/reports', icon: <FileText className="w-5 h-5" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
]

export function DashboardPage({
  appName = 'App',
  themeColor,
  themeColorSecondary,
  logoIcon,
  children,
  navItems = DEFAULT_NAV_ITEMS,
  activeNavItem = '/dashboard',
}: DashboardPageProps) {
  const navigate = useNavigate()
  const [user, setUser] = React.useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) return
    
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        setUser(JSON.parse(userStr))
      } else {
        const hasRedirected = sessionStorage.getItem('dashboard-redirect-attempt')
        if (!hasRedirected) {
          sessionStorage.setItem('dashboard-redirect-attempt', 'true')
          navigate({ to: '/login' })
        }
      }
    } catch (e) {
      console.error('Error reading user from localStorage:', e)
      const hasRedirected = sessionStorage.getItem('dashboard-redirect-attempt')
      if (!hasRedirected) {
        sessionStorage.setItem('dashboard-redirect-attempt', 'true')
        navigate({ to: '/login' })
      }
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

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('isDemo')
    }
    navigate({ to: '/' })
  }

  const renderNavItem = (item: NavItem, depth: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = activeNavItem === item.href
    const isExpanded = expandedItems.has(item.href)

    return (
      <div key={item.href}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.href)}
            className={cn(
              'w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-xl font-medium transition-colors',
              'text-foreground/70 hover:text-foreground hover:bg-accent',
              isActive && 'bg-primary text-primary-foreground'
            )}
            style={{ paddingLeft: `${1 + depth}rem` }}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <span className={cn('transition-transform', isExpanded && 'rotate-90')}>›</span>
          </button>
        ) : (
          <Link
            to={item.href}
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors no-underline',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/70 hover:text-foreground hover:bg-accent'
            )}
            style={{ paddingLeft: `${1 + depth}rem` }}
          >
            {item.icon}
            <span>{item.label}</span>
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted rounded-full border-t-primary animate-spin" />
      </div>
    )
  }

  const isDemo = typeof window !== 'undefined' && localStorage.getItem('isDemo') === 'true'

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border',
          'transform transition-transform duration-200 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              {logoIcon || (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground">
                  <span className="font-bold text-lg">{appName.charAt(0)}</span>
                </div>
              )}
              <span className="text-lg font-bold text-foreground">{appName}</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isDemo && (
            <div className="mx-4 mt-4 p-3 rounded-lg text-sm bg-primary/10 text-primary border border-primary/20">
              Demo Mode Active
            </div>
          )}

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => renderNavItem(item, 0))}
          </nav>

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
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-muted-foreground hover:text-foreground relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children || (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: '1,234', change: '+12%' },
                { label: 'Revenue', value: '$45,678', change: '+8%' },
                { label: 'Active Sessions', value: '567', change: '+24%' },
                { label: 'Conversion Rate', value: '3.2%', change: '+2%' },
              ].map((stat, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-sm mt-2 text-primary">{stat.change} from last month</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export { DEFAULT_NAV_ITEMS as DASHBOARD_DEFAULT_NAV_ITEMS }

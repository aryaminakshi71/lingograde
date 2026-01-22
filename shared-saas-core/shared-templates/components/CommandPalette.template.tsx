'use client'

import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { 
  Search, Home, BarChart3, Users, Settings, FileText, 
  LogOut, LogIn, UserPlus, HelpCircle, CreditCard
} from 'lucide-react'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const runCommand = (command: () => void) => {
    command()
    onOpenChange(false)
    setSearch('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50" onClick={() => onOpenChange(false)}>
      <Command className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center border-b border-gray-200 px-4">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <Command.Input
            placeholder="Type a command or search..."
            value={search}
            onValueChange={setSearch}
            className="flex-1 py-3 text-sm outline-none"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500">
            ESC
          </kbd>
        </div>
        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty>No results found.</Command.Empty>
          
          <Command.Group heading="Navigation">
            <Command.Item onSelect={() => runCommand(() => router.push('/'))}>
              <Home className="w-4 h-4 mr-2" />
              <span>Home</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/dashboard'))}>
              <BarChart3 className="w-4 h-4 mr-2" />
              <span>Dashboard</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/dashboard/users'))}>
              <Users className="w-4 h-4 mr-2" />
              <span>Users</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/dashboard/reports'))}>
              <FileText className="w-4 h-4 mr-2" />
              <span>Reports</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/dashboard/settings'))}>
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/dashboard/analytics'))}>
              <BarChart3 className="w-4 h-4 mr-2" />
              <span>Analytics</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Account">
            <Command.Item onSelect={() => runCommand(() => router.push('/auth/login'))}>
              <LogIn className="w-4 h-4 mr-2" />
              <span>Sign In</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/auth/register'))}>
              <UserPlus className="w-4 h-4 mr-2" />
              <span>Sign Up</span>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push('/demo'))}>
              <HelpCircle className="w-4 h-4 mr-2" />
              <span>Try Demo</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Billing">
            <Command.Item onSelect={() => runCommand(() => router.push('/pricing'))}>
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Pricing</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}


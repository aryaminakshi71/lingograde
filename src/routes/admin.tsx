import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@shared/saas-core'
import { 
  Users, BookOpen, DollarSign, TrendingUp, 
  Plus, Edit, Trash2, Eye, Settings,
  BarChart3, PieChart, Activity, Globe
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'

export const Route = createFileRoute('/admin')({
  component: AdminDashboard,
})

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalLessons: number
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { data: stats, isLoading } = useQuery(orpc.admin.getPlatformStats.queryOptions())

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 min-h-screen text-white p-6 fixed">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl">LingoGrade</span>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'content', label: 'Content', icon: BookOpen },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'revenue', label: 'Revenue', icon: DollarSign },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
          </div>

          {activeTab === 'overview' && stats && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="success">+12%</Badge>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{formatNumber(stats.totalUsers)}</div>
                  <div className="text-slate-600">Total Users</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <Badge variant="success">+8%</Badge>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{formatNumber(stats.activeUsers)}</div>
                  <div className="text-slate-600">Active Users</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge variant="primary">+24</Badge>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{stats.totalLessons}</div>
                  <div className="text-slate-600">Total Lessons</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-amber-600" />
                    </div>
                    <Badge variant="success">+15%</Badge>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{stats.totalCourses}</div>
                  <div className="text-slate-600">Total Courses</div>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

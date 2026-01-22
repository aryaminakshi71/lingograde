import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardPage } from '@shared/saas-core'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    // Check if user is authenticated
    try {
      const session = await orpc.auth.getSession.query()
      if (!session) {
        throw redirect({ to: '/login' })
      }
    } catch (error) {
      // If it's a redirect, rethrow it
      if (error && typeof error === 'object' && 'to' in error) {
        throw error
      }
      // Otherwise redirect to login
      throw redirect({ to: '/login' })
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const { data: stats } = useQuery(orpc.dashboard.getStats.queryOptions())

  return (
    <DashboardPage
      appName="LingoGrade"
      themeColor="#10b981"
      themeColorSecondary="#14b8a6"
    >
      {stats && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Completed Lessons</div>
              <div className="text-2xl font-bold">{stats.completedLessons}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Total XP</div>
              <div className="text-2xl font-bold">{stats.totalXP}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="text-2xl font-bold">{stats.currentStreak} days</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-600">Active Courses</div>
              <div className="text-2xl font-bold">{stats.activeCourses}</div>
            </div>
          </div>
        </div>
      )}
    </DashboardPage>
  )
}

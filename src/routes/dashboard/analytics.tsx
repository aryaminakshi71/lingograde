import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../../lib/orpc-query'

export const Route = createFileRoute('/dashboard/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery(orpc.dashboard.getStats.queryOptions())

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">View detailed analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Completed Lessons</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.completedLessons || 0}</div>
          <div className="text-sm text-green-600">+12.5%</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total XP</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.totalXP || 0}</div>
          <div className="text-sm text-green-600">+8.2%</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Current Streak</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.currentStreak || 0} days</div>
          <div className="text-sm text-green-600">Keep it up!</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Active Courses</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats?.activeCourses || 0}</div>
          <div className="text-sm text-green-600">+3.2%</div>
        </div>
      </div>
    </div>
  )
}

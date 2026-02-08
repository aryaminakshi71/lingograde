import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Users, Trophy, TrendingUp, BarChart3, CheckCircle, Clock } from 'lucide-react'

export const Route = createFileRoute('/team')({
  beforeLoad: async () => {
    try {
      const session = await orpc.auth.getSession.query()
      if (!session) {
        throw redirect({ to: '/login' })
      }
    } catch {
      throw redirect({ to: '/login' })
    }
  },
  component: TeamPage,
})

function TeamPage() {
  const { data: dashboard } = useQuery({
    queryKey: ['teamDashboard'],
    queryFn: () => orpc.corporate.getTeamDashboard.query({ teamId: 1 }),
  })

  const { data: analytics } = useQuery({
    queryKey: ['teamAnalytics'],
    queryFn: () => orpc.corporate.getTeamAnalytics.query({ teamId: 1, period: 'month' }),
  })

  const { data: compliance } = useQuery({
    queryKey: ['compliance'],
    queryFn: () => orpc.corporate.getComplianceReport.query({
      teamId: 1,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    }),
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-500" />
            Team Dashboard
          </h1>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium">
            Export Report
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-500" />
              <span className="text-gray-500">Active Members</span>
            </div>
            <div className="text-3xl font-bold">{dashboard?.activeMembers || 0}</div>
            <div className="text-sm text-gray-500">of {dashboard?.memberCount || 0} total</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span className="text-gray-500">Total XP</span>
            </div>
            <div className="text-3xl font-bold">{(dashboard?.totalXP || 0).toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <span className="text-gray-500">Avg Progress</span>
            </div>
            <div className="text-3xl font-bold">{dashboard?.averageProgress || 0}%</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-purple-500" />
              <span className="text-gray-500">Completion Rate</span>
            </div>
            <div className="text-3xl font-bold">{dashboard?.completionRate || 0}%</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-bold mb-4">Top Performers</h3>
            <div className="space-y-4">
              {dashboard?.topPerformers?.map((performer: any, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    i === 0 ? 'bg-amber-400 text-white' :
                    i === 1 ? 'bg-gray-400 text-white' :
                    'bg-amber-600 text-white'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{performer.name}</div>
                    <div className="text-sm text-gray-500">{performer.xp.toLocaleString()} XP</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">{performer.progress}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-bold mb-4">Weekly Goal</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>{dashboard?.weeklyGoal?.current || 0} / {dashboard?.weeklyGoal?.target || 0} XP</span>
                <span className="text-gray-500">{dashboard?.weeklyGoal?.daysLeft || 0} days left</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-emerald-500 rounded-full h-4"
                  style={{ width: `${(dashboard?.weeklyGoal?.current || 0) / (dashboard?.weeklyGoal?.target || 1) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              {analytics?.languageBreakdown?.map((lang: any) => (
                <div key={lang.language} className="flex items-center justify-between">
                  <span>{lang.language}</span>
                  <span className="font-medium">{lang.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Compliance Report</h3>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              Download Full Report
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold">{compliance?.requiredHours || 0}h</div>
              <div className="text-sm text-gray-500">Required</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">{compliance?.completedHours || 0}h</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-600">{compliance?.complianceRate || 0}%</div>
              <div className="text-sm text-gray-500">Compliance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

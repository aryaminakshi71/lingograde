import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Trophy, Medal, Crown, TrendingUp, Users, Zap, Star, Target, Calendar } from 'lucide-react'

export const Route = createFileRoute('/leaderboard')({
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
  component: LeaderboardPage,
})

function LeaderboardPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly')
  const [selectedLanguage, setSelectedLanguage] = useState<number | null>(null)
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => orpc.social.getLeaderboard.query({ type: period, limit: 50 }),
  })

  const { data: languages } = useQuery(orpc.lessons.getLanguages.queryOptions())

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <div className="flex gap-2">
            {(['weekly', 'monthly', 'allTime'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === p ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {p === 'allTime' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            </div>
          ) : (
            <>
              {leaderboard?.entries.slice(0, 10).map((entry: any, index: number) => (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 p-4 border-b ${
                    entry.isCurrentUser ? 'bg-emerald-50' : index < 3 ? 'bg-gradient-to-r from-amber-50 to-white' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-amber-400 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index < 3 ? <Crown className="w-6 h-6" /> : index + 1}
                  </div>

                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
                    {entry.avatarUrl ? (
                      <img src={entry.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-emerald-600 font-bold">
                        {entry.userName?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold">
                      {entry.userName || 'Anonymous'}
                      {entry.isCurrentUser && <span className="ml-2 text-emerald-600 text-sm">(You)</span>}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-amber-500" />
                        {entry.completedLessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-red-500" />
                        {entry.streak} day streak
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">{entry.totalXP.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">XP</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {leaderboard?.currentUserRank && leaderboard.currentUserRank > 10 && (
          <div className="mt-6 bg-emerald-500 rounded-xl p-4 text-white text-center">
            <p className="font-medium">
              Your Rank: <span className="text-2xl font-bold">#{leaderboard.currentUserRank}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

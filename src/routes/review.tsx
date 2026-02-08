import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Brain, Clock, Check, RefreshCw, Zap, Target, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/review')({
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
  component: ReviewPage,
})

function ReviewPage() {
  const { data: reviewQueue } = useQuery({
    queryKey: ['reviewQueue'],
    queryFn: () => orpc.spacedRepetition.getReviewQueue.query({ limit: 20 }),
  })

  const { data: memoryStats } = useQuery({
    queryKey: ['memoryStats'],
    queryFn: () => orpc.spacedRepetition.getMemoryStats.query({}),
  })

  const { data: optimalSchedule } = useQuery({
    queryKey: ['optimalSchedule'],
    queryFn: () => orpc.spacedRepetition.getOptimalSchedule.query({}),
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Brain className="w-8 h-8 text-emerald-500" />
          Spaced Repetition Review
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-emerald-500" />
              <h3 className="font-semibold">Due for Review</h3>
            </div>
            <div className="text-4xl font-bold text-emerald-600">
              {reviewQueue?.totalDue || 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">cards ready</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">Retention Rate</h3>
            </div>
            <div className="text-4xl font-bold text-blue-600">
              {memoryStats?.retentionRate || 85}%
            </div>
            <div className="text-sm text-gray-500 mt-1">average recall</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-amber-500" />
              <h3 className="font-semibold">Accuracy</h3>
            </div>
            <div className="text-4xl font-bold text-amber-600">
              {memoryStats?.accuracy || 0}%
            </div>
            <div className="text-sm text-gray-500 mt-1">correct answers</div>
          </div>
        </div>

        {memoryStats?.forgettingCurve && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="font-semibold mb-4">Your Memory Curve</h3>
            <div className="h-48 flex items-end gap-2">
              {memoryStats.forgettingCurve.slice(0, 7).map((point: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-emerald-500 rounded-t"
                    style={{ height: `${point.retentionRate}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-1">{point.hoursAfterLearning}h</div>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-4 text-center">
              Retention rate over time after learning
            </div>
          </div>
        )}

        {optimalSchedule && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white mb-8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Optimal Study Schedule
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm opacity-80">Best study times</div>
                <div className="flex gap-2 mt-1">
                  {optimalSchedule.recommendedStudyTimes?.map((time: string, i: number) => (
                    <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-80">Daily review goal</div>
                <div className="text-2xl font-bold mt-1">
                  {optimalSchedule.dailyReviewCount} cards
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-bold mb-4">Start Review Session</h3>
          <p className="text-gray-600 mb-6">
            Review your due cards now to strengthen your memory. 
            Regular review is key to long-term retention!
          </p>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Start Review ({reviewQueue?.totalDue || 0} cards)
          </button>
        </div>
      </div>
    </div>
  )
}

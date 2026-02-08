import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Trophy, TrendingUp, Target, Flame, Calendar, Zap, Star, Brain, Clock, Award } from 'lucide-react'

export const Route = createFileRoute('/progress')({
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
  component: ProgressPage,
})

function ProgressPage() {
  const { data: profile } = useQuery(orpc.analytics.getLearningProfile.queryOptions())
  const { data: skills } = useQuery(orpc.analytics.getSkillBreakdown.queryOptions())
  const { data: timeline } = useQuery(orpc.analytics.getProgressTimeline.queryOptions({ weeks: 12 }))

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

        {profile && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8" />
                <div>
                  <div className="text-sm opacity-80">Fluency Prediction</div>
                  <div className="text-3xl font-bold">{profile.fluencyPrediction?.currentLevel || 'A1'}</div>
                </div>
              </div>
              <div className="text-sm opacity-80">Estimated fluency: {profile.fluencyPrediction?.daysToFluency || 180} days</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-emerald-500" />
                <div>
                  <div className="text-sm text-gray-500">Learning Style</div>
                  <div className="text-xl font-bold capitalize">{profile.learningProfile?.style || 'mixed'}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Best at: {profile.learningProfile?.style === 'auditory' ? 'Listening & Speaking' : 
                          profile.learningProfile?.style === 'visual' ? 'Reading & Vocabulary' : 'All modes'}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="text-sm text-gray-500">Current Streak</div>
                  <div className="text-3xl font-bold">{profile.stats?.currentStreak || 0} days</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Longest: {profile.stats?.longestStreak || 0} days</div>
            </div>
          </div>
        )}

        {profile && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">{profile.stats?.totalXP?.toLocaleString() || 0}</div>
              <div className="text-sm text-gray-500">Total XP</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{profile.stats?.completedLessons || 0}</div>
              <div className="text-sm text-gray-500">Lessons</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{profile.engagementScore || 0}%</div>
              <div className="text-sm text-gray-500">Engagement</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-3xl font-bold text-amber-500">{profile.learningProfile?.optimalStudyTimes?.length || 3}</div>
              <div className="text-sm text-gray-500">Study Times</div>
            </div>
          </div>
        )}

        {skills && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Skill Breakdown</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((category: any) => (
                <div key={category.category} className="border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{category.category}</h3>
                    <span className="text-emerald-600 font-bold">{category.overallLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-emerald-500 rounded-full h-2"
                      style={{ width: `${category.overallLevel}%` }}
                    />
                  </div>
                  <div className="space-y-2">
                    {category.subskills.map((skill: any) => (
                      <div key={skill.name} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile && profile.fluencyPrediction && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Your Language Journey</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="text-sm opacity-80 mb-1">Current Level</div>
                <div className="text-4xl font-bold">{profile.fluencyPrediction.currentLevel}</div>
              </div>
              <div className="flex-2">
                <div className="text-sm opacity-80 mb-1">Progress to {profile.fluencyPrediction.nextLevel}</div>
                <div className="w-full bg-white/30 rounded-full h-4">
                  <div
                    className="bg-white rounded-full h-4"
                    style={{ width: `${profile.fluidityPrediction.progressPercent}%` }}
                  />
                </div>
                <div className="text-right mt-1">{profile.fluencyPrediction.progressPercent}%</div>
              </div>
              <div className="flex-1 text-right">
                <div className="text-sm opacity-80 mb-1">Next Level</div>
                <div className="text-4xl font-bold">{profile.fluencyPrediction.nextLevel}</div>
              </div>
            </div>
            <div className="text-sm opacity-80">
              Estimated date to reach {profile.fluencyPrediction.nextLevel || 'fluency'}: {
                new Date(profile.fluencyPrediction.estimatedFluencyDate).toLocaleDateString()
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

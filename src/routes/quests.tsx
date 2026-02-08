import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { Target, Zap, Flame, BookOpen, Trophy, Check, Clock, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/quests')({
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
  component: QuestsPage,
})

const dailyQuests = [
  {
    id: 'daily_1',
    title: 'Quick Learner',
    description: 'Complete 3 lessons today',
    progress: { current: 2, target: 3 },
    xpReward: 50,
    icon: BookOpen,
  },
  {
    id: 'daily_2',
    title: 'Streak Defender',
    description: 'Maintain your streak today',
    progress: { current: 1, target: 1 },
    xpReward: 25,
    icon: Flame,
  },
  {
    id: 'daily_3',
    title: 'XP Collector',
    description: 'Earn 100 XP',
    progress: { current: 75, target: 100 },
    xpReward: 30,
    icon: Zap,
  },
  {
    id: 'daily_4',
    title: 'Perfect Practice',
    description: 'Get 100% on any quiz',
    progress: { current: 0, target: 1 },
    xpReward: 40,
    icon: Target,
  },
]

const weeklyQuests = [
  {
    id: 'weekly_1',
    title: 'Dedicated Learner',
    description: 'Complete 20 lessons this week',
    progress: { current: 12, target: 20 },
    xpReward: 200,
    icon: Trophy,
  },
  {
    id: 'weekly_2',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    progress: { current: 5, target: 7 },
    xpReward: 150,
    icon: Flame,
  },
]

function QuestsPage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const completedDailyXP = dailyQuests
    .filter(q => q.progress.current >= q.progress.target)
    .reduce((sum, q) => sum + q.xpReward, 0)

  const totalDailyXP = dailyQuests.reduce((sum, q) => sum + q.xpReward, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Daily Quests</h1>
          <p className="text-gray-600">Complete quests to earn bonus XP!</p>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm opacity-80">Today's Progress</div>
              <div className="text-3xl font-bold">{completedDailyXP}/{totalDailyXP} XP</div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all"
              style={{ width: `${(completedDailyXP / totalDailyXP) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {days.map((day, index) => (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-medium transition-colors ${
                index === selectedDay
                  ? 'bg-emerald-500 text-white'
                  : index < new Date().getDay()
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-emerald-500" />
          Daily Quests
          <span className="text-sm font-normal text-gray-500 ml-auto">Refreshes in 8h 23m</span>
        </h2>

        <div className="space-y-4 mb-8">
          {dailyQuests.map((quest) => {
            const isComplete = quest.progress.current >= quest.progress.target
            const ProgressIcon = quest.icon
            return (
              <div
                key={quest.id}
                className={`bg-white rounded-xl p-5 shadow-lg transition-all ${
                  isComplete ? 'ring-2 ring-emerald-400' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isComplete ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    <ProgressIcon className={`w-6 h-6 ${isComplete ? 'text-emerald-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{quest.title}</h3>
                      {isComplete && <Check className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{quest.description}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className={`rounded-full h-2 transition-all ${
                            isComplete ? 'bg-emerald-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min((quest.progress.current / quest.progress.target) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {quest.progress.current}/{quest.progress.target}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-500">+{quest.xpReward}</div>
                    <div className="text-xs text-gray-500">XP</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Weekly Quests
        </h2>

        <div className="space-y-4">
          {weeklyQuests.map((quest) => {
            const isComplete = quest.progress.current >= quest.progress.target
            const ProgressIcon = quest.icon
            return (
              <div
                key={quest.id}
                className={`bg-white rounded-xl p-5 shadow-lg ${
                  isComplete ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isComplete ? 'bg-amber-100' : 'bg-gray-100'
                  }`}>
                    <ProgressIcon className={`w-6 h-6 ${isComplete ? 'text-amber-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{quest.title}</h3>
                      {isComplete && <Check className="w-5 h-5 text-amber-500" />}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{quest.description}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className={`rounded-full h-2 transition-all ${
                            isComplete ? 'bg-amber-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min((quest.progress.current / quest.progress.target) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {quest.progress.current}/{quest.progress.target}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-500">+{quest.xpReward}</div>
                    <div className="text-xs text-gray-500">XP</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

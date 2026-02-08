import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/orpc-query'
import { Trophy, Star, Flame, BookOpen, Target, Award, Lock, Check } from 'lucide-react'

export const Route = createFileRoute('/achievements')({
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
  component: AchievementsPage,
})

const achievements = [
  {
    id: 'first_lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    category: 'learning',
    xpReward: 50,
    requirement: { lessons: 1 },
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak',
    xpReward: 100,
    requirement: { streak: 7 },
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '💪',
    category: 'streak',
    xpReward: 500,
    requirement: { streak: 30 },
  },
  {
    id: 'lessons_100',
    name: 'Century Club',
    description: 'Complete 100 lessons',
    icon: '📚',
    category: 'learning',
    xpReward: 300,
    requirement: { lessons: 100 },
  },
  {
    id: 'xp_10000',
    name: 'XP Hunter',
    description: 'Earn 10,000 XP',
    icon: '⚡',
    category: 'xp',
    xpReward: 200,
    requirement: { xp: 10000 },
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '💯',
    category: 'achievement',
    xpReward: 150,
    requirement: { perfectQuiz: true },
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a lesson before 6 AM',
    icon: '🌅',
    category: 'special',
    xpReward: 75,
    requirement: { earlyBird: true },
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a lesson after 11 PM',
    icon: '🦉',
    category: 'special',
    xpReward: 75,
    requirement: { nightOwl: true },
  },
  {
    id: 'first_cert',
    name: 'Certified',
    description: 'Earn your first certificate',
    icon: '🏆',
    category: 'achievement',
    xpReward: 200,
    requirement: { certificates: 1 },
  },
  {
    id: 'polygot',
    name: 'Polyglot',
    description: 'Start learning 3 different languages',
    icon: '🌍',
    category: 'learning',
    xpReward: 500,
    requirement: { languages: 3 },
  },
]

function AchievementsPage() {
  const [filter, setFilter] = useState<'all' | 'learning' | 'streak' | 'special'>('all')

  const { data: userStats } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => orpc.social.getUserProfile.query({}),
  })

  const unlockedIds = new Set(['first_lesson', 'streak_7', 'lessons_100'])

  const filteredAchievements = filter === 'all'
    ? achievements
    : achievements.filter(a => a.category === filter)

  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'streak', label: 'Streaks', icon: Flame },
    { id: 'special', label: 'Special', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-gray-600">Unlock badges by completing challenges</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-emerald-600">{userStats?.totalXP || 0}</div>
            <div className="text-sm text-gray-500">Total XP</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-500">{userStats?.achievements || 0}</div>
            <div className="text-sm text-gray-500">Achievements</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-500">{userStats?.completedLessons || 0}</div>
            <div className="text-sm text-gray-500">Lessons</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-500">{userStats?.currentStreak || 0}</div>
            <div className="text-sm text-gray-500">Day Streak</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === cat.id ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id)
            return (
              <div
                key={achievement.id}
                className={`relative rounded-xl p-6 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200'
                    : 'bg-gray-100 border-2 border-gray-200 opacity-60'
                }`}
              >
                {isUnlocked && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
                {!isUnlocked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                )}

                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h3 className="font-bold mb-1">{achievement.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <div className="flex items-center gap-2 text-amber-600 font-medium">
                  <Zap className="w-4 h-4" />
                  {achievement.xpReward} XP
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

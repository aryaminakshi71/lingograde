'use client'

import { useState } from 'react'
import { Trophy, Star, Flame, Award, Target, Zap, Medal, Crown } from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: 'trophy' | 'star' | 'flame' | 'award' | 'target' | 'zap' | 'medal'
  unlocked: boolean
  progress?: number
  target?: number
  unlockedAt?: string
}

interface GamificationPanelProps {
  points?: number
  level?: number
  streak?: number
  achievements?: Achievement[]
}

export function GamificationPanel({
  points = 1250,
  level = 5,
  streak = 7,
  achievements = [],
}: GamificationPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'leaderboard'>('overview')

  const getLevelProgress = () => {
    const pointsForNextLevel = level * 250
    const pointsForCurrentLevel = (level - 1) * 250
    const progress = ((points - pointsForCurrentLevel) / pointsForNextLevel) * 100
    return Math.min(progress, 100)
  }

  const getAchievementIcon = (icon: Achievement['icon']) => {
    const icons = {
      trophy: <Trophy className="w-6 h-6" />,
      star: <Star className="w-6 h-6" />,
      flame: <Flame className="w-6 h-6" />,
      award: <Award className="w-6 h-6" />,
      target: <Target className="w-6 h-6" />,
      zap: <Zap className="w-6 h-6" />,
      medal: <Medal className="w-6 h-6" />,
    }
    return icons[icon]
  }

  const getStreakBadge = () => {
    if (streak >= 30) return { color: 'bg-purple-100 text-purple-700', icon: <Crown className="w-8 h-8" />, label: 'Legend' }
    if (streak >= 14) return { color: 'bg-amber-100 text-amber-700', icon: <Trophy className="w-8 h-8" />, label: 'Master' }
    if (streak >= 7) return { color: 'bg-green-100 text-green-700', icon: <Medal className="w-8 h-8" />, label: 'Dedicated' }
    return { color: 'bg-gray-100 text-gray-700', icon: <Star className="w-8 h-8" />, label: 'Beginner' }
  }

  const streakBadge = getStreakBadge()

  const mockLeaderboard = [
    { rank: 1, name: 'Rajesh K.', points: 5420, language: 'Hindi' },
    { rank: 2, name: 'Priya M.', points: 4890, language: 'Tamil' },
    { rank: 3, name: 'You', points: 1250, language: 'Kannada', isCurrentUser: true },
    { rank: 4, name: 'Amit S.', points: 3980, language: 'Bengali' },
    { rank: 5, name: 'Sneha P.', points: 3750, language: 'Telugu' },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-4 py-2 font-medium transition ${
            selectedTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab('achievements')}
          className={`px-4 py-2 font-medium transition ${
            selectedTab === 'achievements'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setSelectedTab('leaderboard')}
          className={`px-4 py-2 font-medium transition ${
            selectedTab === 'leaderboard'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {selectedTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Points</span>
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{points}</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Level</span>
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{level}</div>
            </div>

            <div className={`p-4 rounded-lg border ${streakBadge.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Daily Streak</span>
                {streakBadge.icon}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-gray-900">{streak}</div>
                <span className="text-sm text-gray-700">days</span>
              </div>
              <div className={`text-xs font-medium mt-1 ${streakBadge.color.split(' ')[0]}`}>
                {streakBadge.label}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Level Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${getLevelProgress()}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{((level - 1) * 250)} points</span>
              <span>{level * 250} points</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-gray-900">Keep the streak alive!</h3>
            </div>
            <p className="text-sm text-amber-800">
              Complete your daily lesson to maintain your {streak}-day streak. Tomorrow you'll earn a bonus streak achievement!
            </p>
          </div>
        </div>
      )}

      {selectedTab === 'achievements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition ${
                  achievement.unlocked
                    ? 'bg-white border-green-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>

                {!achievement.unlocked && achievement.progress !== undefined && achievement.target !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress} / {achievement.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-green-600 mt-3">
                    Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'leaderboard' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Weekly Leaderboard</h3>
            <p className="text-sm text-gray-600">Top learners this week</p>
          </div>

          <div className="space-y-2">
            {mockLeaderboard.map((user, index) => (
              <div
                key={user.rank}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  user.isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  user.rank === 1 ? 'bg-yellow-500' :
                  user.rank === 2 ? 'bg-gray-400' :
                  user.rank === 3 ? 'bg-amber-600' : 'bg-gray-300'
                }`}>
                  {user.rank}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-600">{user.language}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{user.points}</div>
                  <div className="text-xs text-gray-600">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

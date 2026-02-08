import { os } from '@orpc/server'
import { z } from 'zod'
import { db, users, userProgress, lessonAttempts } from '../../db'
import { eq, and, desc, sql } from 'drizzle-orm'
import { requireAuth } from '../middleware'

interface Friend {
  id: number
  name: string
  avatar: string
  nativeLanguage: string
  learningLanguage: string
  totalXP: number
  currentStreak: number
  lastActive: Date
  status: 'online' | 'offline' | 'away'
}

interface StudyGroup {
  id: string
  name: string
  description: string
  language: string
  level: string
  memberCount: number
  maxMembers: number
  createdBy: number
  schedule?: string
  isPublic: boolean
}

export const communityRouter = {
  findLanguageExchange: os
    .input(z.object({
      myLanguage: z.string(),
      targetLanguage: z.string(),
      proficiency: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const mockMatches: Array<Friend & { practiceSchedule?: string }> = [
        {
          id: 101,
          name: 'Ana García',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
          nativeLanguage: 'es',
          learningLanguage: 'en',
          totalXP: 5420,
          currentStreak: 14,
          lastActive: new Date(),
          status: 'online',
          practiceSchedule: 'Weekdays 7-8 PM EST',
        },
        {
          id: 102,
          name: 'Pierre Dubois',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre',
          nativeLanguage: 'fr',
          learningLanguage: 'en',
          totalXP: 3200,
          currentStreak: 7,
          lastActive: new Date(Date.now() - 3600000),
          status: 'away',
          practiceSchedule: 'Weekends 10 AM-12 PM EST',
        },
        {
          id: 103,
          name: 'Yuki Tanaka',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki',
          nativeLanguage: 'ja',
          learningLanguage: 'en',
          totalXP: 8900,
          currentStreak: 30,
          lastActive: new Date(),
          status: 'online',
          practiceSchedule: 'Flexible evenings',
        },
      ]

      return {
        matches: mockMatches.filter(m => m.nativeLanguage === input.targetLanguage),
        total: mockMatches.length,
      }
    }),

  sendExchangeRequest: os
    .input(z.object({
      userId: z.number(),
      message: z.string().max(500).optional(),
      practiceLanguages: z.object({
        iTeach: z.string(),
        iLearn: z.string(),
      }),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        success: true,
        requestId: `request_${Date.now()}`,
        fromUserId: ctx.user.id,
        toUserId: input.userId,
        status: 'pending',
        message: input.message || '',
      }
    }),

  getStudyGroups: os
    .input(z.object({
      language: z.string().optional(),
      level: z.string().optional(),
      search: z.string().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const mockGroups: StudyGroup[] = [
        {
          id: 'group_1',
          name: 'Spanish Conversation Club',
          description: 'Practice speaking Spanish with fellow learners every week!',
          language: 'es',
          level: 'Intermediate',
          memberCount: 45,
          maxMembers: 100,
          createdBy: 1,
          schedule: 'Thursdays 8 PM EST',
          isPublic: true,
        },
        {
          id: 'group_2',
          name: 'French for Travelers',
          description: 'Learn practical French for your next trip to France!',
          language: 'fr',
          level: 'Beginner',
          memberCount: 28,
          maxMembers: 50,
          createdBy: 2,
          schedule: 'Tuesdays 7 PM EST',
          isPublic: true,
        },
        {
          id: 'group_3',
          name: 'Japanese Kanji Study',
          description: 'Master Kanji together with structured study sessions.',
          language: 'ja',
          level: 'All Levels',
          memberCount: 62,
          maxMembers: 100,
          createdBy: 3,
          schedule: 'Daily 30-minute sessions',
          isPublic: true,
        },
        {
          id: 'group_4',
          name: 'German Grammar Geeks',
          description: 'Deep dive into German grammar rules and practice.',
          language: 'de',
          level: 'Advanced',
          memberCount: 15,
          maxMembers: 30,
          createdBy: 4,
          isPublic: true,
        },
      ]

      let filtered = mockGroups
      if (input.language) {
        filtered = filtered.filter(g => g.language === input.language)
      }
      if (input.search) {
        filtered = filtered.filter(g =>
          g.name.toLowerCase().includes(input.search!.toLowerCase()) ||
          g.description.toLowerCase().includes(input.search!.toLowerCase())
        )
      }

      return {
        groups: filtered,
        total: filtered.length,
      }
    }),

  createStudyGroup: os
    .input(z.object({
      name: z.string().min(3).max(50),
      description: z.string().max(500),
      language: z.string(),
      level: z.string(),
      schedule: z.string().optional(),
      isPublic: z.boolean().default(true),
      maxMembers: z.number().min(5).max(500).default(100),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        success: true,
        groupId: `group_${Date.now()}`,
        name: input.name,
        language: input.language,
        createdBy: ctx.user.id,
        memberCount: 1,
        inviteCode: `LG${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      }
    }),

  joinStudyGroup: os
    .input(z.object({
      groupId: z.string(),
      inviteCode: z.string().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        success: true,
        groupId: input.groupId,
        userId: ctx.user.id,
        joinedAt: new Date(),
        welcomeMessage: 'Welcome to the group! Introduce yourself and start practicing!',
      }
    }),

  getFriends: os
    .use(requireAuth)
    .handler(async ({ context: ctx }) => {
      const mockFriends: Array<Friend & { addedAt: Date }> = [
        {
          id: 201,
          name: 'Carlos Rodríguez',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
          nativeLanguage: 'es',
          learningLanguage: 'en',
          totalXP: 12500,
          currentStreak: 45,
          lastActive: new Date(),
          status: 'online',
          addedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: 202,
          name: 'Marie Dubois',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
          nativeLanguage: 'fr',
          learningLanguage: 'en',
          totalXP: 7800,
          currentStreak: 12,
          lastActive: new Date(Date.now() - 7200000),
          status: 'offline',
          addedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
      ]

      return {
        friends: mockFriends,
        pendingRequests: [],
        total: mockFriends.length,
      }
    }),

  challengeFriend: os
    .input(z.object({
      friendId: z.number(),
      challengeType: z.enum(['head_to_head', 'race', 'streak_battle']),
      wager: z.number().default(0),
      lessonCount: z.number().default(5),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        success: true,
        challengeId: `challenge_${Date.now()}`,
        challengerId: ctx.user.id,
        opponentId: input.friendId,
        status: 'pending',
        type: input.challengeType,
        wager: input.wager,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      }
    }),

  getActivityFeed: os
    .input(z.object({
      limit: z.number().default(20),
      friendOnly: z.boolean().default(false),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const activities = [
        {
          id: 'activity_1',
          userId: 201,
          userName: 'Carlos Rodríguez',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
          type: 'lesson_completed',
          description: 'completed "Spanish Grammar: Past Tenses"',
          language: 'es',
          xpEarned: 45,
          timestamp: new Date(Date.now() - 300000),
        },
        {
          id: 'activity_2',
          userId: 202,
          userName: 'Marie Dubois',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
          type: 'streak_milestone',
          description: 'reached a 7-day streak! 🔥',
          language: 'fr',
          xpEarned: 0,
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 'activity_3',
          userId: 201,
          userName: 'Carlos Rodríguez',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
          type: 'achievement_unlocked',
          description: 'unlocked "Week Warrior" badge',
          language: 'es',
          xpEarned: 100,
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          id: 'activity_4',
          userId: 203,
          userName: 'Kenji Tanaka',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji',
          type: 'lesson_completed',
          description: 'completed "Japanese: Numbers 1-100"',
          language: 'ja',
          xpEarned: 30,
          timestamp: new Date(Date.now() - 10800000),
        },
      ]

      return {
        activities: activities.slice(0, input.limit),
        hasMore: activities.length > input.limit,
      }
    }),

  shareProgress: os
    .input(z.object({
      type: z.enum(['lesson', 'streak', 'achievement', 'milestone']),
      content: z.record(z.string(), z.any()),
      shareTo: z.array(z.enum(['friends', 'public', 'group'])).default(['friends']),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        success: true,
        postId: `post_${Date.now()}`,
        userId: ctx.user.id,
        type: input.type,
        likes: 0,
        comments: 0,
        shareUrl: `https://lingograde.app/feed/post_${Date.now()}`,
      }
    }),
}

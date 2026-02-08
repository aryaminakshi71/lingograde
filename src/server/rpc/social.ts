import { os } from '@orpc/server'
import { z } from 'zod'
import { db, users, userProgress, lessonAttempts, streaks, achievements, userAchievements } from '../../db'
import { eq, desc, asc, sql, gte, and, inArray } from 'drizzle-orm'
import { requireAuth } from '../middleware'

export const socialRouter = {
  getLeaderboard: os
    .input(z.object({
      type: z.enum(['weekly', 'monthly', 'allTime', 'friends']).default('weekly'),
      languageId: z.number().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      let dateFilter = sql`true`

      if (input.type === 'weekly') {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        dateFilter = gte(lessonAttempts.completedAt, weekAgo)
      } else if (input.type === 'monthly') {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        dateFilter = gte(lessonAttempts.completedAt, monthAgo)
      }

      const leaderboardQuery = db
        .select({
          userId: users.id,
          userName: users.fullName,
          avatarUrl: users.avatarUrl,
          totalXP: sql<number>`COALESCE(SUM(${lessonAttempts.xpEarned}), 0)`,
          completedLessons: sql<number>`COUNT(DISTINCT ${lessonAttempts.lessonId})`,
          streak: sql<number>`${streaks.currentStreak}`,
        })
        .from(users)
        .leftJoin(lessonAttempts, and(
          eq(lessonAttempts.userId, users.id),
          eq(lessonAttempts.status, 'completed'),
          dateFilter
        ))
        .leftJoin(streaks, eq(streaks.userId, users.id))
        .where(eq(users.isActive, true))
        .groupBy(users.id)
        .orderBy(desc(sql`COALESCE(SUM(${lessonAttempts.xpEarned}), 0)`))
        .limit(input.limit)

      if (input.languageId) {
        // Add language filter
      }

      const results = await leaderboardQuery
      const currentUserRank = results.findIndex(u => u.userId === ctx.user.id) + 1

      return {
        entries: results.map((entry, index) => ({
          rank: index + 1,
          ...entry,
          isCurrentUser: entry.userId === ctx.user.id,
        })),
        currentUserRank: currentUserRank > 0 ? currentUserRank : null,
      }
    }),

  getFriends: os
    .use(requireAuth)
    .handler(async ({ context: ctx }) => {
      // Placeholder for friends system
      // Would need friends table in schema
      return {
        friends: [] as Array<{
          id: number
          name: string | null
          avatarUrl: string | null
          totalXP: number
          currentStreak: number
        }>,
        pendingRequests: [] as Array<{
          id: number
          name: string | null
          avatarUrl: string | null
        }>,
      }
    }),

  sendFriendRequest: os
    .input(z.object({
      userId: z.number(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      if (input.userId === ctx.user.id) {
        throw new Error('Cannot add yourself as friend')
      }

      // Check if user exists
      const [targetUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1)

      if (!targetUser) {
        throw new Error('User not found')
      }

      // Placeholder - would create friend_request record
      return {
        success: true,
        message: `Friend request sent to ${targetUser.fullName || 'user'}`,
      }
    }),

  getStudyGroups: os
    .input(z.object({
      languageId: z.number().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      // Placeholder for study groups
      return {
        groups: [] as Array<{
          id: number
          name: string
          description: string
          languageId: number
          memberCount: number
          isJoined: boolean
        }>,
      }
    }),

  joinStudyGroup: os
    .input(z.object({
      groupId: z.number(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      // Placeholder
      return {
        success: true,
        message: 'Joined study group',
      }
    }),

  getUserProfile: os
    .input(z.object({
      userId: z.number().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const targetUserId = input.userId || ctx.user.id

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, targetUserId))
        .limit(1)

      if (!user) {
        throw new Error('User not found')
      }

      const [userStreak] = await db
        .select()
        .from(streaks)
        .where(eq(streaks.userId, targetUserId))
        .limit(1)

      const completedLessons = await db
        .select({ count: sql<number>`count(*)` })
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, targetUserId),
            eq(userProgress.completed, true)
          )
        )

      const [userAchievementsData] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userAchievements)
        .where(eq(userAchievements.userId, targetUserId))

      const totalXP = await db
        .select({ xp: sql<number>`COALESCE(SUM(${lessonAttempts.xpEarned}), 0)` })
        .from(lessonAttempts)
        .where(
          and(
            eq(lessonAttempts.userId, targetUserId),
            eq(lessonAttempts.status, 'completed')
          )
        )

      return {
        id: user.id,
        name: user.fullName,
        avatarUrl: user.avatarUrl,
        nativeLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
        currentStreak: userStreak?.currentStreak || 0,
        longestStreak: userStreak?.longestStreak || 0,
        completedLessons: completedLessons[0]?.count || 0,
        achievements: userAchievementsData?.count || 0,
        totalXP: totalXP[0]?.xp || 0,
        memberSince: user.createdAt,
      }
    }),

  getActivityFeed: os
    .input(z.object({
      limit: z.number().min(1).max(50).default(20),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      // Placeholder for activity feed
      return {
        activities: [] as Array<{
          id: number
          userId: number
          userName: string | null
          userAvatar: string | null
          type: string
          description: string
          timestamp: Date
        }>,
      }
    }),
}

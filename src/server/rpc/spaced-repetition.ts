import { os } from '@orpc/server'
import { z } from 'zod'
import { db, exercises, exerciseAttempts, lessons, lessonAttempts } from '../../db'
import { eq, and, asc, desc, gte, sql, inArray } from 'drizzle-orm'
import { requireAuth } from '../middleware'

interface SMR2Item {
  itemId: number
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: Date
  lastQuality: number
}

// Logic for calculating next review (separated for reuse)
function calculateNextReviewLogic(input: {
  quality: number,
  previousEaseFactor: number,
  previousInterval: number,
  previousRepetitions: number
}) {
  const { quality, previousEaseFactor, previousInterval, previousRepetitions } = input

  let easeFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  easeFactor = Math.max(1.3, easeFactor)

  let newInterval: number
  let newRepetitions: number

  if (quality < 3) {
    newInterval = 1
    newRepetitions = 0
  } else if (previousRepetitions === 0) {
    newInterval = 1
    newRepetitions = 1
  } else if (previousRepetitions === 1) {
    newInterval = 6
    newRepetitions = 2
  } else {
    newInterval = Math.round(previousInterval * easeFactor)
    newRepetitions = previousRepetitions + 1
  }

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return {
    nextReview,
    newInterval,
    newEaseFactor: Math.round(easeFactor * 100) / 100,
    newRepetitions,
  }
}

export const spacedRepetitionRouter = {
  getReviewQueue: os
    .input(z.object({
      limit: z.number().default(20),
      languageCode: z.string().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const now = new Date()

      // Join lessonAttempts to get access to userId
      const dueItems = await db
        .select({
          itemId: exerciseAttempts.exerciseId,
          easeFactor: sql<number>`1.3`,
          interval: sql<number>`1`,
          repetitions: sql<number>`0`,
          nextReview: sql<Date>`${now}`,
          lastQuality: sql<number>`3`,
        })
        .from(exerciseAttempts)
        .innerJoin(lessonAttempts, eq(exerciseAttempts.lessonAttemptId, lessonAttempts.id))
        .innerJoin(exercises, eq(exerciseAttempts.exerciseId, exercises.id))
        .innerJoin(lessons, eq(exercises.lessonId, lessons.id))
        .where(
          and(
            eq(lessonAttempts.userId, ctx.user.id),
            sql`${exerciseAttempts.createdAt} <= NOW() - INTERVAL '1 day' * (${exerciseAttempts.timeSpentSeconds} / 60)`,
          )
        )
        .limit(input.limit)

      // Convert database result to expected interface
      const mockItems: SMR2Item[] = dueItems.map((item: any) => ({
        itemId: item.itemId,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReview: new Date(),
        lastQuality: 4,
      }))

      return {
        items: mockItems.slice(0, input.limit),
        totalDue: mockItems.length,
        recommendedSessionLength: Math.min(20, mockItems.length),
      }
    }),

  calculateNextReview: os
    .input(z.object({
      itemId: z.number(),
      quality: z.number().min(0).max(5),
      previousEaseFactor: z.number().default(2.5),
      previousInterval: z.number().default(1),
      previousRepetitions: z.number().default(0),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return calculateNextReviewLogic(input)
    }),

  recordReview: os
    .input(z.object({
      exerciseId: z.number(),
      quality: z.number().min(0).max(5),
      responseTime: z.number(),
      selectedAnswer: z.string().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const { exerciseId, quality, responseTime } = input

      const nextReview = calculateNextReviewLogic({
        quality,
        previousEaseFactor: 2.5,
        previousInterval: 1,
        previousRepetitions: 0,
      })

      // We need a lessonAttemptId. For mock/simplicity, we might need to find one or create one.
      // For now, let's find the most recent lesson attempt for this user.
      const [recentAttempt] = await db
        .select()
        .from(lessonAttempts)
        .where(eq(lessonAttempts.userId, ctx.user.id))
        .orderBy(desc(lessonAttempts.startedAt))
        .limit(1)

      if (!recentAttempt) {
        throw new Error('No lesson attempt found to associate with this exercise review')
      }

      await db.insert(exerciseAttempts).values({
        lessonAttemptId: recentAttempt.id,
        exerciseId: exerciseId,
        userAnswer: input.selectedAnswer || '',
        isCorrect: quality >= 3,
        timeSpentSeconds: responseTime,
      })

      return {
        success: true,
        nextReview: nextReview.nextReview,
        interval: nextReview.newInterval,
        easeFactor: nextReview.newEaseFactor,
        isCorrect: quality >= 3,
        feedback: getQualityFeedback(quality),
      }
    }),

  getMemoryStats: os
    .use(requireAuth)
    .handler(async ({ context: ctx }) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      const memoryStats = await db
        .select({
          totalReviews: sql<number>`count(*)`,
          correctReviews: sql<number>`SUM(CASE WHEN ${exerciseAttempts.isCorrect} THEN 1 ELSE 0 END)`,
          avgQuality: sql<number>`AVG(CASE WHEN ${exerciseAttempts.isCorrect} THEN 4 ELSE 2 END)`,
          avgResponseTime: sql<number>`AVG(${exerciseAttempts.timeSpentSeconds})`,
        })
        .from(exerciseAttempts)
        .innerJoin(lessonAttempts, eq(exerciseAttempts.lessonAttemptId, lessonAttempts.id))
        .where(eq(lessonAttempts.userId, ctx.user.id))

      const forgettingCurve = await generateForgettingCurve(ctx.user.id)

      return {
        totalReviews: Number(memoryStats[0]?.totalReviews || 0),
        accuracy: memoryStats[0]?.totalReviews
          ? Math.round((Number(memoryStats[0]?.correctReviews || 0)) / (Number(memoryStats[0]?.totalReviews || 1)) * 100)
          : 0,
        averageQuality: Math.round((Number(memoryStats[0]?.avgQuality || 3)) * 20),
        averageResponseTime: Math.round(Number(memoryStats[0]?.avgResponseTime || 0)),
        forgettingCurve,
        retentionRate: await calculateRetentionRate(ctx.user.id),
      }
    }),

  getOptimalSchedule: os
    .input(z.object({
      targetDate: z.date().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const target = input.targetDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      const optimalTimes: string[] = []
      const currentHour = new Date().getHours()

      const preferredHours = [8, 12, 14, 18, 20]
      const sortedHours = preferredHours.sort((a, b) =>
        Math.abs(a - currentHour) - Math.abs(b - currentHour)
      )

      for (let i = 0; i < 5; i++) {
        optimalTimes.push(`${sortedHours[i]}:00`)
      }

      const recommendedDailyReviews = 20
      const sessionDuration = 15

      return {
        recommendedStudyTimes: optimalTimes,
        dailyReviewCount: recommendedDailyReviews,
        sessionDurationMinutes: sessionDuration,
        targetDate: target,
        estimatedDailyXP: recommendedDailyReviews * 5,
        consistencyAdvice: getConsistencyAdvice(),
      }
    }),

  getForgettingCurveData: os
    .use(requireAuth)
    .handler(async ({ context: ctx }) => {
      return generateForgettingCurve(ctx.user.id)
    }),
}

function getQualityFeedback(quality: number): string {
  if (quality === 5) return "Perfect! You've mastered this."
  if (quality === 4) return "Great job! Almost perfect."
  if (quality === 3) return "Good recall. Keep practicing."
  if (quality === 2) return "Need more practice."
  if (quality === 1) return "Almost forgot. Review again soon."
  return "Complete blackout. Review immediately."
}

async function generateForgettingCurve(userId: number) {
  const timePoints = [0, 1, 6, 24, 72, 168, 720]
  const baseRetention = 0.95

  return timePoints.map(hours => ({
    hoursAfterLearning: hours,
    retentionRate: Math.round(baseRetention ** (hours / 24) * 100),
    reviewsNeeded: hours > 24 ? Math.ceil(hours / 24) : 0,
  }))
}

async function calculateRetentionRate(userId: number): Promise<number> {
  const recent = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(exerciseAttempts)
    .innerJoin(lessonAttempts, eq(exerciseAttempts.lessonAttemptId, lessonAttempts.id))
    .where(
      and(
        eq(lessonAttempts.userId, userId),
        eq(exerciseAttempts.isCorrect, true),
        gte(exerciseAttempts.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
      )
    )

  const older = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(exerciseAttempts)
    .innerJoin(lessonAttempts, eq(exerciseAttempts.lessonAttemptId, lessonAttempts.id))
    .where(
      and(
        eq(lessonAttempts.userId, userId),
        eq(exerciseAttempts.isCorrect, true),
        gte(exerciseAttempts.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      )
    )

  if (!older[0]?.count) return 85
  return Math.min(100, Math.round((Number(recent[0]?.count || 0)) / (Number(older[0]?.count || 1)) * 100))
}

function getConsistencyAdvice(): string[] {
  return [
    "Study at the same time each day to build a habit",
    "Review within 24 hours of learning for best retention",
    "Space out reviews as the interval increases",
    "Focus on difficult items more frequently",
    "Take breaks every 25-30 minutes",
  ]
}

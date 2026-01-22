import { router, procedure } from '@orpc/server'
import { z } from 'zod'
import { db, userProgress, lessons, courses, streaks } from '../../db'
import { eq, and, desc } from 'drizzle-orm'
import { requireAuth } from '../middleware'

export const progressRouter = router({
  getUserProgress: procedure
    .use(requireAuth)
    .query(async ({ ctx }) => {
      const progressList = await db
        .select({
          progress: userProgress,
          lesson: lessons,
          course: courses,
        })
        .from(userProgress)
        .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .where(eq(userProgress.userId, ctx.user.id))
        .orderBy(desc(userProgress.updatedAt))
      
      return progressList.map(p => ({
        ...p.progress,
        lesson: {
          ...p.lesson,
          course: p.course,
        },
      }))
    }),

  getLessonProgress: procedure
    .input(z.object({ lessonId: z.number() }))
    .use(requireAuth)
    .query(async ({ input, ctx }) => {
      const [progress] = await db
        .select({
          progress: userProgress,
          lesson: lessons,
        })
        .from(userProgress)
        .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
        .where(
          and(
            eq(userProgress.userId, ctx.user.id),
            eq(userProgress.lessonId, input.lessonId)
          )
        )
        .limit(1)
      
      return progress ? {
        ...progress.progress,
        lesson: progress.lesson,
      } : null
    }),

  updateProgress: procedure
    .input(
      z.object({
        lessonId: z.number(),
        completed: z.boolean(),
        score: z.number().optional(),
        timeSpentSeconds: z.number().optional(),
      })
    )
    .use(requireAuth)
    .mutation(async ({ input, ctx }) => {
      // Check if progress exists
      const [existing] = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, ctx.user.id),
            eq(userProgress.lessonId, input.lessonId)
          )
        )
        .limit(1)

      if (existing) {
        // Update
        const [updated] = await db
          .update(userProgress)
          .set({
            completed: input.completed,
            score: input.score,
            timeSpentSeconds: input.timeSpentSeconds,
            completedAt: input.completed ? new Date() : null,
            updatedAt: new Date(),
          })
          .where(eq(userProgress.id, existing.id))
          .returning()
        
        return updated
      } else {
        // Create
        const [created] = await db
          .insert(userProgress)
          .values({
            userId: ctx.user.id,
            lessonId: input.lessonId,
            completed: input.completed,
            score: input.score,
            timeSpentSeconds: input.timeSpentSeconds,
            completedAt: input.completed ? new Date() : null,
          })
          .returning()
        
        return created
      }
    }),

  getStreak: procedure
    .use(requireAuth)
    .query(async ({ ctx }) => {
      const [streak] = await db
        .select()
        .from(streaks)
        .where(eq(streaks.userId, ctx.user.id))
        .limit(1)
      
      return streak || {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
      }
    }),
})

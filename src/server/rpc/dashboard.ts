import { router, procedure } from '@orpc/server'
import { db, userProgress, streaks, lessons, courses } from '../../db'
import { eq, and, sql, desc } from 'drizzle-orm'
import { requireAuth } from '../middleware'
import { cache } from '../../lib/redis'

export const dashboardRouter = router({
  getStats: procedure
    .use(requireAuth)
    .query(async ({ ctx }) => {
      // Cache dashboard stats (5 min TTL)
      const cacheKey = `dashboard:stats:${ctx.user.id}`;
      
      return cache.getOrCache(
        cacheKey,
        async () => {
          const [completedLessonsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, ctx.user.id),
            eq(userProgress.completed, true)
          )
        )

      const [totalXPResult] = await db
        .select({ total: sql<number>`coalesce(sum(${userProgress.score}), 0)` })
        .from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))

      const [currentStreak] = await db
        .select()
        .from(streaks)
        .where(eq(streaks.userId, ctx.user.id))
        .limit(1)

      const activeCoursesList = await db
        .select({
          progress: userProgress,
          lesson: lessons,
          course: courses,
        })
        .from(userProgress)
        .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .where(
          and(
            eq(userProgress.userId, ctx.user.id),
            eq(userProgress.completed, false)
          )
        )
        .limit(5)

          return {
            completedLessons: Number(completedLessonsResult?.count) || 0,
            totalXP: Number(totalXPResult?.total) || 0,
            currentStreak: currentStreak?.currentStreak || 0,
            activeCourses: activeCoursesList.length,
          }
        },
        300 // 5 minutes
      )
    }),
})

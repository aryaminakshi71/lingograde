import { os } from '@orpc/server'
import { z } from 'zod'
import { db, users, courses, lessons } from '../../db'
import { eq, desc, count, sql } from 'drizzle-orm'
import { requireAuth, requireAdmin } from '../middleware'

export const adminRouter = {
  getPlatformStats: os
    .use(requireAuth)
    .use(requireAdmin)
    .handler(async ({ context: ctx }) => {
      const [totalUsersResult] = await db
        .select({ count: count() })
        .from(users)

      const [activeUsersResult] = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.isActive, true))

      const [totalCoursesResult] = await db
        .select({ count: count() })
        .from(courses)

      const [totalLessonsResult] = await db
        .select({ count: count() })
        .from(lessons)

      return {
        totalUsers: totalUsersResult?.count || 0,
        activeUsers: activeUsersResult?.count || 0,
        totalCourses: totalCoursesResult?.count || 0,
        totalLessons: totalLessonsResult?.count || 0,
      }
    }),

  getUsers: os
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional()
    )
    .use(requireAuth)
    .use(requireAdmin)
    .handler(async ({ input, context: ctx }) => {
      const userList = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0)
      return userList
    }),
}

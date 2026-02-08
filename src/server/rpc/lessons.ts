import { os } from '@orpc/server'
import { z } from 'zod'
import { db, languages, courses, units, lessons, exercises } from '../../db'
import { eq, and, desc, asc } from 'drizzle-orm'
import { requireAuth } from '../middleware'
import { cache } from '../../lib/redis'

export const lessonsRouter = {
  getLanguages: os
    .handler(async ({ input }) => {
      // Cache languages (24 hour TTL - rarely changes)
      return cache.getOrCache(
        'languages:active',
        async () => {
          const result = await db
            .select()
            .from(languages)
            .where(eq(languages.isActive, true))
            .orderBy(asc(languages.name))
          return result
        },
        86400 // 24 hours
      )
    }),

  getCourses: os
    .input(
      z.object({
        languageId: z.number().optional(),
        difficulty: z.string().optional(),
        featured: z.boolean().optional(),
      }).optional()
    )
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      // Cache courses list (1 hour TTL)
      const cacheKey = `courses:${JSON.stringify(input || {})}`;

      return cache.getOrCache(
        cacheKey,
        async () => {
          const conditions = [eq(courses.isPublished, true)]

          if (input?.languageId) {
            conditions.push(eq(courses.languageId, input.languageId))
          }
          if (input?.difficulty) {
            conditions.push(eq(courses.difficulty, input.difficulty))
          }
          if (input?.featured !== undefined) {
            conditions.push(eq(courses.isFeatured, input.featured))
          }

          const result = await db
            .select({
              course: courses,
              language: languages,
            })
            .from(courses)
            .innerJoin(languages, eq(courses.languageId, languages.id))
            .where(and(...conditions))
            .orderBy(desc(courses.createdAt))

          return result.map(r => ({
            ...r.course,
            language: r.language,
          }))
        },
        3600 // 1 hour
      )
    }),

  getCourse: os
    .input(z.object({ id: z.number() }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.id))
        .limit(1)

      if (!course) {
        throw new Error('Course not found')
      }

      const [language] = await db
        .select()
        .from(languages)
        .where(eq(languages.id, course.languageId))
        .limit(1)

      const courseUnits = await db
        .select()
        .from(units)
        .where(eq(units.courseId, input.id))
        .orderBy(asc(units.orderIndex))

      const courseLessons = await db
        .select()
        .from(lessons)
        .where(
          and(
            eq(lessons.courseId, input.id),
            eq(lessons.isPublished, true)
          )
        )
        .orderBy(asc(lessons.orderIndex))

      return {
        ...course,
        language,
        units: courseUnits.map(unit => ({
          ...unit,
          lessons: courseLessons.filter(lesson => lesson.unitId === unit.id),
        })),
      }
    }),

  getLesson: os
    .input(z.object({ id: z.number() }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, input.id))
        .limit(1)

      if (!lesson) {
        throw new Error('Lesson not found')
      }

      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, lesson.courseId))
        .limit(1)

      const [language] = await db
        .select()
        .from(languages)
        .where(eq(languages.id, lesson.languageId))
        .limit(1)

      const lessonExercises = await db
        .select()
        .from(exercises)
        .where(eq(exercises.lessonId, input.id))
        .orderBy(asc(exercises.orderIndex))

      return {
        ...lesson,
        course,
        language,
        exercises: lessonExercises,
      }
    }),
}

import { os } from '@orpc/server'
import { z } from 'zod'
import { db, lessons, exercises, courses, languages, userProgress, lessonAttempts } from '../../db'
import { eq, and, desc, asc, sql, gte, lte } from 'drizzle-orm'
import { requireAuth } from '../middleware'

export const examRouter = {
  getPlacementTest: os
    .input(z.object({
      languageId: z.number(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const placementLessons = await db
        .select({
          lesson: lessons,
          course: courses,
        })
        .from(lessons)
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .where(
          and(
            eq(courses.languageId, input.languageId),
            eq(lessons.isPublished, true),
            eq(courses.difficulty, 'beginner')
          )
        )
        .orderBy(asc(lessons.orderIndex))
        .limit(10)

      const allExercises = await db
        .select()
        .from(exercises)
        .where(
          sql`${exercises.lessonId} IN ${placementLessons.map(p => p.lesson.id)}`
        )
        .orderBy(asc(exercises.orderIndex))
        .limit(30)

      return {
        lessons: placementLessons.map(p => p.lesson),
        exercises: allExercises,
        totalQuestions: allExercises.length,
        timeLimit: 30,
        passingScore: 70,
      }
    }),

  submitPlacementTest: os
    .input(z.object({
      answers: z.array(z.object({
        exerciseId: z.number(),
        userAnswer: z.string(),
        timeSpentSeconds: z.number(),
      })),
      languageId: z.number(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      let correctCount = 0
      const results: Array<{
        exerciseId: number,
        isCorrect: boolean,
        correctAnswer: string,
      }> = []

      for (const answer of input.answers) {
        const [exercise] = await db
          .select()
          .from(exercises)
          .where(eq(exercises.id, answer.exerciseId))
          .limit(1)

        if (exercise) {
          const isCorrect = answer.userAnswer.toLowerCase().trim() ===
            exercise.correctAnswer.toLowerCase().trim()

          if (isCorrect) correctCount++

          results.push({
            exerciseId: answer.exerciseId,
            isCorrect,
            correctAnswer: exercise.correctAnswer,
          })
        }
      }

      const score = Math.round((correctCount / input.answers.length) * 100)
      const passed = score >= 70

      let recommendedLevel = 'beginner'
      if (score >= 90) recommendedLevel = 'upper_intermediate'
      else if (score >= 75) recommendedLevel = 'intermediate'
      else if (score >= 60) recommendedLevel = 'elementary'

      return {
        score,
        passed,
        correctCount,
        totalQuestions: input.answers.length,
        recommendedLevel,
        results,
      }
    }),

  getLevelExam: os
    .input(z.object({
      courseId: z.number(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.courseId))
        .limit(1)

      if (!course) {
        throw new Error('Course not found')
      }

      const [language] = await db
        .select()
        .from(languages)
        .where(eq(languages.id, course.languageId))
        .limit(1)

      const courseLessons = await db
        .select()
        .from(lessons)
        .where(
          and(
            eq(lessons.courseId, input.courseId),
            eq(lessons.isPublished, true)
          )
        )
        .orderBy(asc(lessons.orderIndex))

      const examExercises: typeof exercises[] = []
      for (const lesson of courseLessons.slice(0, 5)) {
        const lessonExercises = await db
          .select()
          .from(exercises)
          .where(eq(exercises.lessonId, lesson.id))
          .orderBy(asc(exercises.orderIndex))
          .limit(3)
        examExercises.push(...lessonExercises)
      }

      return {
        course,
        language,
        examLessons: courseLessons.slice(0, 5),
        exercises: examExercises,
        totalQuestions: examExercises.length,
        timeLimit: 45,
        passingScore: 80,
        xpReward: course.totalLessons * 5,
      }
    }),

  submitLevelExam: os
    .input(z.object({
      courseId: z.number(),
      answers: z.array(z.object({
        exerciseId: z.number(),
        userAnswer: z.string(),
        timeSpentSeconds: z.number(),
      })),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, input.courseId))
        .limit(1)

      if (!course) {
        throw new Error('Course not found')
      }

      let correctCount = 0
      const results: Array<{
        exerciseId: number,
        isCorrect: boolean,
        correctAnswer: string,
        explanation: string | null,
      }> = []

      for (const answer of input.answers) {
        const [exercise] = await db
          .select()
          .from(exercises)
          .where(eq(exercises.id, answer.exerciseId))
          .limit(1)

        if (exercise) {
          const isCorrect = answer.userAnswer.toLowerCase().trim() ===
            exercise.correctAnswer.toLowerCase().trim()

          if (isCorrect) correctCount++

          results.push({
            exerciseId: answer.exerciseId,
            isCorrect,
            correctAnswer: exercise.correctAnswer,
            explanation: exercise.explanation,
          })
        }
      }

      const score = Math.round((correctCount / input.answers.length) * 100)
      const passed = score >= 80

      const xpEarned = passed ? course.totalLessons * 5 : 0

      if (passed && course.totalLessons) {
        await db.insert(lessonAttempts).values({
          userId: ctx.user.id,
          lessonId: courseLessons[0]?.id || 0,
          score,
          xpEarned,
          timeSpentSeconds: input.answers.reduce((sum, a) => sum + a.timeSpentSeconds, 0),
          status: 'completed',
          completedAt: new Date(),
        })
      }

      return {
        score,
        passed,
        correctCount,
        totalQuestions: input.answers.length,
        xpEarned,
        certificateId: passed ? `CERT-${course.id}-${Date.now()}` : null,
        results,
        message: passed
          ? `Congratulations! You passed the ${course.name} exam!`
          : `You need 80% to pass. Keep studying and try again!`,
      }
    }),

  getCertificates: os
    .use(requireAuth)
    .handler(async ({ context: ctx }) => {
      const completedCourses = await db
        .select({
          course: courses,
          language: languages,
          lastAttempt: lessonAttempts,
        })
        .from(lessonAttempts)
        .innerJoin(lessons, eq(lessonAttempts.lessonId, lessons.id))
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .innerJoin(languages, eq(courses.languageId, languages.id))
        .where(
          and(
            eq(lessonAttempts.userId, ctx.user.id),
            eq(lessonAttempts.status, 'completed'),
            sql`${lessonAttempts.score} >= 80`
          )
        )
        .orderBy(desc(lessonAttempts.completedAt))

      return completedCourses.map(c => ({
        id: `CERT-${c.course.id}-${c.lastAttempt.completedAt?.getTime() || Date.now()}`,
        courseName: c.course.name,
        languageName: c.language.name,
        languageFlag: c.language.flagEmoji,
        score: c.lastAttempt.score,
        completedAt: c.lastAttempt.completedAt,
        xpEarned: c.lastAttempt.xpEarned,
      }))
    }),
}

import { os } from '@orpc/server'
import { z } from 'zod'
import { db, speechAttempts } from '../../db'
import { eq, and, desc } from 'drizzle-orm'
import { requireAuth } from '../middleware'
import {
  transcribeAudio,
  assessPronunciation,
  synthesizeSpeech,
  correctGrammar,
  generatePracticeSentences,
} from '../../lib/openai'
import { checkRateLimit } from '../../lib/redis'
import { captureException } from '../../lib/sentry'

const speechAttemptSchema = z.object({
  textToSpeak: z.string(),
  audioUrl: z.string().optional(),
  transcription: z.string().optional(),
  pronunciationScore: z.number().optional(),
  fluencyScore: z.number().optional(),
  accuracyScore: z.number().optional(),
  feedback: z.string().optional(),
})

export const speechRouter = {
  // Transcribe audio to text
  transcribe: os
    .input(
      z.object({
        audioBase64: z.string(),
        language: z.string().optional(),
      })
    )
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      // Rate limit check
      const rateLimit = await checkRateLimit('speech', ctx.user.id)
      if (!rateLimit.success) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }

      try {
        // Convert base64 to blob
        const audioBuffer = Buffer.from(input.audioBase64, 'base64')
        const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' })
        const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' })

        const transcription = await transcribeAudio(audioFile, {
          language: input.language,
        })

        return { transcription }
      } catch (error) {
        captureException(error, {
          user: { id: ctx.user.id },
          tags: { feature: 'speech-transcribe' },
        })
        throw new Error('Failed to transcribe audio')
      }
    }),

  // Assess pronunciation
  assess: os
    .input(
      z.object({
        targetText: z.string(),
        transcribedText: z.string(),
        language: z.string(),
      })
    )
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const rateLimit = await checkRateLimit('speech', ctx.user.id)
      if (!rateLimit.success) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }

      try {
        const assessment = await assessPronunciation(
          input.targetText,
          input.transcribedText,
          input.language
        )

        // Save attempt to database
        const [attempt] = await db
          .insert(speechAttempts)
          .values({
            userId: ctx.user.id,
            textToSpeak: input.targetText,
            transcription: input.transcribedText,
            pronunciationScore: assessment.score,
            fluencyScore: assessment.fluency,
            accuracyScore: assessment.accuracy,
            feedback: assessment.feedback,
          })
          .returning()

        return { assessment, attemptId: attempt.id }
      } catch (error) {
        captureException(error, {
          user: { id: ctx.user.id },
          tags: { feature: 'speech-assess' },
        })
        throw new Error('Failed to assess pronunciation')
      }
    }),

  // Text-to-speech
  synthesize: os
    .input(
      z.object({
        text: z.string(),
        voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional(),
        speed: z.number().min(0.25).max(4).optional(),
      })
    )
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const rateLimit = await checkRateLimit('speech', ctx.user.id)
      if (!rateLimit.success) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }

      try {
        const audioBuffer = await synthesizeSpeech(input.text, {
          voice: input.voice,
          speed: input.speed,
        })

        // Return as base64
        const base64 = Buffer.from(audioBuffer).toString('base64')
        return { audioBase64: base64, mimeType: 'audio/mpeg' }
      } catch (error) {
        captureException(error, {
          user: { id: ctx.user.id },
          tags: { feature: 'speech-synthesize' },
        })
        throw new Error('Failed to synthesize speech')
      }
    }),

  // Grammar correction
  correctGrammar: os
    .input(
      z.object({
        text: z.string(),
        language: z.string(),
      })
    )
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const rateLimit = await checkRateLimit('speech', ctx.user.id)
      if (!rateLimit.success) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }

      try {
        const correction = await correctGrammar(input.text, input.language)
        return correction
      } catch (error) {
        captureException(error, {
          user: { id: ctx.user.id },
          tags: { feature: 'grammar-correct' },
        })
        throw new Error('Failed to correct grammar')
      }
    }),

  // Generate practice sentences
  generatePractice: os
    .input(
      z.object({
        topic: z.string(),
        language: z.string(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
        count: z.number().min(1).max(10).optional(),
      })
    )
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const rateLimit = await checkRateLimit('speech', ctx.user.id)
      if (!rateLimit.success) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }

      try {
        const practice = await generatePracticeSentences(
          input.topic,
          input.language,
          input.difficulty,
          input.count
        )
        return practice
      } catch (error) {
        captureException(error, {
          user: { id: ctx.user.id },
          tags: { feature: 'generate-practice' },
        })
        throw new Error('Failed to generate practice sentences')
      }
    }),

  // Create manual attempt record
  createAttempt: os
    .input(speechAttemptSchema)
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const [attempt] = await db
        .insert(speechAttempts)
        .values({
          userId: ctx.user.id,
          ...input,
        })
        .returning()
      return attempt
    }),

  // Get user's attempts
  getAttempts: os
    .input(
      z
        .object({
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
        .optional()
    )
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const attempts = await db
        .select()
        .from(speechAttempts)
        .where(eq(speechAttempts.userId, ctx.user.id))
        .orderBy(desc(speechAttempts.createdAt))
        .limit(input?.limit || 10)
        .offset(input?.offset || 0)
      return attempts
    }),

  // Get single attempt
  getAttempt: os
    .input(z.object({ id: z.number() }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const [attempt] = await db
        .select()
        .from(speechAttempts)
        .where(
          and(
            eq(speechAttempts.id, input.id),
            eq(speechAttempts.userId, ctx.user.id)
          )
        )
        .limit(1)
      if (!attempt) {
        throw new Error('Attempt not found')
      }
      return attempt
    }),
}

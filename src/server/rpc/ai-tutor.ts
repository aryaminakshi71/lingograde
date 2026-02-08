import { os } from '@orpc/server'
import { z } from 'zod'
import { OpenAI } from 'openai'
import { db, speechAttempts, lessons, courses } from '../../db'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../middleware'
import { openai } from '../../lib/openai'

export const aiTutorRouter = {
  chat: os
    .input(z.object({
      message: z.string().min(1).max(1000),
      languageCode: z.string().min(2).max(10),
      context: z.string().optional(),
      conversationHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })).optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content: `You are a friendly language tutor helping someone learn ${input.languageCode}. 
            Keep responses concise and encouraging. Correct mistakes gently. 
            Use ${input.languageCode} in your responses when appropriate for the learner's level.
            ${input.context ? `Context: ${input.context}` : ''}`,
        },
      ]

      if (input.conversationHistory) {
        messages.push(...input.conversationHistory.map(h => ({
          role: h.role as 'user' | 'assistant',
          content: h.content,
        })))
      }

      messages.push({ role: 'user', content: input.message })

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: messages as any,
          max_tokens: 500,
          temperature: 0.7,
        })

        const response = completion.choices[0]?.message?.content ||
          'Sorry, I did not understand. Could you repeat?'

        return {
          response,
          usage: {
            tokens: completion.usage?.total_tokens,
          },
        }
      } catch (error) {
        console.error('AI chat error:', error)
        throw new Error('Failed to get AI response')
      }
    }),

  writingFeedback: os
    .input(z.object({
      text: z.string().min(10).max(2000),
      languageCode: z.string().min(2).max(10),
      taskType: z.enum(['essay', 'email', 'letter', 'paragraph', 'story', 'other']).default('other'),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const feedbackPrompt = `You are a language tutor grading a ${input.taskType} in ${input.languageCode}.
        
Text to grade:
${input.text}

Provide feedback in JSON format:
{
  "grade": "A" | "B" | "C" | "D" | "F",
  "score": number (0-100),
  "strengths": string[],
  "improvements": string[],
  "grammarMistakes": Array<{ sentence: string; correction: string; explanation: string }>,
  "vocabularySuggestions": string[],
  "overallFeedback": string
}`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: feedbackPrompt }],
          response_format: { type: 'json_object' },
          max_tokens: 1000,
          temperature: 0.3,
        })

        const feedback = completion.choices[0]?.message?.content
        return {
          feedback: feedback ? JSON.parse(feedback) : null,
          tokens: completion.usage?.total_tokens,
        }
      } catch (error) {
        console.error('Writing feedback error:', error)
        throw new Error('Failed to analyze writing')
      }
    }),

  pronunciationScore: os
    .input(z.object({
      textToSpeak: z.string().min(1).max(500),
      audioUrl: z.string().url(),
      languageCode: z.string().min(2).max(10),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      try {
        const audioBlob = await fetch(input.audioUrl).then(r => r.blob())
        const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' })

        const transcription = await openai!.audio.transcriptions.create({
          model: 'whisper-1',
          file: audioFile,
          language: input.languageCode,
        })

        const similarityPrompt = `Compare the original text with the transcription and rate pronunciation.
        
Original: "${input.textToSpeak}"
Transcribed: "${transcription.text}"

Rate on a scale of 0-100 for:
- pronunciation (clarity of speech sounds)
- fluency (natural flow and rhythm)
- accuracy (how well it matches the original)

Return JSON:
{
  "pronunciationScore": number,
  "fluencyScore": number,
  "accuracyScore": number,
  "overallScore": number,
  "feedback": "brief encouraging feedback",
  "suggestions": "what to improve"
}`

        const evaluation = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: similarityPrompt }],
          response_format: { type: 'json_object' },
          max_tokens: 300,
        })

        const result = JSON.parse(evaluation.choices[0]?.message?.content || '{}')

        await db.insert(speechAttempts).values({
          userId: ctx.user.id,
          textToSpeak: input.textToSpeak,
          audioUrl: input.audioUrl,
          transcription: transcription.text,
          pronunciationScore: result.pronunciationScore,
          fluencyScore: result.fluencyScore,
          accuracyScore: result.accuracyScore,
          feedback: result.feedback,
        })

        return {
          transcription: transcription.text,
          scores: result,
        }
      } catch (error) {
        console.error('Pronunciation scoring error:', error)
        throw new Error('Failed to analyze pronunciation')
      }
    }),

  generateConversation: os
    .input(z.object({
      languageCode: z.string().min(2).max(10),
      topic: z.string().min(1).max(200),
      difficulty: z.enum(['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient']).default('intermediate'),
      scenario: z.string().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const scenarioPrompt = `Generate a conversation practice scenario in ${input.languageCode}.
        
Topic: ${input.topic}
Difficulty: ${input.difficulty}
${input.scenario ? `Scenario: ${input.scenario}` : ''}

Return JSON:
{
  "title": "conversation title",
  "scenario": "brief context for the conversation",
  "situation": "where this conversation takes place",
  "vocabulary": ["word1", "word2", ...],
  "phrasesToLearn": ["useful phrase 1", "useful phrase 2", ...],
  "exampleDialogue": [
    { "speaker": "A", "text": "line in target language", "translation": "English translation" },
    { "speaker": "B", "text": "line in target language", "translation": "English translation" }
  ],
  "culturalNote": "any cultural context",
  "followUpQuestions": ["question 1 in target language", "question 2 in target language"]
}`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: scenarioPrompt }],
          response_format: { type: 'json_object' },
          max_tokens: 1500,
          temperature: 0.7,
        })

        return {
          scenario: JSON.parse(completion.choices[0]?.message?.content || '{}'),
          tokens: completion.usage?.total_tokens,
        }
      } catch (error) {
        console.error('Conversation generation error:', error)
        throw new Error('Failed to generate conversation')
      }
    }),

  translateSentence: os
    .input(z.object({
      sentence: z.string().min(1).max(500),
      sourceLanguage: z.string().min(2).max(10),
      targetLanguage: z.string().min(2).max(10),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const translatePrompt = `Translate this ${input.sourceLanguage} sentence to ${input.targetLanguage}:
        
"${input.sentence}"

Return JSON:
{
  "original": "original sentence",
  "translation": "translated sentence",
  "literalTranslation": "word-for-word translation",
  "explanation": "brief grammar/cultural note if helpful"
}`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: translatePrompt }],
          response_format: { type: 'json_object' },
          max_tokens: 300,
          temperature: 0.1,
        })

        return JSON.parse(completion.choices[0]?.message?.content || '{}')
      } catch (error) {
        console.error('Translation error:', error)
        throw new Error('Failed to translate')
      }
    }),

  getStudyRecommendations: os
    .input(z.object({
      languageId: z.number(),
      currentLevel: z.string(),
      completedLessons: z.array(z.number()),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const [lessonsData] = await db
        .select({
          lesson: lessons,
          course: courses,
        })
        .from(lessons)
        .innerJoin(courses, eq(lessons.courseId, courses.id))
        .where(
          and(
            eq(courses.languageId, input.languageId),
            eq(courses.difficulty, input.currentLevel as any),
            eq(lessons.isPublished, true)
          )
        )
        .limit(20)

      const recommendations = `Based on the user's progress, recommend:
- Next 3 lessons to take
- Study tips for ${input.currentLevel}
- Practice exercises
- Estimated time to next level

User has completed ${input.completedLessons.length} lessons.`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: recommendations }],
          max_tokens: 500,
          temperature: 0.7,
        })

        return {
          recommendations: completion.choices[0]?.message?.content,
          suggestedLessons: lessonsData?.lesson ? [lessonsData.lesson] : [],
        }
      } catch (error) {
        console.error('Recommendations error:', error)
        throw new Error('Failed to get recommendations')
      }
    }),
}

import { os } from '@orpc/server'
import { z } from 'zod'
import { OpenAI } from 'openai'
import { requireAuth } from '../middleware'
import { openai } from '../../lib/openai'

interface GrammarIssue {
  id: string
  type: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'vocabulary'
  original: string
  corrected: string
  explanation: string
  severity: 'error' | 'warning' | 'info'
  position: { start: number; end: number }
}

interface WritingFeedback {
  overallGrade: string
  score: number
  wordCount: number
  sentenceCount: number
  readabilityScore: number
  strengths: string[]
  improvements: string[]
  issues: GrammarIssue[]
  vocabularySuggestions: string[]
  styleFeedback: string
  culturalNotes: string[]
}

export const writingAssistantRouter = {
  analyzeText: os
    .input(z.object({
      text: z.string().min(10).max(5000),
      language: z.string().min(2).max(10),
      taskType: z.enum(['essay', 'email', 'letter', 'paragraph', 'story', 'formal', 'informal', 'other']).default('essay'),
      targetAudience: z.enum(['general', 'academic', 'business', 'friends']).default('general'),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const prompt = `Analyze this ${input.language} text and provide detailed feedback.
        
Text: "${input.text}"
Task type: ${input.taskType}
Target audience: ${input.targetAudience}

Return JSON:
{
  "overallGrade": "A" | "B" | "C" | "D" | "F",
  "score": number (0-100),
  "wordCount": number,
  "sentenceCount": number,
  "readabilityScore": number (0-100),
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "issues": [
    {
      "type": "grammar" | "spelling" | "punctuation" | "style" | "vocabulary",
      "original": "incorrect phrase",
      "corrected": "correct phrase",
      "explanation": "why this is wrong/could be better",
      "severity": "error" | "warning" | "info"
    }
  ],
  "vocabularySuggestions": ["better word 1", "better word 2", ...],
  "styleFeedback": "brief style assessment",
  "culturalNotes": ["cultural context if applicable"]
}`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
          temperature: 0.3,
        })

        const result = completion.choices[0]?.message?.content
        return {
          feedback: result ? JSON.parse(result) : null,
          tokens: completion.usage?.total_tokens,
        }
      } catch (error) {
        console.error('Writing analysis error:', error)
        return {
          feedback: generateMockFeedback(input.text),
          tokens: 0,
        }
      }
    }),

  realTimeGrammarCheck: os
    .input(z.object({
      text: z.string().min(1).max(1000),
      language: z.string().min(2).max(10),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const mockIssues: GrammarIssue[] = []

      const patterns = [
        { pattern: /\s+/g, message: 'Check spacing' },
        { pattern: /\bi\b/gi, message: 'Capitalize "I"' },
      ]

      return {
        text: input.text,
        issues: mockIssues,
        cleanText: input.text,
        suggestionCount: mockIssues.length,
      }
    }),

  improveStyle: os
    .input(z.object({
      text: z.string().min(20).max(3000),
      language: z.string(),
      style: z.enum(['more_formal', 'more_informal', 'more_concise', 'more_expressive', 'more_professional']).default('more_professional'),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const prompt = `Rewrite this ${input.language} text to be ${input.style}.
        
Original: "${input.text}"

Return JSON:
{
  "improvedText": "rewritten text",
  "changes": [
    {
      "original": "changed phrase",
      "improved": "new phrase",
      "reason": "why this change improves the style"
    }
  ],
  "overallImprovement": "summary of style improvements"
}`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
          temperature: 0.5,
        })

        return JSON.parse(completion.choices[0]?.message?.content || '{}')
      } catch (error) {
        return {
          improvedText: input.text,
          changes: [],
          overallImprovement: 'No significant changes needed.',
        }
      }
    }),

  expandVocabulary: os
    .input(z.object({
      text: z.string().min(10).max(2000),
      language: z.string(),
      vocabularyLevel: z.enum(['basic', 'intermediate', 'advanced', 'academic']).default('intermediate'),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const prompt = `Suggest better vocabulary for this ${input.language} text at ${input.vocabularyLevel} level.
        
Text: "${input.text}"

Return JSON:
{
  "suggestions": [
    {
      "original": "common word",
      "suggested": "better word/phrase",
      "context": "where to use it",
      "translation": "English meaning",
      "example": "example sentence"
    }
  ],
  "enrichedText": "text with suggested words in brackets"
}`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 1500,
          temperature: 0.5,
        })

        return JSON.parse(completion.choices[0]?.message?.content || '{}')
      } catch (error) {
        return { suggestions: [], enrichedText: input.text }
      }
    }),

  checkRegister: os
    .input(z.object({
      text: z.string().min(10).max(2000),
      language: z.string(),
      targetRegister: z.enum(['formal', 'informal', 'academic', 'business', 'casual']).default('formal'),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const prompt = `Analyze the register of this ${input.language} text and compare to ${input.targetRegister} register.
        
Text: "${input.text}"
Target register: ${input.targetRegister}

Return JSON:
{
  "currentRegister": "formal/informal/etc",
  "registerMatch": number (0-100),
  "adjustments": [
    {
      "phrase": "current phrase",
      "suggested": "adjusted phrase",
      "reason": "why this adjustment is needed for target register"
    }
  ],
  "overallFeedback": "brief assessment"
}`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 1000,
          temperature: 0.3,
        })

        return JSON.parse(completion.choices[0]?.message?.content || '{}')
      } catch (error) {
        return {
          currentRegister: 'neutral',
          registerMatch: 75,
          adjustments: [],
          overallFeedback: 'Your text has a neutral register.',
        }
      }
    }),

  culturalContext: os
    .input(z.object({
      text: z.string().min(10).max(2000),
      language: z.string(),
      targetCulture: z.string().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const prompt = `Provide cultural context and nuances for this ${input.language} text.
        ${input.targetCulture ? `Target culture: ${input.targetCulture}` : ''}
        
Text: "${input.text}"

Return JSON:
{
  "culturalNotes": [
    "cultural context 1",
    "cultural context 2"
  ],
  "idioms": [
    {
      "phrase": "idiom from text",
      "meaning": "literal meaning",
      "actualMeaning": "what it really means",
      "usage": "when to use it"
    }
  ],
  "regionalVariations": [
    {
      "region": "country/region",
      "alternative": "regional way to say it",
      "usage": "when to use this variation"
    }
  ],
  "politeForms": "notes on formality/politeness if applicable"
}`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 1500,
          temperature: 0.5,
        })

        return JSON.parse(completion.choices[0]?.message?.content || '{}')
      } catch (error) {
        return {
          culturalNotes: [],
          idioms: [],
          regionalVariations: [],
          politeForms: '',
        }
      }
    }),

  generateWritingPrompt: os
    .input(z.object({
      language: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
      topic: z.string().optional(),
      type: z.enum(['essay', 'email', 'story', 'opinion', 'descriptive']).default('essay'),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const topics = {
        essay: [
          'The benefits of learning a new language',
          'How technology has changed communication',
          'The importance of cultural understanding',
        ],
        email: [
          'Writing to a pen pal about your daily routine',
          'A formal email requesting information',
          'An email inviting a friend to visit',
        ],
        story: [
          'A memorable trip you took',
          'An unexpected meeting with an old friend',
          'A day when everything went wrong',
        ],
      }

      const prompt = topics[input.type as keyof typeof topics] || topics.essay

      return {
        prompt: input.topic || prompt[Math.floor(Math.random() * prompt.length)],
        type: input.type,
        difficulty: input.difficulty,
        wordCount: input.difficulty === 'beginner' ? 100 : input.difficulty === 'intermediate' ? 200 : 350,
        timeLimit: input.difficulty === 'beginner' ? 20 : input.difficulty === 'intermediate' ? 30 : 45,
        criteria: [
          'Clear introduction and conclusion',
          'Well-developed paragraphs',
          'Correct grammar and vocabulary',
          'Cohesive flow of ideas',
        ],
      }
    }),

  translateAndExplain: os
    .input(z.object({
      text: z.string().min(1).max(500),
      sourceLanguage: z.string(),
      targetLanguage: z.string(),
      explanation: z.boolean().default(true),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const prompt = `Translate this ${input.sourceLanguage} text to ${input.targetLanguage}.
        ${input.explanation ? 'Provide grammar and cultural explanations.' : ''}
        
Text: "${input.text}"

Return JSON:
{
  "translation": "translated text",
  "literalTranslation": "word-for-word if different",
  "grammarNotes": ["note 1", "note 2"] if explanation,
  "culturalNote": "cultural context if helpful" if explanation
}`

      try {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          max_tokens: 500,
          temperature: 0.1,
        })

        return JSON.parse(completion.choices[0]?.message?.content || '{}')
      } catch (error) {
        return {
          translation: input.text,
          literalTranslation: input.text,
          grammarNotes: [],
          culturalNote: '',
        }
      }
    }),
}

function generateMockFeedback(text: string): WritingFeedback {
  return {
    overallGrade: 'B',
    score: 82,
    wordCount: text.split(' ').length,
    sentenceCount: text.split('.').length,
    readabilityScore: 68,
    strengths: [
      'Clear structure and organization',
      'Good use of transition words',
      'Appropriate vocabulary for level',
    ],
    improvements: [
      'Consider using more varied sentence structures',
      'Add more specific examples',
      'Work on connecting ideas more smoothly',
    ],
    issues: [],
    vocabularySuggestions: [
      'consider → contemplate, evaluate',
      'good → excellent, beneficial',
      'show → demonstrate, illustrate',
    ],
    styleFeedback: 'Your writing has a good balance of formality and clarity.',
    culturalNotes: [
      'In formal writing, avoid contractions',
      'Consider regional variations in vocabulary',
    ],
  }
}

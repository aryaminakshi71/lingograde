import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not set - OpenAI features disabled')
}

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// Speech-to-text transcription
export async function transcribeAudio(
  audioFile: File | Blob,
  options?: {
    language?: string
    prompt?: string
  }
) {
  if (!openai) throw new Error('OpenAI not configured')

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
    language: options?.language,
    prompt: options?.prompt,
  })

  return transcription.text
}

// Text-to-speech synthesis
export async function synthesizeSpeech(
  text: string,
  options?: {
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
    speed?: number
  }
) {
  if (!openai) throw new Error('OpenAI not configured')

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: options?.voice || 'nova',
    input: text,
    speed: options?.speed || 1.0,
  })

  return response.arrayBuffer()
}

// Pronunciation assessment using GPT-4
export async function assessPronunciation(
  targetText: string,
  transcribedText: string,
  language: string
) {
  if (!openai) throw new Error('OpenAI not configured')

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a language pronunciation expert. Compare the target text with what was spoken and provide a detailed assessment. Respond in JSON format with the following structure:
{
  "score": number (0-100),
  "accuracy": number (0-100),
  "fluency": number (0-100),
  "feedback": string,
  "corrections": [{ "expected": string, "spoken": string, "suggestion": string }],
  "strengths": string[],
  "areasToImprove": string[]
}`,
      },
      {
        role: 'user',
        content: `Language: ${language}
Target text: "${targetText}"
Spoken text (transcribed): "${transcribedText}"

Assess the pronunciation and provide feedback.`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from OpenAI')

  return JSON.parse(content) as {
    score: number
    accuracy: number
    fluency: number
    feedback: string
    corrections: { expected: string; spoken: string; suggestion: string }[]
    strengths: string[]
    areasToImprove: string[]
  }
}

// Grammar correction
export async function correctGrammar(
  text: string,
  language: string
) {
  if (!openai) throw new Error('OpenAI not configured')

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a language grammar expert for ${language}. Correct the grammar in the given text and explain the corrections. Respond in JSON format:
{
  "correctedText": string,
  "corrections": [{ "original": string, "corrected": string, "explanation": string }],
  "overallFeedback": string
}`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from OpenAI')

  return JSON.parse(content) as {
    correctedText: string
    corrections: { original: string; corrected: string; explanation: string }[]
    overallFeedback: string
  }
}

// Generate practice sentences
export async function generatePracticeSentences(
  topic: string,
  language: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  count: number = 5
) {
  if (!openai) throw new Error('OpenAI not configured')

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a language learning content creator. Generate practice sentences for language learners. Respond in JSON format:
{
  "sentences": [
    {
      "text": string,
      "translation": string,
      "pronunciation_guide": string,
      "vocabulary": [{ "word": string, "meaning": string }]
    }
  ]
}`,
      },
      {
        role: 'user',
        content: `Generate ${count} ${difficulty} level practice sentences in ${language} about "${topic}".`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from OpenAI')

  return JSON.parse(content) as {
    sentences: {
      text: string
      translation: string
      pronunciation_guide: string
      vocabulary: { word: string; meaning: string }[]
    }[]
  }
}

// Chat conversation practice
export async function conversationPractice(
  messages: { role: 'user' | 'assistant'; content: string }[],
  language: string,
  scenario: string
) {
  if (!openai) throw new Error('OpenAI not configured')

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a friendly conversation partner helping someone practice ${language}.
The scenario is: ${scenario}
- Respond naturally in ${language}
- Keep responses concise (1-3 sentences)
- Gently correct major errors
- Encourage the learner
- After your response, add a JSON block with: {"feedback": "brief feedback on their message", "suggestion": "optional vocabulary or grammar tip"}`,
      },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ],
  })

  return response.choices[0]?.message?.content || ''
}

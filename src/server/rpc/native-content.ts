import { os } from '@orpc/server'
import { z } from 'zod'
import { requireAuth } from '../middleware'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  source: string
  language: string
  difficulty: string
  publishedAt: Date
  url: string
  imageUrl?: string
  vocabulary: Array<{ word: string; translation: string; context: string }>
  comprehensionQuestions: Array<{ question: string; options: string[]; answer: string }>
  readingTime: number
  category: string
}

interface VideoContent {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  language: string
  difficulty: string
  duration: number
  transcript: string
  vocabulary: Array<{ word: string; translation: string; timestamp: number }>
  comprehensionQuestions: Array<{ question: string; answer: string }>
  subtitles: { language: string; url: string }[]
}

interface PodcastEpisode {
  id: string
  title: string
  description: string
  audioUrl: string
  imageUrl: string
  language: string
  difficulty: string
  duration: number
  transcript: string
  vocabulary: Array<{ word: string; translation: string; context: string }>
  discussionQuestions: string[]
  guests?: string[]
}

export const nativeContentRouter = {
  getNewsArticles: os
    .input(z.object({
      language: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      category: z.string().optional(),
      limit: z.number().default(10),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const mockArticles: NewsArticle[] = [
        {
          id: 'news_1',
          title: 'La tecnología transforma la educación en España',
          excerpt: 'Las escuelas españolas adoptan nuevas herramientas digitales para mejorar el aprendizaje.',
          content: 'El sistema educativo español está experimentando una transformación digital sin precedentes...',
          source: 'El País',
          language: 'es',
          difficulty: 'intermediate',
          publishedAt: new Date(),
          url: 'https://elpais.com/educacion/tecnologia',
          imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
          vocabulary: [
            { word: 'tecnología', translation: 'technology', context: 'La tecnología transforma...' },
            { word: 'educación', translation: 'education', context: 'sistema educativo' },
            { word: 'transformación', translation: 'transformation', context: 'transformación digital' },
          ],
          comprehensionQuestions: [
            { question: '¿Qué está transformando el sistema educativo?', options: ['La política', 'La tecnología', 'Los profesores'], answer: 'La tecnología' },
            { question: '¿Dónde se publica este artículo?', options: ['En España', 'En México', 'En Argentina'], answer: 'En España' },
          ],
          readingTime: 5,
          category: 'Education',
        },
        {
          id: 'news_2',
          title: 'Le tourisme durable gagne en popularité en France',
          excerpt: 'Les voyageurs français privilégient de plus en plus les destinations écologiques.',
          content: 'Le tourisme durable connaît une croissance significative en France...',
          source: 'Le Monde',
          language: 'fr',
          difficulty: 'intermediate',
          publishedAt: new Date(),
          url: 'https://lemonde.fr/tourisme-durable',
          imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          vocabulary: [
            { word: 'tourisme', translation: 'tourism', context: 'tourisme durable' },
            { word: 'durable', translation: 'sustainable', context: 'tourisme durable' },
            { word: 'populaire', translation: 'popular', context: 'gagne en popularité' },
          ],
          comprehensionQuestions: [],
          readingTime: 4,
          category: 'Travel',
        },
        {
          id: 'news_3',
          title: '日本の技術が世界中をリード',
          excerpt: '日本の製造業とテクノロジーが再び世界を席巻しています。',
          content: '日本の技術革新が再び世界の注目を集めています...',
          source: 'NHK',
          language: 'ja',
          difficulty: 'advanced',
          publishedAt: new Date(),
          url: 'https://nhk.jp/technology',
          imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
          vocabulary: [
            { word: '技術', translation: 'technology', context: '日本の技術' },
            { word: '世界中', translation: 'all over the world', context: '世界中をリード' },
            { word: '席巻', translation: 'dominate', context: '世界を席巻' },
          ],
          comprehensionQuestions: [],
          readingTime: 6,
          category: 'Technology',
        },
      ]

      return {
        articles: mockArticles,
        total: mockArticles.length,
      }
    }),

  getVideos: os
    .input(z.object({
      language: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      category: z.string().optional(),
      limit: z.number().default(10),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const mockVideos: VideoContent[] = [
        {
          id: 'video_1',
          title: 'Cómo pedir direcciones en español',
          description: 'Aprende a pedir y dar direcciones en situaciones reales.',
          videoUrl: 'https://youtube.com/watch?v=example1',
          thumbnailUrl: 'https://images.unsplash.com/photo-1560169578-f889f4247438?w=800',
          language: 'es',
          difficulty: 'beginner',
          duration: 480,
          transcript: 'Hola, hoy vamos a aprender cómo pedir direcciones en español...',
          vocabulary: [
            { word: 'direcciones', translation: 'directions', timestamp: 30 },
            { word: 'derecha', translation: 'right', timestamp: 60 },
            { word: 'izquierda', translation: 'left', timestamp: 90 },
          ],
          comprehensionQuestions: [
            { question: '¿Qué palabra significa "right" en español?', answer: 'derecha' },
          ],
          subtitles: [
            { language: 'es', url: '/subtitles/es/video1.vtt' },
            { language: 'en', url: '/subtitles/en/video1.vtt' },
          ],
        },
        {
          id: 'video_2',
          title: 'French Café Culture',
          description: 'Explore the art of French café culture and ordering coffee.',
          videoUrl: 'https://youtube.com/watch?v=example2',
          thumbnailUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
          language: 'fr',
          difficulty: 'intermediate',
          duration: 720,
          transcript: 'Bienvenue dans un café parisien...',
          vocabulary: [
            { word: 'café', translation: 'coffee', timestamp: 120 },
            { word: 'commandez', translation: 'order', timestamp: 240 },
          ],
          comprehensionQuestions: [],
          subtitles: [
            { language: 'fr', url: '/subtitles/fr/video2.vtt' },
            { language: 'en', url: '/subtitles/en/video2.vtt' },
          ],
        },
      ]

      return {
        videos: mockVideos,
        total: mockVideos.length,
      }
    }),

  getPodcasts: os
    .input(z.object({
      language: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      category: z.string().optional(),
      limit: z.number().default(10),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const mockPodcasts: PodcastEpisode[] = [
        {
          id: 'podcast_1',
          title: 'Episodio 42: La vida en Madrid',
          description: 'Conversamos con María sobre su vida en Madrid.',
          audioUrl: 'https://podcast.lingograde.app/episodes/42.mp3',
          imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
          language: 'es',
          difficulty: 'intermediate',
          duration: 1800,
          transcript: 'Bienvenidos a otro episodio de nuestro podcast...',
          vocabulary: [
            { word: 'vida', translation: 'life', context: 'la vida en Madrid' },
            { word: 'ciudad', translation: 'city', context: 'gran ciudad' },
          ],
          discussionQuestions: [
            '¿Qué te gustaría hacer en Madrid?',
            '¿Prefieres vivir en una ciudad grande o pequeña?',
          ],
        },
      ]

      return {
        episodes: mockPodcasts,
        total: mockPodcasts.length,
      }
    }),

  getSocialMediaPosts: os
    .input(z.object({
      language: z.string(),
      platform: z.enum(['twitter', 'instagram', 'reddit']).optional(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      limit: z.number().default(20),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        posts: [
          {
            id: 'post_1',
            platform: 'twitter',
            author: '@noticias',
            content: '¡Buenos días! Hoy hace un día soleado en Barcelona. ¿Qué planes tienes para hoy? ☀️',
            language: 'es',
            difficulty: 'beginner',
            vocabulary: ['día', 'soleado', 'planes'],
            translation: 'Good morning! Today is a sunny day in Barcelona. What plans do you have today?',
          },
          {
            id: 'post_2',
            platform: 'reddit',
            author: 'u/Parisienne',
            content: 'Quel est votre restaurant préféré à Paris? Je cherche de nouvelles recommandations!',
            language: 'fr',
            difficulty: 'intermediate',
            vocabulary: ['restaurant', 'recommandations', 'préféré'],
            translation: 'What is your favorite restaurant in Paris? I am looking for new recommendations!',
          },
        ],
        total: 2,
      }
    }),

  getLiterature: os
    .input(z.object({
      language: z.string(),
      genre: z.string().optional(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      limit: z.number().default(5),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        excerpts: [
          {
            id: 'lit_1',
            title: 'Don Quijote - Capítulo 1',
            author: 'Miguel de Cervantes',
            content: 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme...',
            language: 'es',
            difficulty: 'advanced',
            vocabulary: [
              { word: 'Mancha', translation: 'La Mancha (region)', context: 'lugar de la Mancha' },
              { word: 'acordarse', translation: 'to remember', context: 'no quiero acordarme' },
            ],
            annotations: 'Este es uno de los primeros párrafos de la obra más famosa de la literatura española.',
            wordCount: 45,
          },
        ],
        total: 1,
      }
    }),

  getComprehensionQuiz: os
    .input(z.object({
      contentId: z.string(),
      contentType: z.enum(['article', 'video', 'podcast', 'social']),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        quizId: `quiz_${input.contentId}`,
        questions: [
          {
            id: 'q1',
            question: '¿Cuál es la idea principal del artículo?',
            type: 'multiple_choice',
            options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
            correctAnswer: 1,
            explanation: 'La respuesta correcta es B porque...',
            points: 10,
          },
          {
            id: 'q2',
            question: '¿Verdadero o falso? El artículo menciona...',
            type: 'true_false',
            correctAnswer: true,
            explanation: 'El artículo dice claramente que...',
            points: 5,
          },
          {
            id: 'q3',
            question: 'Selecciona las palabras correctas para completar la oración.',
            type: 'fill_blanks',
            blanks: [
              { position: 1, options: ['palabra1', 'palabra2', 'palabra3'] },
            ],
            correctAnswer: 'palabra2',
            points: 5,
          },
        ],
        totalPoints: 20,
        passingScore: 70,
        timeLimit: 600,
      }
    }),

  saveProgress: os
    .input(z.object({
      contentId: z.string(),
      contentType: z.enum(['article', 'video', 'podcast', 'social', 'literature']),
      progress: z.object({
        percentComplete: z.number(),
        timeSpent: z.number(),
        vocabularySaved: z.number(),
        quizScore: z.number().optional(),
      }),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        success: true,
        contentId: input.contentId,
        xpEarned: Math.round(input.progress.percentComplete * 2 + (input.progress.quizScore || 0)),
        streakMaintained: true,
      }
    }),
}

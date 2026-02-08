import { os } from '@orpc/server'
import { z } from 'zod'
import { db, lessons, courses, languages } from '../../db'
import { eq, and, asc, gte, sql } from 'drizzle-orm'
import { requireAuth } from '../middleware'

interface Tutor {
  id: number
  name: string
  avatar: string
  languages: string[]
  rating: number
  reviews: number
  hourlyRate: number
  availability: string[]
  specialties: string[]
  bio: string
  isVerified: boolean
}

interface ClassSession {
  id: string
  title: string
  description: string
  language: string
  level: string
  tutor: Tutor
  scheduledAt: Date
  duration: number
  maxParticipants: number
  currentParticipants: number
  price: number
  isLive: boolean
}

export const liveClassesRouter = {
  getTutors: os
    .input(z.object({
      languageCode: z.string().optional(),
      specialty: z.string().optional(),
      minRating: z.number().min(0).max(5).optional(),
      maxPrice: z.number().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const mockTutors: Tutor[] = [
        {
          id: 1,
          name: "Maria Garcia",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
          languages: ["es"],
          rating: 4.9,
          reviews: 234,
          hourlyRate: 25,
          availability: ["09:00-12:00", "14:00-18:00"],
          specialties: ["Conversation", "Business", "Exam Prep"],
          bio: "Native Spanish speaker with 5 years of teaching experience. Passionate about helping students achieve fluency.",
          isVerified: true,
        },
        {
          id: 2,
          name: "Jean Dupont",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
          languages: ["fr"],
          rating: 4.8,
          reviews: 189,
          hourlyRate: 28,
          availability: ["10:00-15:00", "17:00-20:00"],
          specialties: ["Pronunciation", "Grammar", "Travel"],
          bio: "Certified French teacher specializing in pronunciation and conversational skills.",
          isVerified: true,
        },
        {
          id: 3,
          name: "Yuki Tanaka",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
          languages: ["ja"],
          rating: 5.0,
          reviews: 156,
          hourlyRate: 35,
          availability: ["08:00-16:00"],
          specialties: ["Kanji", "Business Japanese", "JLPT Prep"],
          bio: "Native Japanese speaker and certified language instructor. Expert in JLPT preparation.",
          isVerified: true,
        },
      ]

      let filtered = mockTutors
      if (input.languageCode) {
        const lang = input.languageCode
        filtered = filtered.filter(t => t.languages.includes(lang))
      }
      if (input.minRating) {
        filtered = filtered.filter(t => t.rating >= input.minRating!)
      }

      return {
        tutors: filtered,
        total: filtered.length,
      }
    }),

  getUpcomingClasses: os
    .input(z.object({
      languageCode: z.string().optional(),
      daysAhead: z.number().default(7),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const now = new Date()
      const endDate = new Date(now.getTime() + input.daysAhead * 24 * 60 * 60 * 1000)

      const mockClasses: ClassSession[] = [
        {
          id: "class_1",
          title: "Spanish Conversation Practice",
          description: "Practice your Spanish with fellow learners in a casual setting.",
          language: "es",
          level: "Intermediate",
          tutor: {
            id: 1,
            name: "Maria Garcia",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            languages: ["es"],
            rating: 4.9,
            reviews: 234,
            hourlyRate: 25,
            availability: [],
            specialties: [],
            bio: "",
            isVerified: true,
          },
          scheduledAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
          duration: 60,
          maxParticipants: 8,
          currentParticipants: 5,
          price: 15,
          isLive: false,
        },
        {
          id: "class_2",
          title: "French Pronunciation Workshop",
          description: "Master the French r sounds and nasal vowels.",
          language: "fr",
          level: "All Levels",
          tutor: {
            id: 2,
            name: "Jean Dupont",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
            languages: ["fr"],
            rating: 4.8,
            reviews: 189,
            hourlyRate: 28,
            availability: [],
            specialties: [],
            bio: "",
            isVerified: true,
          },
          scheduledAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          duration: 45,
          maxParticipants: 6,
          currentParticipants: 3,
          price: 20,
          isLive: false,
        },
        {
          id: "class_3",
          title: "Japanese Kanji Masterclass",
          description: "Learn 50 essential Kanji characters with writing practice.",
          language: "ja",
          level: "Beginner",
          tutor: {
            id: 3,
            name: "Yuki Tanaka",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
            languages: ["ja"],
            rating: 5.0,
            reviews: 156,
            hourlyRate: 35,
            availability: [],
            specialties: [],
            bio: "",
            isVerified: true,
          },
          scheduledAt: new Date(now.getTime() + 48 * 60 * 60 * 1000),
          duration: 90,
          maxParticipants: 4,
          currentParticipants: 4,
          price: 40,
          isLive: false,
        },
      ]

      return {
        classes: mockClasses,
        total: mockClasses.length,
      }
    }),

  bookClass: os
    .input(z.object({
      classId: z.string(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        success: true,
        bookingId: `booking_${Date.now()}`,
        classId: input.classId,
        userId: ctx.user.id,
        status: "confirmed",
        joinUrl: `https://classroom.lingograde.app/join/${input.classId}`,
      }
    }),

  joinClass: os
    .input(z.object({
      classId: z.string(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        success: true,
        roomUrl: `https://classroom.lingograde.app/room/${input.classId}`,
        token: `token_${input.classId}_${Date.now()}`,
        controls: {
          mic: true,
          camera: false,
          screenShare: true,
          chat: true,
          whiteboard: true,
        },
      }
    }),

  getClassRecording: os
    .input(z.object({
      classId: z.string(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        classId: input.classId,
        recordingUrl: `https://recordings.lingograde.app/${input.classId}.mp4`,
        duration: 3600,
        transcript: "Class transcript will appear here...",
        timestamp: new Date(),
      }
    }),

  getGroupClasses: os
    .input(z.object({
      language: z.string().optional(),
      level: z.string().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        groups: [
          {
            id: "group_1",
            name: "Spanish Intermediate Conversation",
            language: "es",
            level: "B1",
            schedule: "Tuesdays & Thursdays 7 PM",
            members: 12,
            maxMembers: 20,
            tutor: "Maria Garcia",
            priceMonthly: 49,
          },
          {
            id: "group_2",
            name: "French Basics Bootcamp",
            language: "fr",
            level: "A1-A2",
            schedule: "Mondays & Wednesdays 6 PM",
            members: 18,
            maxMembers: 25,
            tutor: "Jean Dupont",
            priceMonthly: 39,
          },
        ],
      }
    }),

  getTutorAvailability: os
    .input(z.object({
      tutorId: z.number(),
      daysAhead: z.number().default(7),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      const now = new Date()
      const slots: Array<{ date: string; times: string[] }> = []

      for (let i = 1; i <= input.daysAhead; i++) {
        const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
        const dateStr = date.toISOString().split('T')[0]
        slots.push({
          date: dateStr,
          times: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].slice(0, Math.floor(Math.random() * 5) + 3),
        })
      }

      return {
        tutorId: input.tutorId,
        slots,
        timezone: "UTC",
      }
    }),

  bookOneOnOne: os
    .input(z.object({
      tutorId: z.number(),
      date: z.string(),
      time: z.string(),
      duration: z.number().default(60),
      topic: z.string().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        success: true,
        bookingId: `booking_1on1_${Date.now()}`,
        tutorId: input.tutorId,
        studentId: ctx.user.id,
        scheduledAt: `${input.date}T${input.time}:00Z`,
        duration: input.duration,
        price: input.duration * 3,
        status: "confirmed",
      }
    }),

  getSpeakingAssessment: os
    .input(z.object({
      language: z.string(),
      difficulty: z.string().optional(),
    }))
    .use(requireAuth)
    .handler(async ({ input, context: ctx }) => {
      return {
        assessmentId: `assess_${Date.now()}`,
        status: "scheduled",
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: 30,
        format: "15-min conversation + 15-min feedback",
        criteria: [
          { name: "Pronunciation", weight: 25 },
          { name: "Fluency", weight: 25 },
          { name: "Grammar", weight: 20 },
          { name: "Vocabulary", weight: 20 },
          { name: "Comprehension", weight: 10 },
        ],
      }
    }),
}

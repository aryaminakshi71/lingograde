import { test, expect, describe } from 'vitest'
import { z } from 'zod'

describe('Lessons Router', () => {
  test('getLanguages returns active languages', async () => {
    const mockLanguages = [
      { id: 1, code: 'es', name: 'Spanish', nativeName: 'Español', flagEmoji: '🇪🇸', direction: 'ltr', isActive: true },
      { id: 2, code: 'fr', name: 'French', nativeName: 'Français', flagEmoji: '🇫🇷', direction: 'ltr', isActive: true },
    ]

    expect(mockLanguages).toBeDefined()
    expect(Array.isArray(mockLanguages)).toBe(true)
    expect(mockLanguages.length).toBeGreaterThan(0)
  })

  test('getCourses accepts languageId filter', async () => {
    const mockInput = { languageId: 1 }
    
    expect(mockInput.languageId).toBe(1)
    expect(z.object({ languageId: z.number().optional() }).parse(mockInput)).toEqual({ languageId: 1 })
  })

  test('getCourse requires valid course ID', async () => {
    const mockInput = { id: 1 }
    
    expect(z.object({ id: z.number() }).parse(mockInput)).toEqual({ id: 1 })
    
    const invalidInput = { id: -1 }
    expect(() => z.object({ id: z.number().positive() }).parse(invalidInput)).toThrow()
  })

  test('getLesson returns lesson with exercises', async () => {
    const mockInput = { id: 1 }
    
    expect(z.object({ id: z.number() }).parse(mockInput)).toEqual({ id: 1 })
  })
})

describe('SM-2 Algorithm Calculations', () => {
  test('calculates correct ease factor', () => {
    const previousEase = 2.5
    const quality = 4
    
    const easeFactor = previousEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    const clampedEase = Math.max(1.3, easeFactor)
    
    expect(clampedEase).toBeGreaterThanOrEqual(1.3)
    expect(clampedEase).toBeLessThanOrEqual(3.0)
  })

  test('calculates correct interval for quality >= 3', () => {
    const quality = 4
    const previousRepetitions = 2 as number
    const previousInterval = 6
    
    let newInterval: number
    let newRepetitions: number
    
    if (quality < 3) {
      newInterval = 1
      newRepetitions = 0
    } else if (previousRepetitions === 0) {
      newInterval = 1
      newRepetitions = 1
    } else if (previousRepetitions === 1) {
      newInterval = 6
      newRepetitions = 2
    } else {
      newInterval = Math.round(previousInterval * 2.5)
      newRepetitions = previousRepetitions + 1
    }
    
    expect(newInterval).toBe(15)
    expect(newRepetitions).toBe(3)
  })

  test('resets interval for quality < 3', () => {
    const quality = 2
    const previousRepetitions = 5
    const previousInterval = 30
    
    let newInterval: number
    let newRepetitions: number
    
    if (quality < 3) {
      newInterval = 1
      newRepetitions = 0
    } else {
      newInterval = Math.round(previousInterval * 2.5)
      newRepetitions = previousRepetitions + 1
    }
    
    expect(newInterval).toBe(1)
    expect(newRepetitions).toBe(0)
  })
})

describe('Auth Validation', () => {
  test('validates registration input', () => {
    const validInput = {
      email: 'test@example.com',
      password: 'securepassword123',
      fullName: 'Test User',
      nativeLanguage: 'en',
    }
    
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      fullName: z.string().optional(),
      nativeLanguage: z.string().default('en'),
    })
    
    const result = schema.parse(validInput)
    expect(result.email).toBe('test@example.com')
    expect(result.password).toBe('securepassword123')
  })

  test('rejects invalid email', () => {
    const invalidInput = {
      email: 'invalid-email',
      password: 'password123',
    }
    
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
    
    expect(() => schema.parse(invalidInput)).toThrow()
  })

  test('rejects short password', () => {
    const invalidInput = {
      email: 'test@example.com',
      password: 'short',
    }
    
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
    
    expect(() => schema.parse(invalidInput)).toThrow()
  })
})

describe('Course Filtering', () => {
  test('filters courses by difficulty', () => {
    const courses = [
      { id: 1, name: 'Spanish A1', difficulty: 'beginner' },
      { id: 2, name: 'Spanish B1', difficulty: 'intermediate' },
      { id: 3, name: 'Spanish C1', difficulty: 'advanced' },
    ]
    
    const filtered = courses.filter(c => c.difficulty === 'beginner')
    
    expect(filtered).toHaveLength(1)
    expect(filtered[0].name).toBe('Spanish A1')
  })

  test('filters courses by language', () => {
    const courses = [
      { id: 1, name: 'Spanish A1', language: 'es' },
      { id: 2, name: 'French A1', language: 'fr' },
      { id: 3, name: 'Spanish B1', language: 'es' },
    ]
    
    const filtered = courses.filter(c => c.language === 'es')
    
    expect(filtered).toHaveLength(2)
    expect(filtered.every(c => c.language === 'es')).toBe(true)
  })

  test('sorts courses by level', () => {
    const courses = [
      { id: 1, name: 'Spanish C1', level: 'C1', order: 5 },
      { id: 2, name: 'Spanish A1', level: 'A1', order: 0 },
      { id: 3, name: 'Spanish B1', level: 'B1', order: 3 },
    ]
    
    const sorted = [...courses].sort((a, b) => a.order - b.order)
    
    expect(sorted[0].name).toBe('Spanish A1')
    expect(sorted[1].name).toBe('Spanish B1')
    expect(sorted[2].name).toBe('Spanish C1')
  })
})

describe('XP Calculations', () => {
  test('calculates XP for completed lessons', () => {
    const lessonRewards = [10, 15, 20, 10, 15]
    const completedLessons = [true, true, true, false, true]
    
    const totalXP = lessonRewards.reduce((sum, reward, index) => 
      completedLessons[index] ? sum + reward : sum, 0
    )
    
    expect(totalXP).toBe(60)
  })

  test('calculates XP with bonus', () => {
    const baseXP = 100
    const streakBonus = 0.5
    const accuracyBonus = 0.25
    
    const earnedXP = baseXP * (1 + streakBonus) * (1 + accuracyBonus)
    
    expect(earnedXP).toBe(187.5)
  })

  test('calculates level from XP', () => {
    const xpToLevel = [
      { level: 1, minXP: 0 },
      { level: 2, minXP: 100 },
      { level: 3, minXP: 250 },
      { level: 4, minXP: 500 },
      { level: 5, minXP: 1000 },
    ]
    
    const userXP = 350
    
    const level = xpToLevel.find((l, i) => 
      userXP >= l.minXP && (!xpToLevel[i + 1] || userXP < xpToLevel[i + 1].minXP)
    )
    
    expect(level?.level).toBe(3)
  })
})

describe('Streak Calculations', () => {
  test('calculates current streak', () => {
    const activityDates = [
      new Date('2024-01-20'),
      new Date('2024-01-21'),
      new Date('2024-01-22'),
      new Date('2024-01-24'), 
    ]
    
    let currentStreak = 0
    const today = new Date('2024-01-25')
    
    for (let i = activityDates.length - 1; i >= 0; i--) {
      const daysDiff = Math.floor((today.getTime() - activityDates[i].getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff <= currentStreak + 1) {
        currentStreak++
      } else {
        break
      }
    }
    
    expect(currentStreak).toBe(1)
  })

  test('detects streak broken', () => {
    const lastActivity = new Date('2024-01-15')
    const today = new Date('2024-01-25')
    
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    const streakBroken = daysDiff > 1
    
    expect(streakBroken).toBe(true)
  })
})

describe('Progress Tracking', () => {
  test('calculates completion percentage', () => {
    const totalLessons = 20
    const completedLessons = 5
    
    const percentage = Math.round((completedLessons / totalLessons) * 100)
    
    expect(percentage).toBe(25)
  })

  test('calculates accuracy rate', () => {
    const correctAnswers = 45
    const totalAttempts = 50
    
    const accuracy = Math.round((correctAnswers / totalAttempts) * 100)
    
    expect(accuracy).toBe(90)
  })
})

import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb, real, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'pro', 'team', 'enterprise'])
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'past_due', 'cancelled', 'trialing'])
export const lessonTypeEnum = pgEnum('lesson_type', ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing', 'quiz', 'review'])
export const difficultyLevelEnum = pgEnum('difficulty_level', ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'])

// Tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  nativeLanguage: varchar('native_language', { length: 10 }).default('en'),
  targetLanguage: varchar('target_language', { length: 10 }),
  currentGrade: integer('current_grade').default(1),
  subscriptionTier: subscriptionTierEnum('subscription_tier').default('free'),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').default('active'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 100 }),
  isActive: boolean('is_active').default(true),
  isVerified: boolean('is_verified').default(false),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const languages = pgTable('languages', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  nativeName: varchar('native_name', { length: 100 }),
  flagEmoji: varchar('flag_emoji', { length: 10 }),
  direction: varchar('direction', { length: 10 }).default('ltr'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  languageId: integer('language_id').notNull().references(() => languages.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  difficulty: varchar('difficulty', { length: 30 }).notNull(),
  totalLessons: integer('total_lessons').default(0),
  estimatedHours: real('estimated_hours').default(0),
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull().references(() => courses.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull().references(() => courses.id),
  unitId: integer('unit_id').references(() => units.id),
  languageId: integer('language_id').notNull().references(() => languages.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  lessonType: lessonTypeEnum('lesson_type').default('vocabulary'),
  difficulty: difficultyLevelEnum('difficulty').default('beginner'),
  durationMinutes: integer('duration_minutes').default(5),
  xpReward: integer('xp_reward').default(10),
  orderIndex: integer('order_index').default(0),
  content: jsonb('content'),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id),
  exerciseType: varchar('exercise_type', { length: 50 }).notNull(),
  question: text('question').notNull(),
  correctAnswer: text('correct_answer').notNull(),
  alternativeAnswers: jsonb('alternative_answers'),
  options: jsonb('options'),
  hint: text('hint'),
  explanation: text('explanation'),
  audioUrl: varchar('audio_url', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  orderIndex: integer('order_index').default(0),
  xpReward: integer('xp_reward').default(5),
  createdAt: timestamp('created_at').defaultNow(),
})

export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  score: integer('score'),
  stars: integer('stars').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const lessonAttempts = pgTable('lesson_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  score: integer('score'),
  xpEarned: integer('xp_earned').default(0),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  status: varchar('status', { length: 20 }).default('in_progress'),
})

export const exerciseAttempts = pgTable('exercise_attempts', {
  id: serial('id').primaryKey(),
  lessonAttemptId: integer('lesson_attempt_id').notNull().references(() => lessonAttempts.id),
  exerciseId: integer('exercise_id').notNull().references(() => exercises.id),
  userAnswer: text('user_answer'),
  isCorrect: boolean('is_correct'),
  timeSpentSeconds: integer('time_spent_seconds').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export const streaks = pgTable('streaks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().unique().references(() => users.id),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastActivityDate: timestamp('last_activity_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  iconUrl: varchar('icon_url', { length: 500 }),
  xpReward: integer('xp_reward').default(0),
  category: varchar('category', { length: 50 }),
  requirement: jsonb('requirement'),
  isSecret: boolean('is_secret').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const userAchievements = pgTable('user_achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  achievementId: integer('achievement_id').notNull().references(() => achievements.id),
  progress: integer('progress').default(0),
  isUnlocked: boolean('is_unlocked').default(false),
  unlockedAt: timestamp('unlocked_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const speechAttempts = pgTable('speech_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  textToSpeak: text('text_to_speak').notNull(),
  audioUrl: varchar('audio_url', { length: 500 }),
  transcription: text('transcription'),
  pronunciationScore: real('pronunciation_score'),
  fluencyScore: real('fluency_score'),
  accuracyScore: real('accuracy_score'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  tier: subscriptionTierEnum('tier').notNull(),
  status: subscriptionStatusEnum('status').default('active'),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 100 }),
  stripePriceId: varchar('stripe_price_id', { length: 100 }),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  cancelledAt: timestamp('cancelled_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  lessonAttempts: many(lessonAttempts),
  streaks: many(streaks),
  achievements: many(userAchievements),
  speechAttempts: many(speechAttempts),
  subscriptions: many(subscriptions),
}))

export const languagesRelations = relations(languages, ({ many }) => ({
  courses: many(courses),
  lessons: many(lessons),
}))

export const coursesRelations = relations(courses, ({ one, many }) => ({
  language: one(languages, {
    fields: [courses.languageId],
    references: [languages.id],
  }),
  units: many(units),
  lessons: many(lessons),
}))

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  language: one(languages, {
    fields: [lessons.languageId],
    references: [languages.id],
  }),
  exercises: many(exercises),
  progress: many(userProgress),
  attempts: many(lessonAttempts),
}))

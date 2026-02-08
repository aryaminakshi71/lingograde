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

export const accessibilitySettings = pgTable('accessibility_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().unique().references(() => users.id),
  dyslexiaFont: boolean('dyslexia_font').default(false),
  fontSize: varchar('font_size', { length: 20 }).default('medium'),
  highContrast: boolean('high_contrast').default(false),
  reduceMotion: boolean('reduce_motion').default(false),
  colorBlindMode: varchar('color_blind_mode', { length: 30 }).default('none'),
  adhdMode: boolean('adhd_mode').default(false),
  cognitiveLoadIndicators: boolean('cognitive_load_indicators').default(true),
  screenReaderOptimized: boolean('screen_reader_optimized').default(false),
  keyboardNavigation: boolean('keyboard_navigation').default(true),
  spokenFeedback: boolean('spoken_feedback').default(false),
  lessonChunkSize: varchar('lesson_chunk_size', { length: 20 }).default('normal'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  courseId: integer('course_id').references(() => courses.id),
  title: varchar('title', { length: 255 }).notNull(),
  level: varchar('level', { length: 20 }).notNull(),
  languageCode: varchar('language_code', { length: 10 }).notNull(),
  score: integer('score').notNull(),
  xpEarned: integer('xp_earned').default(0),
  verificationCode: varchar('verification_code', { length: 100 }).unique(),
  shareUrl: varchar('share_url', { length: 500 }),
  issuedAt: timestamp('issued_at').defaultNow(),
  status: varchar('status', { length: 20 }).default('active'),
})

export const dailyQuests = pgTable('daily_quests', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  questType: varchar('quest_type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  targetValue: integer('target_value').notNull(),
  currentValue: integer('current_value').default(0),
  xpReward: integer('xp_reward').default(0),
  status: varchar('status', { length: 20 }).default('active'),
  expiresAt: timestamp('expires_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const weeklyQuests = pgTable('weekly_quests', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  questType: varchar('quest_type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  targetValue: integer('target_value').notNull(),
  currentValue: integer('current_value').default(0),
  xpReward: integer('xp_reward').default(0),
  status: varchar('status', { length: 20 }).default('active'),
  weekStartDate: timestamp('week_start_date'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const leaderboardEntries = pgTable('leaderboard_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  periodType: varchar('period_type', { length: 20 }).notNull(),
  periodStart: timestamp('period_start').notNull(),
  totalXP: integer('total_xp').default(0),
  lessonsCompleted: integer('lessons_completed').default(0),
  streakDays: integer('streak_days').default(0),
  rank: integer('rank'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const studyGroups = pgTable('study_groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  languageCode: varchar('language_code', { length: 10 }).notNull(),
  targetLanguageCode: varchar('target_language_code', { length: 10 }),
  maxMembers: integer('max_members').default(10),
  currentMembers: integer('current_members').default(1),
  isPublic: boolean('is_public').default(true),
  creatorId: integer('creator_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
})

export const studyGroupMembers = pgTable('study_group_members', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').notNull().references(() => studyGroups.id),
  userId: integer('user_id').notNull().references(() => users.id),
  role: varchar('role', { length: 20 }).default('member'),
  joinedAt: timestamp('joined_at').defaultNow(),
})

export const languageExchange = pgTable('language_exchange', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  nativeLanguage: varchar('native_language', { length: 10 }).notNull(),
  targetLanguage: varchar('target_language', { length: 10 }).notNull(),
  proficiencyLevel: varchar('proficiency_level', { length: 20 }).default('beginner'),
  bio: text('bio'),
  interests: jsonb('interests'),
  isActive: boolean('is_active').default(true),
  lastActive: timestamp('last_active').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const liveClassBookings = pgTable('live_class_bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  tutorId: varchar('tutor_id', { length: 100 }),
  classType: varchar('class_type', { length: 50 }).notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').default(60),
  status: varchar('status', { length: 20 }).default('scheduled'),
  meetingUrl: varchar('meeting_url', { length: 500 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const mobileOfflineContent = pgTable('mobile_offline_content', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  contentType: varchar('content_type', { length: 50 }).notNull(),
  contentId: varchar('content_id', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  languageCode: varchar('language_code', { length: 10 }),
  sizeBytes: integer('size_bytes').default(0),
  downloaded: boolean('downloaded').default(false),
  downloadedAt: timestamp('downloaded_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const pushNotificationSettings = pgTable('push_notification_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().unique().references(() => users.id),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  dailyReminder: boolean('daily_reminder').default(true),
  reminderTime: varchar('reminder_time', { length: 10 }).default('09:00'),
  streakAlerts: boolean('streak_alerts').default(true),
  lessonReminders: boolean('lesson_reminders').default(true),
  weeklyDigest: boolean('weekly_digest').default(true),
  friendActivity: boolean('friend_activity').default(true),
  newContent: boolean('new_content').default(false),
  promotions: boolean('promotions').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  ownerId: integer('owner_id').references(() => users.id),
  memberCount: integer('member_count').default(1),
  subscriptionTier: varchar('subscription_tier', { length: 20 }).default('team'),
  settings: jsonb('settings'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  userId: integer('user_id').notNull().references(() => users.id),
  role: varchar('role', { length: 20 }).default('member'),
  assignedAt: timestamp('assigned_at').defaultNow(),
})

export const teamProgress = pgTable('team_progress', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  userId: integer('user_id').notNull().references(() => users.id),
  courseId: integer('course_id').references(() => courses.id),
  progress: integer('progress').default(0),
  lessonsCompleted: integer('lessons_completed').default(0),
  xpEarned: integer('xp_earned').default(0),
  lastActivity: timestamp('last_activity').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

import { db } from './index'
import { languages, courses, units, lessons, exercises } from './schema'
import { sql, eq } from 'drizzle-orm'

// Language definitions
const languageData = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flagEmoji: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flagEmoji: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flagEmoji: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flagEmoji: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flagEmoji: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flagEmoji: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flagEmoji: '🇨🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flagEmoji: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flagEmoji: '🇸🇦', direction: 'rtl' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flagEmoji: '🇷🇺' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flagEmoji: '🇮🇳' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flagEmoji: '🇳🇱' },
]

// CEFR levels
const cefrLevels = [
  { code: 'A1', name: 'Beginner', difficulty: 'beginner', hours: 60, lessons: 20 },
  { code: 'A2', name: 'Elementary', difficulty: 'elementary', hours: 80, lessons: 25 },
  { code: 'B1', name: 'Intermediate', difficulty: 'intermediate', hours: 100, lessons: 30 },
  { code: 'B2', name: 'Upper Intermediate', difficulty: 'upper_intermediate', hours: 120, lessons: 35 },
  { code: 'C1', name: 'Advanced', difficulty: 'advanced', hours: 140, lessons: 40 },
  { code: 'C2', name: 'Proficient', difficulty: 'proficient', hours: 160, lessons: 45 },
]

// Lesson types with descriptions
const lessonTypes = [
  { type: 'vocabulary', title: 'Vocabulary', description: 'Learn new words and phrases' },
  { type: 'grammar', title: 'Grammar', description: 'Master grammar rules and structures' },
  { type: 'listening', title: 'Listening', description: 'Improve your listening comprehension' },
  { type: 'speaking', title: 'Speaking', description: 'Practice pronunciation and conversation' },
  { type: 'reading', title: 'Reading', description: 'Read and understand texts' },
  { type: 'writing', title: 'Writing', description: 'Write sentences and paragraphs' },
  { type: 'quiz', title: 'Quiz', description: 'Test your knowledge' },
  { type: 'review', title: 'Review', description: 'Review previous lessons' },
]

// Generate course content
function generateCourseContent(level: string, languageName: string) {
  const topics = {
    A1: [
      'Greetings and Introductions',
      'Numbers and Time',
      'Family and Friends',
      'Daily Activities',
      'Food and Drinks',
      'Shopping',
      'Weather',
      'Transportation',
      'Home and Furniture',
      'Colors and Descriptions',
    ],
    A2: [
      'Past Experiences',
      'Future Plans',
      'Hobbies and Interests',
      'Health and Body',
      'Travel and Tourism',
      'Work and Jobs',
      'Education',
      'Entertainment',
      'Technology',
      'Social Situations',
    ],
    B1: [
      'Opinions and Preferences',
      'Problems and Solutions',
      'Culture and Traditions',
      'Environment',
      'Media and News',
      'Relationships',
      'Career Development',
      'Lifestyle Choices',
      'Current Events',
      'Personal Growth',
    ],
    B2: [
      'Abstract Concepts',
      'Debates and Discussions',
      'Professional Communication',
      'Academic Topics',
      'Literary Analysis',
      'Scientific Concepts',
      'Philosophy and Ethics',
      'Art and Culture',
      'Politics and Society',
      'Advanced Grammar',
    ],
    C1: [
      'Complex Arguments',
      'Academic Writing',
      'Professional Presentations',
      'Literary Criticism',
      'Research and Analysis',
      'Advanced Communication',
      'Nuanced Expression',
      'Cultural Competence',
      'Specialized Vocabulary',
      'Idiomatic Expressions',
    ],
    C2: [
      'Native-like Fluency',
      'Advanced Literature',
      'Professional Expertise',
      'Academic Research',
      'Creative Writing',
      'Public Speaking',
      'Translation Skills',
      'Cultural Mastery',
      'Specialized Domains',
      'Linguistic Precision',
    ],
  }

  return topics[level as keyof typeof topics] || topics.A1
}

// Real vocabulary words by language (sample)
const vocabularyWords: Record<string, string[]> = {
  es: ['hola', 'adiós', 'gracias', 'por favor', 'sí', 'no', 'agua', 'comida', 'casa', 'familia', 'trabajo', 'escuela', 'tiempo', 'amigo', 'ciudad'],
  fr: ['bonjour', 'au revoir', 'merci', 's\'il vous plaît', 'oui', 'non', 'eau', 'nourriture', 'maison', 'famille', 'travail', 'école', 'temps', 'ami', 'ville'],
  de: ['hallo', 'auf wiedersehen', 'danke', 'bitte', 'ja', 'nein', 'wasser', 'essen', 'haus', 'familie', 'arbeit', 'schule', 'zeit', 'freund', 'stadt'],
}

// Generate lesson content
function generateLessonContent(lessonType: string, topic: string, level: string, languageName: string, languageCode: string) {
  const baseContent = {
    topic,
    level,
    language: languageName,
    objectives: [],
    materials: [],
  }

  switch (lessonType) {
    case 'vocabulary':
      const words = vocabularyWords[languageCode] || Array.from({ length: 20 }, (_, i) => `word${i + 1}`)
      return {
        ...baseContent,
        objectives: [
          `Learn 20 essential ${level} level ${languageName} vocabulary words`,
          `Master pronunciation of new words`,
          `Use new vocabulary in context`,
        ],
        materials: ['Vocabulary flashcards', 'Audio pronunciation guide', 'Practice exercises', 'Context examples'],
        words: words.slice(0, 20).map((word, i) => ({
          word,
          translation: `Translation of ${word}`,
          example: `Example sentence using ${word}`,
          pronunciation: `/${word}/`,
          partOfSpeech: ['noun', 'verb', 'adjective', 'adverb'][i % 4],
        })),
      }
    case 'grammar':
      return {
        ...baseContent,
        objectives: [`Master grammar rules for ${topic}`],
        materials: ['Grammar guide', 'Practice exercises', 'Examples'],
        rules: [`Rule 1 for ${topic}`, `Rule 2 for ${topic}`, `Rule 3 for ${topic}`],
      }
    case 'listening':
      return {
        ...baseContent,
        objectives: [`Improve listening skills for ${topic}`],
        materials: ['Audio recordings', 'Transcripts', 'Comprehension questions'],
        audioScript: `This is a listening exercise about ${topic} at ${level} level.`,
      }
    case 'speaking':
      return {
        ...baseContent,
        objectives: [`Practice speaking about ${topic}`],
        materials: ['Conversation prompts', 'Pronunciation guide', 'Practice scenarios'],
        scenarios: [`Scenario 1: ${topic}`, `Scenario 2: ${topic}`],
      }
    case 'reading':
      return {
        ...baseContent,
        objectives: [`Read and understand texts about ${topic}`],
        materials: ['Reading passages', 'Comprehension questions', 'Vocabulary notes'],
        passages: [`Reading passage about ${topic}`],
      }
    case 'writing':
      return {
        ...baseContent,
        objectives: [`Write about ${topic}`],
        materials: ['Writing prompts', 'Examples', 'Guidelines'],
        prompts: [`Write about ${topic}`, `Describe ${topic}`],
      }
    case 'quiz':
      return {
        ...baseContent,
        objectives: [`Test knowledge of ${topic}`],
        materials: ['Quiz questions', 'Answer key'],
        questionCount: 10,
      }
    case 'review':
      return {
        ...baseContent,
        objectives: [`Review previous lessons on ${topic}`],
        materials: ['Review materials', 'Practice exercises'],
        reviewTopics: [`Topic 1: ${topic}`, `Topic 2: ${topic}`],
      }
    default:
      return baseContent
  }
}

// Generate exercises for a lesson
function generateExercises(lessonType: string, topic: string, level: string, languageName: string) {
  const exercises = []

  switch (lessonType) {
    case 'vocabulary':
      // Multiple choice
      exercises.push({
        exerciseType: 'multiple_choice',
        question: `What is the ${languageName} word for "hello"?`,
        correctAnswer: 'Correct answer',
        options: ['Option 1', 'Option 2', 'Correct answer', 'Option 4'],
        hint: 'Think about common greetings',
        explanation: 'This is the standard greeting',
        orderIndex: 0,
      })
      // Fill in the blank
      exercises.push({
        exerciseType: 'fill_blank',
        question: `Complete: "Good _____" (morning)`,
        correctAnswer: 'morning',
        alternativeAnswers: ['day', 'evening', 'night'],
        hint: 'Think about time of day',
        explanation: 'Morning is the correct answer',
        orderIndex: 1,
      })
      // Translation
      exercises.push({
        exerciseType: 'translation',
        question: 'Translate: "How are you?"',
        correctAnswer: 'Correct translation',
        hint: 'Common greeting question',
        explanation: 'This is how you ask how someone is doing',
        orderIndex: 2,
      })
      break

    case 'grammar':
      exercises.push({
        exerciseType: 'multiple_choice',
        question: `Choose the correct form: "I _____ to school"`,
        correctAnswer: 'go',
        options: ['go', 'goes', 'going', 'went'],
        hint: 'Present tense, first person',
        explanation: 'First person singular uses "go"',
        orderIndex: 0,
      })
      exercises.push({
        exerciseType: 'sentence_construction',
        question: 'Construct: "I / go / school / to"',
        correctAnswer: 'I go to school',
        hint: 'Subject-verb-object order',
        explanation: 'Standard sentence structure',
        orderIndex: 1,
      })
      break

    case 'listening':
      exercises.push({
        exerciseType: 'listening_comprehension',
        question: 'Listen and answer: What did the speaker say?',
        correctAnswer: 'Speaker said hello',
        options: ['Speaker said hello', 'Speaker said goodbye', 'Speaker said thanks'],
        audioUrl: null, // Would be set in production
        hint: 'Listen carefully',
        explanation: 'The speaker greeted someone',
        orderIndex: 0,
      })
      break

    case 'speaking':
      exercises.push({
        exerciseType: 'pronunciation',
        question: 'Pronounce: "Hello, how are you?"',
        correctAnswer: 'Audio recording required',
        hint: 'Focus on clear pronunciation',
        explanation: 'Practice speaking clearly',
        orderIndex: 0,
      })
      break

    case 'reading':
      exercises.push({
        exerciseType: 'reading_comprehension',
        question: 'What is the main idea of the text?',
        correctAnswer: 'Main idea answer',
        options: ['Main idea answer', 'Wrong answer 1', 'Wrong answer 2'],
        hint: 'Look for the central theme',
        explanation: 'The main idea is...',
        orderIndex: 0,
      })
      break

    case 'writing':
      exercises.push({
        exerciseType: 'essay',
        question: `Write 3 sentences about ${topic}`,
        correctAnswer: 'Sample answer provided',
        hint: 'Use vocabulary from the lesson',
        explanation: 'Check grammar and vocabulary',
        orderIndex: 0,
      })
      break

    case 'quiz':
      for (let i = 0; i < 5; i++) {
        exercises.push({
          exerciseType: 'multiple_choice',
          question: `Quiz question ${i + 1} about ${topic}?`,
          correctAnswer: `Answer ${i + 1}`,
          options: [`Answer ${i + 1}`, 'Wrong 1', 'Wrong 2', 'Wrong 3'],
          hint: 'Review the lesson',
          explanation: `Explanation for question ${i + 1}`,
          orderIndex: i,
        })
      }
      break

    case 'review':
      exercises.push({
        exerciseType: 'mixed',
        question: `Review question about ${topic}`,
        correctAnswer: 'Review answer',
        options: ['Review answer', 'Wrong 1', 'Wrong 2'],
        hint: 'Think about previous lessons',
        explanation: 'This reviews previous content',
        orderIndex: 0,
      })
      break
  }

  return exercises
}

export async function seed() {
  console.log('🌱 Starting database seed...')
  
  // Load environment variables
  try {
    const dotenv = await import('dotenv')
    dotenv.config()
  } catch (e) {
    console.warn('Could not load dotenv, using environment variables directly')
  }
  
  if (!process.env.DATABASE_URL) {
    const error = 'DATABASE_URL environment variable is not set. Please set it in your .env file.'
    console.error('❌', error)
    throw new Error(error)
  }
  
  console.log('✅ DATABASE_URL is set')
  console.log('🔗 Testing database connection...')

  try {
    // Test database connection
    await db.execute(sql`SELECT 1`)
    console.log('✅ Database connection successful')
    // Clear existing data (in reverse order of dependencies)
    console.log('🧹 Clearing existing data...')
    await db.delete(exercises)
    await db.delete(lessons)
    await db.delete(units)
    await db.delete(courses)
    await db.delete(languages)

    // Insert languages
    console.log('📝 Inserting languages...')
    const insertedLanguages = await db
      .insert(languages)
      .values(
        languageData.map(lang => ({
          code: lang.code,
          name: lang.name,
          nativeName: lang.nativeName,
          flagEmoji: lang.flagEmoji,
          direction: lang.direction || 'ltr',
          isActive: true,
        }))
      )
      .returning()

    console.log(`✅ Inserted ${insertedLanguages.length} languages`)

    // For each language, create courses for all CEFR levels
    for (const language of insertedLanguages) {
      console.log(`\n📚 Creating courses for ${language.name}...`)

      for (const level of cefrLevels) {
        // Create course
        const [course] = await db
          .insert(courses)
          .values({
            languageId: language.id,
            name: `${language.name} ${level.code} - ${level.name}`,
            description: `Complete ${level.name} level course in ${language.name}. Master ${level.code} level ${language.name} with ${level.lessons} comprehensive lessons covering vocabulary, grammar, listening, speaking, reading, and writing.`,
            difficulty: level.difficulty,
            totalLessons: level.lessons,
            estimatedHours: level.hours,
            isPublished: true,
            isFeatured: level.code === 'A1', // Feature A1 courses
          })
          .returning()

        console.log(`  ✅ Created course: ${course.name}`)

        // Generate topics for this level
        const topics = generateCourseContent(level.code, language.name)
        const unitsPerCourse = Math.ceil(level.lessons / 5) // ~5 lessons per unit

        // Create units
        const courseUnits = []
        for (let i = 0; i < unitsPerCourse; i++) {
          const topic = topics[i % topics.length]
          const [unit] = await db
            .insert(units)
            .values({
              courseId: course.id,
              name: `Unit ${i + 1}: ${topic}`,
              description: `Learn ${language.name} through ${topic} at ${level.code} level`,
              orderIndex: i,
            })
            .returning()
          courseUnits.push(unit)
        }

        // Create lessons for each unit
        let lessonIndex = 0
        for (const unit of courseUnits) {
          const lessonsPerUnit = Math.ceil(level.lessons / unitsPerCourse)
          
          for (let j = 0; j < lessonsPerUnit && lessonIndex < level.lessons; j++) {
            const lessonType = lessonTypes[lessonIndex % lessonTypes.length]
            const topic = topics[Math.floor(lessonIndex / lessonTypes.length) % topics.length]
            
            const lessonContent = generateLessonContent(
              lessonType.type,
              topic,
              level.code,
              language.name,
              language.code
            )

            const [lesson] = await db
              .insert(lessons)
              .values({
                courseId: course.id,
                unitId: unit.id,
                languageId: language.id,
                title: `${lessonType.title}: ${topic}`,
                description: `${lessonType.description} for ${topic} at ${level.code} level`,
                lessonType: lessonType.type as any,
                difficulty: level.difficulty as any,
                durationMinutes: 10 + (lessonIndex % 5) * 2, // 10-20 minutes
                xpReward: 10 + (lessonIndex % 5) * 2, // 10-20 XP
                orderIndex: lessonIndex,
                content: lessonContent,
                isPublished: true,
              })
              .returning()

            // Create exercises for this lesson
            const exerciseData = generateExercises(lessonType.type, topic, level.code, language.name)
            if (exerciseData.length > 0) {
              await db.insert(exercises).values(
                exerciseData.map(ex => ({
                  lessonId: lesson.id,
                  exerciseType: ex.exerciseType,
                  question: ex.question,
                  correctAnswer: ex.correctAnswer,
                  alternativeAnswers: ex.alternativeAnswers || null,
                  options: ex.options || null,
                  hint: ex.hint || null,
                  explanation: ex.explanation || null,
                  audioUrl: ex.audioUrl || null,
                  imageUrl: null,
                  orderIndex: ex.orderIndex,
                  xpReward: 5,
                }))
              )
            }

            lessonIndex++
          }
        }

        // Update course with actual lesson count
        await db
          .update(courses)
          .set({ totalLessons: lessonIndex })
          .where(eq(courses.id, course.id))

        console.log(`  ✅ Created ${lessonIndex} lessons with exercises`)
      }
    }

    console.log('\n🎉 Database seed completed successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Languages: ${insertedLanguages.length}`)
    console.log(`   - Courses per language: ${cefrLevels.length}`)
    console.log(`   - Total courses: ${insertedLanguages.length * cefrLevels.length}`)
    
    // Count total lessons and exercises
    const totalLessons = await db.select({ count: sql<number>`count(*)` }).from(lessons)
    const totalExercises = await db.select({ count: sql<number>`count(*)` }).from(exercises)
    
    console.log(`   - Total lessons: ${totalLessons[0]?.count || 0}`)
    console.log(`   - Total exercises: ${totalExercises[0]?.count || 0}`)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seed if called directly
seed()
  .then(() => {
    console.log('✅ Seed script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    process.exit(1)
  })

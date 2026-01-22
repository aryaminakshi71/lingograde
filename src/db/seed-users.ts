import { db } from './index'
import { user } from './better-auth-schema'
import { eq } from 'drizzle-orm'
import { auth } from '../server/auth'

// Test users from shared config
const TEST_USERS = [
  {
    email: 'test@company.com',
    password: 'Test@123',
    name: 'Test User',
  },
  {
    email: 'demo@company.com',
    password: 'demo',
    name: 'Demo User',
  },
  {
    email: 'admin@company.com',
    password: 'Admin@123',
    name: 'Admin User',
  },
]

export async function seedUsers() {
  console.log('🌱 Starting user seed...')
  
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
  
  if (!process.env.BETTER_AUTH_SECRET) {
    const error = 'BETTER_AUTH_SECRET environment variable is not set. Please set it in your .env file.'
    console.error('❌', error)
    throw new Error(error)
  }
  
  console.log('✅ Environment variables are set')
  console.log('👤 Creating test users...')

  for (const userData of TEST_USERS) {
    try {
      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, userData.email))
        .limit(1)

      if (existingUser) {
        console.log(`  ⏭️  User ${userData.email} already exists, skipping...`)
        continue
      }

      // Create user using Better Auth's signUp
      const result = await auth.signUp.email({
        email: userData.email,
        password: userData.password,
        name: userData.name,
      })

      if (result.data) {
        console.log(`  ✅ Created user: ${userData.email}`)
      } else {
        const errorMsg = result.error?.message || 'Unknown error'
        console.error(`  ❌ Failed to create user ${userData.email}:`, errorMsg)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`  ❌ Error creating user ${userData.email}:`, errorMsg)
    }
  }

  console.log('\n🎉 User seed completed!')
  console.log('\n📋 Test Credentials:')
  TEST_USERS.forEach(user => {
    console.log(`   - ${user.email} / ${user.password}`)
  })
}

// Run seed if called directly
seedUsers()
  .then(() => {
    console.log('✅ User seed script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ User seed script failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    process.exit(1)
  })

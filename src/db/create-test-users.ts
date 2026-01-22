/**
 * Simple script to create test users via the register RPC endpoint
 * Run this with: bun run db:create-test-users
 * 
 * Make sure your dev server is running first!
 */

import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { AppRouter } from '../server/rpc'

const TEST_USERS = [
  {
    email: 'test@company.com',
    password: 'Test@123',
    fullName: 'Test User',
  },
  {
    email: 'demo@company.com',
    password: 'demo',
    fullName: 'Demo User',
  },
  {
    email: 'admin@company.com',
    password: 'Admin@123',
    fullName: 'Admin User',
  },
]

async function createTestUsers() {
  console.log('🌱 Creating test users via API...')
  console.log('⚠️  Make sure your dev server is running on http://localhost:3019\n')

  const baseURL = process.env.VITE_RPC_URL || 'http://localhost:3019/api/rpc'
  
  const link = new RPCLink({
    url: baseURL,
    fetch: fetch,
  })
  
  const client = createORPCClient<AppRouter>(link)

  for (const userData of TEST_USERS) {
    try {
      const result = await client.auth.register.mutate({
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
      })

      if (result) {
        console.log(`  ✅ Created user: ${userData.email}`)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      if (errorMsg.includes('already exists') || errorMsg.includes('duplicate') || errorMsg.includes('unique')) {
        console.log(`  ⏭️  User ${userData.email} already exists, skipping...`)
      } else {
        console.error(`  ❌ Failed to create user ${userData.email}:`, errorMsg)
      }
    }
  }

  console.log('\n🎉 Done!')
  console.log('\n📋 Test Credentials:')
  TEST_USERS.forEach(user => {
    console.log(`   - ${user.email} / ${user.password}`)
  })
}

createTestUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

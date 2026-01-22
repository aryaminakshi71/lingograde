import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzleNode } from 'drizzle-orm/postgres-js'
import { neon } from '@neondatabase/serverless'
import postgres from 'postgres'
import * as schema from './schema'
import * as betterAuthSchema from './better-auth-schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const combinedSchema = {
  ...schema,
  ...betterAuthSchema,
}

// Check if using local postgres or Neon
const isLocalPostgres = process.env.DATABASE_URL.includes('localhost') ||
                        process.env.DATABASE_URL.includes('127.0.0.1')

// Create the appropriate database connection
export const db = isLocalPostgres
  ? drizzleNode(postgres(process.env.DATABASE_URL), { schema: combinedSchema })
  : drizzleNeon(neon(process.env.DATABASE_URL), { schema: combinedSchema })

export * from './schema'
export * from './better-auth-schema'

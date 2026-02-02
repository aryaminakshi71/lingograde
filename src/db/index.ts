import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzleNode } from 'drizzle-orm/postgres-js'
import { neon } from '@neondatabase/serverless'
import postgres from 'postgres'
import * as schema from './schema'
import * as betterAuthSchema from './better-auth-schema'

const combinedSchema = {
  ...schema,
  ...betterAuthSchema,
}

/**
 * Get database connection
 * Supports Hyperdrive (Cloudflare Workers) or direct PostgreSQL/Neon connection
 */
export function getDb(env?: { DATABASE?: { connectionString: string }; DATABASE_URL?: string }) {
  // Check for Hyperdrive connection string from Cloudflare env first
  const connectionString =
    env?.DATABASE?.connectionString ||
    env?.DATABASE_URL ||
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL or DATABASE.connectionString (Hyperdrive) is not set')
  }

  // Check if using local postgres or Neon
  const isLocalPostgres = connectionString.includes('localhost') ||
                          connectionString.includes('127.0.0.1')

  // Create the appropriate database connection
  if (isLocalPostgres) {
    return drizzleNode(postgres(connectionString), { schema: combinedSchema })
  } else {
    // Production/Cloudflare: Use Neon Serverless (works with Hyperdrive connection strings)
    return drizzleNeon(neon(connectionString), { schema: combinedSchema })
  }
}

// Default export for backward compatibility
// In Cloudflare Workers, use getDb(env) instead
export const db = (() => {
  if (process.env.DATABASE_URL) {
    const isLocalPostgres = process.env.DATABASE_URL.includes('localhost') ||
                            process.env.DATABASE_URL.includes('127.0.0.1')
    return isLocalPostgres
      ? drizzleNode(postgres(process.env.DATABASE_URL), { schema: combinedSchema })
      : drizzleNeon(neon(process.env.DATABASE_URL), { schema: combinedSchema })
  }
  // Return a dummy db that will throw on use - this is OK for module-level imports
  // Actual usage should use getDb(env) in Cloudflare Workers
  return drizzleNode(postgres('postgresql://placeholder'), { schema: combinedSchema }) as any
})()

export * from './schema'
export * from './better-auth-schema'

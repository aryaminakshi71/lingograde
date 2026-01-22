import { db, users } from '../db'
import { eq } from 'drizzle-orm'

/**
 * Get the application user record from Better Auth user
 * Better Auth uses string IDs, our app uses integer IDs
 * We link them via email
 */
export async function getAppUser(betterAuthUserId: string, betterAuthEmail: string) {
  // Find user by email (Better Auth email should match our users.email)
  const [appUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, betterAuthEmail))
    .limit(1)
  
  // If user doesn't exist in our app users table, create it
  if (!appUser) {
    const [newUser] = await db
      .insert(users)
      .values({
        email: betterAuthEmail,
        hashedPassword: '', // Better Auth handles password
        isActive: true,
      })
      .returning()
    return newUser
  }
  
  return appUser
}

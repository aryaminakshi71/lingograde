import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Check if Upstash is configured
const isConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
)

if (!isConfigured) {
  console.warn('UPSTASH_REDIS not configured - Rate limiting disabled')
}

// Redis client
export const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

// Rate limiters
export const rateLimiters = {
  // General API rate limit: 100 requests per 60 seconds
  api: isConfigured
    ? new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(100, '60 s'),
        analytics: true,
        prefix: 'ratelimit:api',
      })
    : null,

  // Auth rate limit: 10 attempts per minute
  auth: isConfigured
    ? new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(10, '60 s'),
        analytics: true,
        prefix: 'ratelimit:auth',
      })
    : null,

  // Speech API rate limit: 20 requests per minute (expensive)
  speech: isConfigured
    ? new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(20, '60 s'),
        analytics: true,
        prefix: 'ratelimit:speech',
      })
    : null,

  // Stripe webhook: 100 per minute
  webhook: isConfigured
    ? new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(100, '60 s'),
        analytics: true,
        prefix: 'ratelimit:webhook',
      })
    : null,
}

// Rate limit check helper
export async function checkRateLimit(
  limiter: keyof typeof rateLimiters,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const rl = rateLimiters[limiter]

  if (!rl) {
    // No rate limiting configured, allow all
    return { success: true, limit: 0, remaining: 0, reset: 0 }
  }

  const result = await rl.limit(identifier)

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

// Cache helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null
    return redis.get<T>(key)
  },

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!redis) return
    if (ttlSeconds) {
      await redis.set(key, value, { ex: ttlSeconds })
    } else {
      await redis.set(key, value)
    }
  },

  async delete(key: string): Promise<void> {
    if (!redis) return
    await redis.del(key)
  },

  async exists(key: string): Promise<boolean> {
    if (!redis) return false
    return (await redis.exists(key)) === 1
  },

  async increment(key: string): Promise<number> {
    if (!redis) return 0
    return redis.incr(key)
  },

  async expire(key: string, ttlSeconds: number): Promise<void> {
    if (!redis) return
    await redis.expire(key, ttlSeconds)
  },

  // Hash operations
  async hget<T>(key: string, field: string): Promise<T | null> {
    if (!redis) return null
    return redis.hget<T>(key, field)
  },

  async hset(key: string, field: string, value: unknown): Promise<void> {
    if (!redis) return
    await redis.hset(key, { [field]: value })
  },

  async hgetall<T extends Record<string, unknown>>(key: string): Promise<T | null> {
    if (!redis) return null
    return redis.hgetall<T>(key)
  },

  // List operations for queues
  async lpush(key: string, ...values: unknown[]): Promise<number> {
    if (!redis) return 0
    return redis.lpush(key, ...values)
  },

  async rpop<T>(key: string): Promise<T | null> {
    if (!redis) return null
    return redis.rpop<T>(key)
  },

  // Set operations for tracking unique items
  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!redis) return 0
    return redis.sadd(key, ...members)
  },

  async sismember(key: string, member: string): Promise<boolean> {
    if (!redis) return false
    return (await redis.sismember(key, member)) === 1
  },

  async smembers(key: string): Promise<string[]> {
    if (!redis) return []
    return redis.smembers(key)
  },
}

// Session management
export const sessionStore = {
  async create(userId: string, data: Record<string, unknown>, ttlSeconds = 86400) {
    const sessionId = crypto.randomUUID()
    const key = `session:${sessionId}`
    await cache.set(key, { userId, ...data, createdAt: Date.now() }, ttlSeconds)
    return sessionId
  },

  async get(sessionId: string) {
    return cache.get<{ userId: string; createdAt: number } & Record<string, unknown>>(
      `session:${sessionId}`
    )
  },

  async destroy(sessionId: string) {
    await cache.delete(`session:${sessionId}`)
  },

  async refresh(sessionId: string, ttlSeconds = 86400) {
    await cache.expire(`session:${sessionId}`, ttlSeconds)
  },
}

// User activity tracking
export const activityTracker = {
  async trackLesson(userId: string, lessonId: string) {
    const today = new Date().toISOString().split('T')[0]
    await cache.sadd(`activity:${userId}:${today}`, lessonId)
    await cache.expire(`activity:${userId}:${today}`, 86400 * 7) // Keep 7 days
  },

  async getDailyActivity(userId: string, date?: string) {
    const day = date || new Date().toISOString().split('T')[0]
    return cache.smembers(`activity:${userId}:${day}`)
  },

  async getStreak(userId: string): Promise<number> {
    let streak = 0
    const today = new Date()

    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const activity = await cache.smembers(`activity:${userId}:${dateStr}`)

      if (activity.length > 0) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    return streak
  },
}

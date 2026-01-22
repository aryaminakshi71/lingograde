/**
 * Rate Limiting Utility using Upstash Redis
 * 
 * Centralized rate limiting for all applications in the monorepo.
 * Provides sliding window rate limiting for authentication endpoints
 * and other sensitive operations.
 * 
 * Environment Variables Required:
 * - UPSTASH_REDIS_REST_URL: Upstash Redis REST API URL
 * - UPSTASH_REDIS_REST_TOKEN: Upstash Redis REST API token
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client from environment variables
// Only initialize if both URL and token are provided
// This should only run on the server side
let redis: Redis | null = null;
try {
  // Check if we're in a browser environment (process.env won't exist)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
    }
  }
} catch (error) {
  // Only log in server environment
  if (typeof process !== 'undefined') {
    console.warn('Failed to initialize Redis:', error);
  }
}

// Rate limit configurations for different scenarios
// Only create if Redis is available
export const authRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
  prefix: "auth-rate-limit",
  analytics: true,
  timeout: 1000, // 1 second timeout for rate limit checks
}) : null;

export const strictAuthRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 requests per minute for sensitive auth operations
  prefix: "strict-auth-rate-limit",
  analytics: true,
  timeout: 1000,
}) : null;

export const generalApiRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute for general API
  prefix: "api-rate-limit",
  analytics: true,
  timeout: 1000,
}) : null;

export const sensitiveEndpointRateLimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute for sensitive endpoints
  prefix: "sensitive-rate-limit",
  analytics: true,
  timeout: 1000,
}) : null;

/**
 * Create a custom rate limiter instance
 * 
 * @param maxRequests - Maximum number of requests allowed
 * @param window - Time window (e.g., "1 m", "1 h", "1 d")
 * @param prefix - Unique prefix for rate limit keys
 * @returns Configured Ratelimit instance
 */
export function createRateLimiter(
  maxRequests: number,
  window: string,
  prefix: string
): Ratelimit | null {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, window),
    prefix,
    analytics: true,
    timeout: 1000,
  });
}

/**
 * Rate limit result interface
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Wrapper function for rate limiting with consistent result format
 * 
 * @param ratelimit - Ratelimit instance to use
 * @param identifier - Unique identifier for rate limiting (e.g., IP address, user ID)
 * @returns RateLimitResult with success status and metadata
 */
export async function checkRateLimit(
  ratelimit: Ratelimit | null,
  identifier: string
): Promise<RateLimitResult> {
  // If rate limiting is not configured, allow all requests
  if (!ratelimit) {
    return {
      success: true,
      limit: -1,
      remaining: -1,
      reset: Date.now() + 60000,
    };
  }
  
  try {
    const result = await ratelimit.limit(identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.retryAfter,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open to avoid blocking legitimate traffic on Redis errors
    return {
      success: true,
      limit: -1,
      remaining: -1,
      reset: Date.now() + 60000,
    };
  }
}

/**
 * Extract IP address from request headers
 * Supports common proxy headers for deployments behind load balancers
 * 
 * @param request - Next.js request object
 * @returns IP address string
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP in the chain (client IP)
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

/**
 * Sensitive endpoints that should be rate limited
 */
export const SENSITIVE_ENDPOINTS = ['/login', '/register', '/api/auth/signin'];

/**
 * Check if a pathname matches any sensitive endpoints
 * 
 * @param pathname - The URL pathname to check
 * @returns True if the pathname should be rate limited
 */
export function isSensitiveEndpoint(pathname: string): boolean {
  return SENSITIVE_ENDPOINTS.some(p => pathname.startsWith(p));
}

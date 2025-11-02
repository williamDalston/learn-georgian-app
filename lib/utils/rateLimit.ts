/**
 * Simple in-memory rate limiting
 * TODO: Replace with Redis or similar for production
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60000, maxRequests: 10 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    })

    // Cleanup old entries periodically
    if (rateLimitStore.size > 1000) {
      for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
          rateLimitStore.delete(key)
        }
      }
    }

    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
    }
  }

  if (entry.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}-${userAgent.slice(0, 50)}`
}


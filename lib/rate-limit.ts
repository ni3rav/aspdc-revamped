import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

// Example: Allow 7 requests per minute per user/IP
export const rateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(7, '1 m'),
    analytics: true, // optional, logs to Upstash dashboard
})

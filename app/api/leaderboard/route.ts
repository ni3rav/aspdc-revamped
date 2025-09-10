import { db } from '@/db/drizzle'
import { leaderboard } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { rateLimit } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success, reset, remaining } = await rateLimit.limit(ip)

    if (!success) {
        return new Response('rate limit exceeded, try again later', {
            status: 429,
        })
    }

    try {
        const data = await db
            .select()
            .from(leaderboard)
            .orderBy(desc(leaderboard.rating))
        return Response.json(data)
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

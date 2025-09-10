import { db } from '@/db/drizzle'
import { events } from '@/db/schema'
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
        const rows = await db.select().from(events).orderBy(desc(events.date))
        const data = rows.map((row) => ({
            ...row,
            imageUrls: row.imageUrls ?? [], // ensure []
        }))
        return Response.json(data)
    } catch (error) {
        console.error('Error fetching events:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

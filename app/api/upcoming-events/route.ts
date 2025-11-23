import { db } from '@/db/drizzle'
import { upcomingEvents } from '@/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
    try {
        const data = await db
            .select()
            .from(upcomingEvents)
            .orderBy(asc(upcomingEvents.name))
        return Response.json(data)
    } catch (error) {
        console.error('Error fetching upcoming events:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

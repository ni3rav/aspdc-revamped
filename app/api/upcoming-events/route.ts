import { db } from '@/db/drizzle'
import { upcomingEvents } from '@/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
    const data = await db
        .select()
        .from(upcomingEvents)
        .orderBy(asc(upcomingEvents.name))

    return Response.json(data)
}

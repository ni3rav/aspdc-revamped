import { db } from '@/db/drizzle'
import { events } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
    const rows = await db.select().from(events).orderBy(desc(events.date))
    const data = rows.map((row) => ({
        ...row,
        imageUrls: row.imageUrls ?? [], // ensure []
    }))
    return Response.json(data)
}

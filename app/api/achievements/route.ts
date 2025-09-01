import { db } from '@/db/drizzle'
import { achievements } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
    try {
        const rows = await db
            .select()
            .from(achievements)
            .orderBy(desc(achievements.date))
        const data = rows.map((row) => ({
            ...row,
            date: new Date(row.date),
        }))
        return Response.json(data)
    } catch (error) {
        console.error('Error fetching achievements:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

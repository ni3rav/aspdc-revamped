import { db } from '@/db/drizzle'
import { leaderboard } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
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

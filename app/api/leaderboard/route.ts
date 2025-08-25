import { db } from '@/db/drizzle'
import { leaderboard } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
    const data = await db
        .select()
        .from(leaderboard)
        .orderBy(desc(leaderboard.rating))
    return Response.json(data)
}

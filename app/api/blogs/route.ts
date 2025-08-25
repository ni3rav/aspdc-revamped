import { db } from '@/db/drizzle'
import { blogs } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
    const data = await db.select().from(blogs).orderBy(desc(blogs.publishDate))
    return Response.json(data)
}

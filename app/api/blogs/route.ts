import { db } from '@/db/drizzle'
import { blogs } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
    try {
        const data = await db
            .select()
            .from(blogs)
            .orderBy(desc(blogs.publishDate))
        return Response.json(data)
    } catch (error) {
        console.error('Error fetching blogs:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

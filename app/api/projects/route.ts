import { db } from '@/db/drizzle'
import { projects } from '@/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
    try {
        const data = await db
            .select()
            .from(projects)
            .orderBy(asc(projects.name))
        return Response.json(data)
    } catch (error) {
        console.error('Error fetching projects:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

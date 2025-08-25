import { db } from '@/db/drizzle'
import { projects } from '@/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
    const data = await db.select().from(projects).orderBy(asc(projects.name))
    return Response.json(data)
}

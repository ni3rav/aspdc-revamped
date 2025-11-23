import { db } from '@/db/drizzle'
import {
    achievements,
    blogs,
    events,
    leaderboard,
    projects,
    upcomingEvents,
} from '@/db/schema'
import {
    Achievement,
    Blog,
    Event,
    LeaderboardEntry,
    Project,
    UpcomingEvent,
} from '@/db/types'
import { asc, desc } from 'drizzle-orm'

// ----------------- Achievements -----------------
export async function fetchAchievements(): Promise<Achievement[]> {
    try {
        const rows = await db
            .select()
            .from(achievements)
            .orderBy(desc(achievements.date))
        return rows.map((row) => ({
            ...row,
            date: new Date(row.date),
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching achievements:', error)
        return []
    }
}

// ----------------- Blogs -----------------
export async function fetchBlogs(): Promise<Blog[]> {
    try {
        const rows = await db
            .select()
            .from(blogs)
            .orderBy(desc(blogs.publishDate))
        return rows.map((row) => ({
            ...row,
            publishDate: new Date(row.publishDate),
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching blogs:', error)
        return []
    }
}

// ----------------- Events -----------------
export async function fetchEvents(): Promise<Event[]> {
    try {
        const rows = await db.select().from(events).orderBy(desc(events.date))
        return rows.map((row) => ({
            ...row,
            date: new Date(row.date),
            createdAt: new Date(row.createdAt),
            imageUrls: row.imageUrls ?? [],
        }))
    } catch (error) {
        console.error('Error fetching events:', error)
        return []
    }
}

// ----------------- Leaderboard -----------------
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
        const rows = await db
            .select()
            .from(leaderboard)
            .orderBy(desc(leaderboard.rating))
        return rows.map((row) => ({
            ...row,
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return []
    }
}

// ----------------- Projects -----------------
export async function fetchProjects(): Promise<Project[]> {
    try {
        const rows = await db
            .select()
            .from(projects)
            .orderBy(asc(projects.name))
        return rows.map((row) => ({
            ...row,
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching projects:', error)
        return []
    }
}

// ----------------- Upcoming Events -----------------
export async function fetchUpcomingEvents(): Promise<UpcomingEvent[]> {
    try {
        const rows = await db
            .select()
            .from(upcomingEvents)
            .orderBy(asc(upcomingEvents.name))
        return rows.map((row) => ({
            ...row,
            date: new Date(row.date),
            createdAt: new Date(row.createdAt),
        }))
    } catch (error) {
        console.error('Error fetching upcoming events:', error)
        return []
    }
}

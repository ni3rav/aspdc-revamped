'use server'

import { db } from '@/db'
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
import { desc, asc } from 'drizzle-orm'

// ----------------- Achievements -----------------
export async function fetchAchievements(): Promise<Achievement[]> {
    const rows = await db
        .select()
        .from(achievements)
        .orderBy(desc(achievements.date))
    return rows.map((row) => ({
        ...row,
        date: new Date(row.date), // convert string → Date
    }))
}

// ----------------- Blogs -----------------
export async function fetchBlogs(): Promise<Blog[]> {
    return await db.select().from(blogs).orderBy(desc(blogs.publishDate))
}

// ----------------- Events -----------------
export async function fetchEvents(): Promise<Event[]> {
    const rows = await db.select().from(events).orderBy(desc(events.date))
    return rows.map((row) => ({
        ...row,
        imageUrls: row.imageUrls ?? [], // ensure []
    }))
}

// ----------------- Leaderboard -----------------
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    return await db.select().from(leaderboard).orderBy(desc(leaderboard.rating))
}

// ----------------- Projects -----------------
export async function fetchProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(asc(projects.name))
}

// ----------------- Upcoming Events -----------------
export async function fetchUpcomingEvents(): Promise<UpcomingEvent[]> {
    return await db
        .select()
        .from(upcomingEvents)
        .orderBy(asc(upcomingEvents.name))
}

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
import type {
    Achievement,
    Blog,
    Event,
    LeaderboardEntry,
    NewAchievement,
    NewBlog,
    NewEvent,
    NewLeaderboardEntry,
    NewProject,
    NewUpcomingEvent,
    Project,
    UpcomingEvent,
} from '@/db/types'
import { eq } from 'drizzle-orm'

// ----------------- Insertions -----------------
export async function addProject(project: NewProject) {
    await db.insert(projects).values(project)
}

export async function addAchievement(achievement: NewAchievement) {
    await db.insert(achievements).values({
        ...achievement,
        date: achievement.date.toISOString().split('T')[0], // convert Date → YYYY-MM-DD
    })
}

export async function addBlog(blog: NewBlog) {
    await db.insert(blogs).values(blog)
}

export async function addEvent(event: NewEvent) {
    await db.insert(events).values(event)
}

export async function addLeaderboardEntry(entry: NewLeaderboardEntry) {
    await db.insert(leaderboard).values(entry)
}

export async function addUpcomingEvent(event: NewUpcomingEvent) {
    await db.insert(upcomingEvents).values(event)
}

// ----------------- Updates -----------------
export async function updateProject(id: string, updates: Partial<Project>) {
    return await db
        .update(projects)
        .set(updates)
        .where(eq(projects.id, id))
        .returning()
}

export async function updateAchievement(
    id: string,
    data: Partial<Achievement>
) {
    const adaptedData = {
        ...data,
        date: data.date ? data.date.toISOString().split('T')[0] : undefined,
    }

    await db
        .update(achievements)
        .set(adaptedData)
        .where(eq(achievements.id, id))
}

export async function updateBlog(id: string, updates: Partial<Blog>) {
    return await db
        .update(blogs)
        .set(updates)
        .where(eq(blogs.id, id))
        .returning()
}

export async function updateEvent(id: string, updates: Partial<Event>) {
    return await db
        .update(events)
        .set(updates)
        .where(eq(events.id, id))
        .returning()
}

export async function updateLeaderboardEntry(
    id: string,
    updates: Partial<LeaderboardEntry>
) {
    return await db
        .update(leaderboard)
        .set(updates)
        .where(eq(leaderboard.id, id))
        .returning()
}

export async function updateUpcomingEvent(
    id: string,
    updates: Partial<UpcomingEvent>
) {
    return await db
        .update(upcomingEvents)
        .set(updates)
        .where(eq(upcomingEvents.id, id))
        .returning()
}

// ----------------- Deletions -----------------
export async function deleteProject(id: string) {
    await db.delete(projects).where(eq(projects.id, id))
}

export async function deleteAchievement(id: string) {
    await db.delete(achievements).where(eq(achievements.id, id))
}

export async function deleteBlog(id: string) {
    await db.delete(blogs).where(eq(blogs.id, id))
}

export async function deleteEvent(id: string) {
    await db.delete(events).where(eq(events.id, id))
}

export async function deleteLeaderboardEntry(id: string) {
    await db.delete(leaderboard).where(eq(leaderboard.id, id))
}

export async function deleteUpcomingEvent(id: string) {
    await db.delete(upcomingEvents).where(eq(upcomingEvents.id, id))
}

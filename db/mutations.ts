'use server'

import { db } from '@/db/drizzle'
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
    try {
        await db.insert(projects).values(project)
    } catch (error) {
        console.error('Error in addProject:', error)
        throw error
    }
}

export async function addAchievement(achievement: NewAchievement) {
    try {
        await db.insert(achievements).values({
            ...achievement,
            date: achievement.date.toISOString().split('T')[0], // convert Date → YYYY-MM-DD
        })
    } catch (error) {
        console.error('Error in addAchievement:', error)
        throw error
    }
}

export async function addBlog(blog: NewBlog) {
    try {
        await db.insert(blogs).values({
            ...blog,
            publishDate:
                blog.publishDate instanceof Date
                    ? blog.publishDate
                    : new Date(blog.publishDate),
        })
    } catch (error) {
        console.error('Error in addBlog:', error)
        throw error
    }
}

export async function addEvent(event: NewEvent) {
    try {
        await db.insert(events).values({
            ...event,
            date:
                event.date instanceof Date ? event.date : new Date(event.date),
            imageUrls: event.imageUrls ?? [],
        })
    } catch (error) {
        console.error('Error in addEvent:', error)
        throw error
    }
}

export async function addLeaderboardEntry(entry: NewLeaderboardEntry) {
    try {
        await db.insert(leaderboard).values(entry)
    } catch (error) {
        console.error('Error in addLeaderboardEntry:', error)
        throw error
    }
}

export async function addUpcomingEvent(event: NewUpcomingEvent) {
    try {
        await db.insert(upcomingEvents).values({
            ...event,
            date:
                event.date instanceof Date ? event.date : new Date(event.date),
        })
    } catch (error) {
        console.error('Error in addUpcomingEvent:', error)
        throw error
    }
}

// ----------------- Updates -----------------
export async function updateProject(id: string, updates: Partial<Project>) {
    try {
        return await db
            .update(projects)
            .set(updates)
            .where(eq(projects.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateProject:', error)
        throw error
    }
}

export async function updateAchievement(
    id: string,
    data: Partial<Achievement>
) {
    const adaptedData = {
        ...data,
        date: data.date
            ? typeof data.date === 'string'
                ? data.date
                : (data.date as Date).toISOString().split('T')[0]
            : undefined,
    }

    try {
        await db
            .update(achievements)
            .set(adaptedData)
            .where(eq(achievements.id, id))
    } catch (error) {
        console.error('Error in updateAchievement:', error)
        throw error
    }
}

export async function updateBlog(id: string, updates: Partial<Blog>) {
    try {
        const adaptedData = {
            ...updates,
            ...(updates.publishDate && {
                publishDate:
                    updates.publishDate instanceof Date
                        ? updates.publishDate
                        : new Date(updates.publishDate),
            }),
        }
        return await db
            .update(blogs)
            .set(adaptedData)
            .where(eq(blogs.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateBlog:', error)
        throw error
    }
}

export async function updateEvent(id: string, updates: Partial<Event>) {
    try {
        const adaptedData = {
            ...updates,
            ...(updates.date && {
                date:
                    updates.date instanceof Date
                        ? updates.date
                        : new Date(updates.date),
            }),
            ...(updates.imageUrls !== undefined && {
                imageUrls: updates.imageUrls ?? [],
            }),
        }
        return await db
            .update(events)
            .set(adaptedData)
            .where(eq(events.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateEvent:', error)
        throw error
    }
}

export async function updateLeaderboardEntry(
    id: string,
    updates: Partial<LeaderboardEntry>
) {
    try {
        return await db
            .update(leaderboard)
            .set(updates)
            .where(eq(leaderboard.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateLeaderboardEntry:', error)
        throw error
    }
}

export async function updateUpcomingEvent(
    id: string,
    updates: Partial<UpcomingEvent>
) {
    try {
        const adaptedData = {
            ...updates,
            ...(updates.date && {
                date:
                    updates.date instanceof Date
                        ? updates.date
                        : new Date(updates.date),
            }),
        }
        return await db
            .update(upcomingEvents)
            .set(adaptedData)
            .where(eq(upcomingEvents.id, id))
            .returning()
    } catch (error) {
        console.error('Error in updateUpcomingEvent:', error)
        throw error
    }
}

// ----------------- Deletions -----------------
export async function deleteProject(id: string) {
    try {
        await db.delete(projects).where(eq(projects.id, id))
    } catch (error) {
        console.error('Error in deleteProject:', error)
        throw error
    }
}

export async function deleteAchievement(id: string) {
    try {
        await db.delete(achievements).where(eq(achievements.id, id))
    } catch (error) {
        console.error('Error in deleteAchievement:', error)
        throw error
    }
}

export async function deleteBlog(id: string) {
    try {
        await db.delete(blogs).where(eq(blogs.id, id))
    } catch (error) {
        console.error('Error in deleteBlog:', error)
        throw error
    }
}

export async function deleteEvent(id: string) {
    try {
        await db.delete(events).where(eq(events.id, id))
    } catch (error) {
        console.error('Error in deleteEvent:', error)
        throw error
    }
}

export async function deleteLeaderboardEntry(id: string) {
    try {
        await db.delete(leaderboard).where(eq(leaderboard.id, id))
    } catch (error) {
        console.error('Error in deleteLeaderboardEntry:', error)
        throw error
    }
}

export async function deleteUpcomingEvent(id: string) {
    try {
        await db.delete(upcomingEvents).where(eq(upcomingEvents.id, id))
    } catch (error) {
        console.error('Error in deleteUpcomingEvent:', error)
        throw error
    }
}

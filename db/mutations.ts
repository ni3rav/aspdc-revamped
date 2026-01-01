'use server'

import { headers } from 'next/headers'
import { db } from '@/db/drizzle'
import {
    achievements,
    blogs,
    events,
    leaderboard,
    projects,
    upcomingEvents,
    votes,
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
import { eq, and } from 'drizzle-orm'

// ----------------- Date Helpers -----------------
function normalizeDate(date: Date | string): Date {
    return date instanceof Date ? date : new Date(date)
}

function normalizeDateString(date: Date | string): string {
    const dateObj = normalizeDate(date)
    return dateObj.toISOString().split('T')[0]
}

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
            date: normalizeDateString(achievement.date),
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
            publishDate: normalizeDate(blog.publishDate),
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
            date: normalizeDate(event.date),
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
            date: normalizeDate(event.date),
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
    const { date, ...rest } = data
    const adaptedData = {
        ...rest,
        ...(date && { date: normalizeDateString(date) }),
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
                publishDate: normalizeDate(updates.publishDate),
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
            ...(updates.date && { date: normalizeDate(updates.date) }),
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
            ...(updates.date && { date: normalizeDate(updates.date) }),
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

// ----------------- Votes (Ship-It) -----------------
async function getClientIP(): Promise<string | null> {
    try {
        const headersList = await headers()
        // Try various headers that might contain the IP
        const forwarded = headersList.get('x-forwarded-for')
        const realIP = headersList.get('x-real-ip')
        const cfConnectingIP = headersList.get('cf-connecting-ip')

        if (forwarded) {
            return forwarded.split(',')[0].trim()
        }
        if (realIP) {
            return realIP
        }
        if (cfConnectingIP) {
            return cfConnectingIP
        }
        return null
    } catch {
        return null
    }
}

async function getUserAgent(): Promise<string | null> {
    try {
        const headersList = await headers()
        return headersList.get('user-agent')
    } catch {
        return null
    }
}

export async function addVote(projectId: string) {
    try {
        const ipAddress = await getClientIP()
        const userAgent = await getUserAgent()

        await db.insert(votes).values({
            projectId,
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
        })
    } catch (error) {
        // If duplicate vote (same IP + project), silently fail or handle gracefully
        console.error('Error in addVote:', error)
        throw error
    }
}

export async function removeVote(projectId: string) {
    try {
        const ipAddress = await getClientIP()

        if (ipAddress) {
            await db
                .delete(votes)
                .where(
                    and(
                        eq(votes.projectId, projectId),
                        eq(votes.ipAddress, ipAddress)
                    )
                )
        } else {
            // If no IP, try to delete any vote for this project (less secure but works)
            await db.delete(votes).where(eq(votes.projectId, projectId))
        }
    } catch (error) {
        console.error('Error in removeVote:', error)
        throw error
    }
}

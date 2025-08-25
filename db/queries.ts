import {
    Achievement,
    Blog,
    Event,
    LeaderboardEntry,
    Project,
    UpcomingEvent,
} from '@/db/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// ----------------- Achievements -----------------
export async function fetchAchievements(): Promise<Achievement[]> {
    const data = await fetch(`${BASE_URL}/api/achievements`)
    return await data.json()
}

// ----------------- Blogs -----------------
export async function fetchBlogs(): Promise<Blog[]> {
    const data = await fetch(`${BASE_URL}/api/blogs`)
    return await data.json()
}

// ----------------- Events -----------------
export async function fetchEvents(): Promise<Event[]> {
    const data = await fetch(`${BASE_URL}/api/events`)
    return await data.json()
}

// ----------------- Leaderboard -----------------
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    const data = await fetch(`${BASE_URL}/api/leaderboard`)
    return await data.json()
}

// ----------------- Projects -----------------
export async function fetchProjects(): Promise<Project[]> {
    const data = await fetch(`${BASE_URL}/api/projects`)
    return await data.json()
}

// ----------------- Upcoming Events -----------------
export async function fetchUpcomingEvents(): Promise<UpcomingEvent[]> {
    const data = await fetch(`${BASE_URL}/api/upcoming-events`)
    return await data.json()
}

import {
    Achievement,
    Blog,
    Event,
    LeaderboardEntry,
    Project,
    UpcomingEvent,
} from '@/db/types'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// ----------------- Achievements -----------------
export async function fetchAchievements(): Promise<Achievement[]> {
    try {
        const data = await fetch(`${BASE_URL}/api/achievements`)
        return await data.json()
    } catch (error) {
        console.error('Error fetching achievements:', error)
        return []
    }
}

// ----------------- Blogs -----------------
export async function fetchBlogs(): Promise<Blog[]> {
    try {
        const data = await fetch(`${BASE_URL}/api/blogs`)
        return await data.json()
    } catch (error) {
        console.error('Error fetching blogs:', error)
        return []
    }
}

// ----------------- Events -----------------
export async function fetchEvents(): Promise<Event[]> {
    try {
        const data = await fetch(`${BASE_URL}/api/events`)
        return await data.json()
    } catch (error) {
        console.error('Error fetching events:', error)
        return []
    }
}

// ----------------- Leaderboard -----------------
export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
        const data = await fetch(`${BASE_URL}/api/leaderboard`)
        return await data.json()
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return []
    }
}

// ----------------- Projects -----------------
export async function fetchProjects(): Promise<Project[]> {
    try {
        const data = await fetch(`${BASE_URL}/api/projects`)
        return await data.json()
    } catch (error) {
        console.error('Error fetching projects:', error)
        return []
    }
}

// ----------------- Upcoming Events -----------------
export async function fetchUpcomingEvents(): Promise<UpcomingEvent[]> {
    try {
        const data = await fetch(`${BASE_URL}/api/upcoming-events`)
        return await data.json()
    } catch (error) {
        console.error('Error fetching upcoming events:', error)
        return []
    }
}

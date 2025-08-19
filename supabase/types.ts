export type Achievement = {
    id: string
    title: string
    description: string
    date: string
    created_at: string
    image_url: string | null
}

export type Blog = {
    id: string
    title: string
    author: string
    link: string
    publish_date: string
    cover_image: string | null
    created_at: string
}

export type Event = {
    id: string
    name: string
    date: string
    details: string
    created_at: string
    image_urls: string[]
}

export type LeaderboardEntry = {
    id: string
    rank: number
    username: string
    rating: number
    created_at: string
}

export type Project = {
    id: string
    name: string
    author: string
    description: string
    live_link: string | null
    github_url: string | null
    created_at: string
    project_banner_url: string | null
}

export type UpcomingEvent = {
    id: string
    name: string
    date: string
    description: string
    location: string | null
    registration_link: string | null
    created_at: string
    event_image_url: string | null
}

export type NewAchievement = Omit<Achievement, 'id' | 'created_at'>
export type NewBlog = Omit<Blog, 'id' | 'created_at'>
export type NewEvent = Omit<Event, 'id' | 'created_at'>
export type NewLeaderboardEntry = Omit<LeaderboardEntry, 'id' | 'created_at'>
export type NewProject = Omit<Project, 'id' | 'created_at'>
export type NewUpcomingEvent = Omit<UpcomingEvent, 'id' | 'created_at'>

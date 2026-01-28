export type Achievement = {
    id: string
    title: string
    description: string
    date: Date
    createdAt: Date
    imageUrl: string | null
}

export type Blog = {
    id: string
    title: string
    author: string
    link: string
    publishDate: Date
    coverImage: string | null
    createdAt: Date
}

export type Event = {
    id: string
    name: string
    date: Date
    details: string
    createdAt: Date
    imageUrls: string[]
}

export type LeaderboardEntry = {
    id: string
    rank: number
    username: string
    rating: number
    createdAt: Date
}

export type Project = {
    id: string
    name: string
    author: string
    description: string
    liveLink: string | null
    githubUrl: string | null
    createdAt: Date
    projectBannerUrl: string | null
}

export type UpcomingEvent = {
    id: string
    name: string
    date: Date
    description: string
    location: string | null
    registrationLink: string | null
    createdAt: Date
    eventImageUrl: string | null
}

export type Certificate = {
    id: string
    token: string
    participantName: string
    eventName: string
    eventDate: Date
    createdAt: Date
}

export type CodeforcesUser = {
    handle: string
    firstName?: string
    lastName?: string
    rank?: string
    rating?: number
    maxRank?: string
    maxRating?: number
}

// New entity types
export type NewAchievement = Omit<Achievement, 'id' | 'createdAt'>
export type NewBlog = Omit<Blog, 'id' | 'createdAt'>
export type NewEvent = Omit<Event, 'id' | 'createdAt'>
export type NewLeaderboardEntry = Omit<LeaderboardEntry, 'id' | 'createdAt'>
export type NewProject = Omit<Project, 'id' | 'createdAt'>
export type NewUpcomingEvent = Omit<UpcomingEvent, 'id' | 'createdAt'>
export type NewCodeforcesUser = Omit<CodeforcesUser, 'id' | 'createdAt'>

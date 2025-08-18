// seed.ts
import {
    events,
    projects,
    leaderboard,
    achievements,
    upcomingEvents,
    blogs,
} from './schema'
import { db } from '.'

async function main() {
    console.log('🌱 Starting seed...')

    // // Clear tables first (optional, be careful in production!)
    // await db.delete(events)
    // await db.delete(projects)
    // await db.delete(leaderboard)
    // await db.delete(achievements)
    // await db.delete(upcomingEvents)
    // await db.delete(blogs)

    // Insert events
    await db.insert(events).values([
        {
            name: 'Hackathon 2025',
            date: new Date('2025-09-10T10:00:00Z'),
            details: 'A 24-hour coding challenge.',
            imageUrls: ['https://example.com/hackathon.png'],
        },
        {
            name: 'Tech Talk',
            date: new Date('2025-08-25T17:00:00Z'),
            details: 'A session on modern web development.',
            imageUrls: [],
        },
    ])

    // Insert projects
    await db.insert(projects).values([
        {
            name: 'Club Website',
            author: 'Nirav',
            description: 'A website for the coding club.',
            liveLink: 'https://club.example.com',
            githubUrl: 'https://github.com/example/club-website',
            projectBannerUrl: 'https://example.com/banner.png',
        },
        {
            name: 'AI Chatbot',
            author: 'Team Alpha',
            description: 'A chatbot for answering FAQs.',
            githubUrl: 'https://github.com/example/ai-chatbot',
        },
    ])

    // Insert leaderboard
    await db.insert(leaderboard).values([
        { rank: 1, username: 'codeMaster', rating: 2450 },
        { rank: 2, username: 'bugHunter', rating: 2200 },
        { rank: 3, username: 'nirav', rating: 2100 },
    ])

    // Insert achievements
    // Insert achievements
    await db.insert(achievements).values([
        {
            title: 'First Place - Hackathon',
            description: 'Won first place in the inter-college hackathon.',
            date: '2025-01-15', // ✅ string format
            imageUrl: 'https://example.com/trophy.png',
        },
        {
            title: 'Best Project Award',
            description: 'Recognized for building an innovative project.',
            date: '2025-05-20', // ✅ string format
        },
    ])

    // Insert upcoming events
    await db.insert(upcomingEvents).values([
        {
            name: 'CodeSprint 2025',
            date: new Date('2025-09-30T09:00:00Z'),
            description: 'Annual competitive programming contest.',
            location: 'Main Auditorium',
            registrationLink: 'https://example.com/register',
            eventImageUrl: 'https://example.com/codesprint.png',
        },
    ])

    // Insert blogs
    await db.insert(blogs).values([
        {
            title: 'Getting Started with TypeScript',
            author: 'Alice',
            link: 'https://blog.example.com/typescript',
            publishDate: new Date('2025-06-10T00:00:00Z'),
            coverImage: 'https://example.com/ts-blog.png',
        },
        {
            title: 'The Future of AI',
            author: 'Bob',
            link: 'https://blog.example.com/ai-future',
            publishDate: new Date('2025-07-15T00:00:00Z'),
        },
    ])

    console.log('✅ Seed completed!')
}

main().catch((err) => {
    console.error('❌ Seeding failed', err)
    process.exit(1)
})

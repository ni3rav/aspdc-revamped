import { achievements, blogs, events, projects } from './schema'
import { db } from './drizzle'

const achievementsData = [
    {
        title: 'Achievement 1',
        description: 'Description for achievement 1.',
        date: new Date('2024-01-01'),
        imageUrl: 'https://example.com/ach1.jpg',
    },
    {
        title: 'Achievement 2',
        description: 'Description for achievement 2.',
        date: new Date('2024-02-01'),
        imageUrl: 'https://example.com/ach2.jpg',
    },
]

const blogsData = [
    {
        title: 'Blog Post 1',
        author: 'Author A',
        link: 'https://example.com/blog1',
        publishDate: new Date('2024-03-01'),
        coverImage: 'https://example.com/blog1.jpg',
    },
    {
        title: 'Blog Post 2',
        author: 'Author B',
        link: 'https://example.com/blog2',
        publishDate: new Date('2024-04-01'),
        coverImage: 'https://example.com/blog2.jpg',
    },
]

const eventsData = [
    {
        name: 'Event 1',
        date: new Date('2024-05-01'),
        details: 'Details for event 1.',
        imageUrls: [
            'https://example.com/event1a.jpg',
            'https://example.com/event1b.jpg',
        ],
    },
    {
        name: 'Event 2',
        date: new Date('2024-06-01'),
        details: 'Details for event 2.',
        imageUrls: ['https://example.com/event2a.jpg'],
    },
]

const projectsData = [
    {
        name: 'Project 1',
        author: 'Dev A',
        description: 'Description for project 1.',
        githubUrl: 'https://github.com/dev/project1',
        projectBannerUrl: 'https://example.com/proj1.jpg',
    },
    {
        name: 'Project 2',
        author: 'Dev B',
        description: 'Description for project 2.',
        githubUrl: 'https://github.com/dev/project2',
        projectBannerUrl: 'https://example.com/proj2.jpg',
    },
]

// Function to insert data
async function insertData() {
    try {
        console.log('Starting data insertion...')

        // Insert achievements
        console.log('Inserting achievements...')
        for (const achievement of achievementsData) {
            await db.insert(achievements).values({
                ...achievement,
                date: achievement.date.toISOString(),
            })
        }

        // Insert blogs
        console.log('Inserting blogs...')
        for (const blog of blogsData) {
            await db.insert(blogs).values(blog)
        }

        // Insert events
        console.log('Inserting events...')
        for (const event of eventsData) {
            await db.insert(events).values(event)
        }

        // Insert projects
        console.log('Inserting projects...')
        for (const project of projectsData) {
            await db.insert(projects).values(project)
        }

        console.log('Data insertion completed successfully!')
    } catch (error) {
        console.error('Error inserting data:', error)
    }
}

// Run the insertion
insertData()

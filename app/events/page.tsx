import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { fetchEvents } from '@/db/queries'
import { Event } from '@/db/types'
import React from 'react'

const majorEvents = ['Hackspire', 'Hackfest', 'Adani Pump']

const Events = async () => {
    // const items: Event[] = await fetchEvents()
    const items: Event[] = [
        {
            id: '1',
            name: 'Tech Innovators Summit',
            date: new Date('2025-09-15T10:00:00Z'),
            details:
                'A gathering of top tech innovators to showcase groundbreaking projects and discuss the future of technology.',
            createdAt: new Date('2025-08-20T14:30:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
            ],
        },
        {
            id: '2',
            name: 'Startup Pitch Night',
            date: new Date('2025-10-02T18:30:00Z'),
            details:
                'Local startups pitch their ideas to a panel of investors and industry leaders.',
            createdAt: new Date('2025-08-22T09:15:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
            ],
        },
        {
            id: '3',
            name: 'AI & Machine Learning Workshop',
            date: new Date('2025-09-20T09:00:00Z'),
            details:
                'Hands-on workshop covering the fundamentals of AI and ML with real-world projects.',
            createdAt: new Date('2025-08-23T12:00:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
            ],
        },
        {
            id: '4',
            name: 'Hackfest',
            date: new Date('2025-11-05T16:00:00Z'),
            details:
                'A day full of live music performances, food stalls, and community bonding.',
            createdAt: new Date('2025-08-24T18:45:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2',
            ],
        },
        {
            id: '6',
            name: 'Art & Culture Expo',
            date: new Date('2025-10-12T11:00:00Z'),
            details:
                'An exhibition celebrating art, photography, and cultural heritage.',
            createdAt: new Date('2025-08-25T10:40:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1513351105279-7f3a1d77eaa1',
            ],
        },
        {
            id: '5',
            name: 'Hackspire',
            date: new Date('2025-09-28T08:00:00Z'),
            details:
                '48-hour coding competition where teams build innovative solutions to real-world problems.',
            createdAt: new Date('2025-08-21T11:20:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
            ],
        },
        {
            id: '7',
            name: 'Health & Wellness Fair',
            date: new Date('2025-09-22T09:30:00Z'),
            details:
                'Workshops, yoga sessions, and health checkups to promote well-being.',
            createdAt: new Date('2025-08-26T08:00:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
            ],
        },
        {
            id: '8',
            name: 'Photography Walk',
            date: new Date('2025-09-18T07:00:00Z'),
            details:
                'A photo walk through the city capturing urban life and landscapes.',
            createdAt: new Date('2025-08-22T15:50:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
            ],
        },
        {
            id: '9',
            name: 'Community Clean-Up Drive',
            date: new Date('2025-10-01T08:00:00Z'),
            details:
                'Volunteers gather to clean public spaces and spread awareness about sustainability.',
            createdAt: new Date('2025-08-21T19:30:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
            ],
        },
        {
            id: '10',
            name: 'Adani Pump',
            date: new Date('2025-11-10T12:00:00Z'),
            details:
                'A celebration of food with stalls from top local chefs and restaurants.',
            createdAt: new Date('2025-08-27T13:25:00Z'),
            imageUrls: [
                'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
            ],
        },
    ]

    return (
        <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Happening @ ASPDC
            </TextScramble>
            <BentoGrid>
                {items.map((item) => (
                    <BentoGridItem
                        key={item.id}
                        title={item.name}
                        description={item.details}
                        icon={item.imageUrls[0]}
                        className={
                            majorEvents.includes(item.name)
                                ? 'md:col-span-2'
                                : ''
                        }
                    />
                ))}
            </BentoGrid>
        </main>
    )
}

export default Events

import AchievementsPage from '@/components/AchievementsClient'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { fetchAchievements } from '@/db/queries'
import { Achievement } from '@/db/types'
import React from 'react'

const page = async () => {
    // const ach: Achievement[] = await fetchAchievements()
    const achievements: Achievement[] = [
        {
            id: 'a8ed025f-25a7-44ff-9a9d-ee3f6de7952a',
            title: 'Runners Up at Healthathon 2025',
            description:
                'Nirav Maheta and Kushal Unjiya alongside their medical team secured the runners up position at Healthathon 2025 with their project HealthHarmony that brings the awareness needed for transplant patients',
            date: new Date('2025-03-28T00:00:00.000Z'),
            createdAt: new Date('2025-09-08T10:02:18.704Z'),
            imageUrl: 'https://files.catbox.moe/jl1p6i.jpeg',
        },
        {
            id: 'f3f12286-619c-4c66-a415-8aba7df48db4',
            title: 'Winners at Ingenious 6.0',
            description:
                'ASPDC\'s lead designer, Nishant Mehta, and "Team Pixel" secured first place at Ahmedabad University\'s Ingenious 6.0 by creating an AI-powered stock market investment dashboard. Their solution leverages AI for real-time data analysis and portfolio management, enabling informed investment decisions.',
            date: new Date('2025-03-22T00:00:00.000Z'),
            createdAt: new Date('2025-09-08T10:02:19.204Z'),
            imageUrl: 'https://files.catbox.moe/99y96z.jpg',
        },
        {
            id: '7a1aae12-55ed-4682-858e-689573aedbff',
            title: 'Top 10 at Ingenious 6.0',
            description:
                'Our students proudly made it into the top 10 at Ahmedabad University\'s Ingenious 6.0 hackathon with their project, "Invstrix."',
            date: new Date('2025-03-22T00:00:00.000Z'),
            createdAt: new Date('2025-09-08T10:02:19.398Z'),
            imageUrl: 'https://files.catbox.moe/owe88i.jpeg',
        },
        {
            id: 'a2e4d66b-10cf-4904-a5e0-a8af035b42b7',
            title: 'Winners at Techathon 2025',
            description:
                'The core ASPDC team proudly secured 1st place at Techathon 2025, AIDTM, with their innovative project, "Roadsafe." This web application enhances road safety by leveraging real-time data, user collaboration, and smart technology.',
            date: new Date('2025-01-10T00:00:00.000Z'),
            createdAt: new Date('2025-09-08T10:02:18.902Z'),
            imageUrl: 'https://files.catbox.moe/qj584l.jpeg',
        },
        {
            id: '77750f6e-e68b-483f-abb4-eadcf32d6446',
            title: '2nd Runners Up at Tic Tech Toe 2024',
            description:
                'The Overfitters team proudly secured 3rd place (2nd runners-up) at Tic Tac Toe 2024 Hackathon, DAIICT, with their innovative project, "GiftGenie." This AI-powered chatbot simplifies gift selection by intelligently analyzing user preferences to suggest the perfect gifts for loved ones',
            date: new Date('2024-09-29T00:00:00.000Z'),
            createdAt: new Date('2025-09-08T10:02:19.816Z'),
            imageUrl: 'https://files.catbox.moe/bto07u.jpg',
        },
        {
            id: 'd572a96f-22ae-48a0-a831-302cf3dfcae6',
            title: 'Runners up at DataQuest 2024',
            description:
                'Janmejay Chatterjee and Kushal Unjiya, achieved an impressive 2nd place at DataQuest 2024 with their innovative product, "Reeech." This powerful tool transcribes conversations, analyzes sentiment, summarizes content, detects keywords, and identifies speakers.',
            date: new Date('2024-08-31T00:00:00.000Z'),
            createdAt: new Date('2025-09-08T10:02:20.010Z'),
            imageUrl: 'https://files.catbox.moe/nx3dti.jpeg',
        },
        {
            id: '1cc60a05-33c2-4318-a9d5-3b4e60871cd5',
            title: '3rd Rank at HackNUthon 5',
            description:
                'Our students proudly secured 3rd place at HackNUthon 5 in the AI-powered SQL Query Builder track with their innovative product, "Querix."',
            date: new Date('2024-04-21T00:00:00.000Z'),
            createdAt: new Date('2025-09-08T10:02:19.614Z'),
            imageUrl: 'https://files.catbox.moe/roybc5.jpeg',
        },
    ]
    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Achievements
            </TextScramble>
            <AchievementsPage ach={achievements} />
        </main>
    )
}

export default page

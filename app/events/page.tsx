import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import React from 'react'

const page = () => {

        const items = [
            {
                id: "1",
                name: "Hackathon 2025",
                date: new Date("2025-09-15"),
                details: "A thrilling 24-hour coding competition where teams build innovative apps.",
                createdAt: new Date("2025-08-10"),
                imageUrls: [
                    "https://images.unsplash.com/photo-1683009427590-dd987135e66c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8bGFuZHNjYXBlfGVufDB8fDB8fHww",
                    "https://source.unsplash.com/800x600/?coding,team",
                ],
            },
            {
                id: "2",
                name: "Web Dev Bootcamp",
                date: new Date("2025-10-01"),
                details: "Hands-on training in HTML, CSS, JavaScript, and React.",
                createdAt: new Date("2025-08-12"),
                imageUrls: [
                    "https://source.unsplash.com/800x600/?web,developer",
                ],
            },
            {
                id: "3",
                name: "AI & ML Workshop",
                date: new Date("2025-11-20"),
                details: "Dive into Artificial Intelligence and Machine Learning basics with fun projects.",
                createdAt: new Date("2025-08-14"),
                imageUrls: [
                    "https://source.unsplash.com/800x600/?artificial-intelligence",
                    "https://source.unsplash.com/800x600/?machine-learning",
                ],
            },
            {
                id: "4",
                name: "Open Source Sprint",
                date: new Date("2025-09-30"),
                details: "Collaborate with peers and mentors to contribute to open-source projects.",
                createdAt: new Date("2025-08-16"),
                imageUrls: [
                    "https://source.unsplash.com/800x600/?opensource",
                ],
            },
            {
                id: "5",
                name: "DSA Marathon",
                date: new Date("2025-10-10"),
                details: "Test your problem-solving skills in a week-long coding challenge.",
                createdAt: new Date("2025-08-18"),
                imageUrls: [
                    "https://source.unsplash.com/800x600/?algorithm",
                    "https://source.unsplash.com/800x600/?coding-challenge",
                ],
            },
            {
                id: "6",
                name: "UI/UX Design Jam",
                date: new Date("2025-11-05"),
                details: "Unleash your creativity by designing intuitive and engaging user interfaces.",
                createdAt: new Date("2025-08-20"),
                imageUrls: [
                    "https://source.unsplash.com/800x600/?design,ui",
                ],
            },
            {
                id: "7",
                name: "Cloud Computing Summit",
                date: new Date("2025-12-02"),
                details: "Learn how to build and scale apps using AWS, Azure, and GCP.",
                createdAt: new Date("2025-08-22"),
                imageUrls: [
                    "https://source.unsplash.com/800x600/?cloud,server",
                    "https://source.unsplash.com/800x600/?technology",
                ],
            },
            {
                id: "8",
                name: "Cybersecurity Awareness Day",
                date: new Date("2025-09-25"),
                details: "Interactive workshops and demos to teach safe online practices.",
                createdAt: new Date("2025-08-24"),
                imageUrls: [
                    "https://source.unsplash.com/800x600/?cybersecurity",
                ],
            },
            {
                id: "9",
                name: "Startup Pitch Night",
                date: new Date("2025-10-18"),
                details: "Pitch your startup ideas to a panel of mentors and investors.",
                createdAt: new Date("2025-08-26"),
                imageUrls: [
                    "https://source.unsplash.com/800x600/?startup,pitch",
                    "https://source.unsplash.com/800x600/?entrepreneur",
                ],
            },
            {
                id: "10",
                name: "Tech Trivia Night",
                date: new Date("2025-11-12"),
                details: "Compete in a fun quiz full of tech facts, puzzles, and surprises.",
                createdAt: new Date("2025-08-28"),
                imageUrls: [
                    "https://source.unsplash.com/800x600/?quiz,technology",
                ],
            },
        ]

        return (
            <div>
                <BentoGrid className="max-w-4xl mx-auto">
                    {items.map((item) => (
                        <BentoGridItem
                            key={item.id}
                            title={item.name}
                            description={item.details}
                            icon={item.imageUrls[0]}
                            className=""
                        />
                    ))}
                </BentoGrid>
            </div>
        )
    }

    export default page
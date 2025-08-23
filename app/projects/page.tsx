import React from 'react'
import { Dcardcode } from '@/components/Dcardcode'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { Project } from "@/supabase/types"

export const projects: Project[] = [
    {
        id: '1',
        name: 'Floating UI',
        author: 'Alice Smith',
        description: 'A library for creating floating elements with advanced positioning.',
        live_link: 'https://floating-ui.com',
        github_url: 'https://github.com/floating-ui/floating-ui',
        created_at: '2023-05-10',
        project_banner_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Motion Primitives',
        author: 'Bob Lee',
        description: 'Reusable animation primitives for React apps.',
        live_link: 'https://motion-primitives.dev',
        github_url: 'https://github.com/boblee/motion-primitives',
        created_at: '2022-11-22',
        project_banner_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: '3',
        name: 'Code Scrambler',
        author: 'Carol Nguyen',
        description: 'A tool to scramble and animate text for creative UIs.',
        live_link: "example.com",
        github_url: 'https://github.com/carolnguyen/code-scrambler',
        created_at: '2024-01-15',
        project_banner_url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: '4',
        name: 'Perspective Cards',
        author: 'David Kim',
        description: 'CSS-powered 3D perspective card components.',
        live_link: 'https://perspectivecards.com',
        github_url: 'https://github.com/evetorres/banner-generator',
        created_at: '2023-08-30',
        project_banner_url: 'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: '5',
        name: 'Banner Generator',
        author: 'Eve Torres',
        description: 'Generate beautiful banners for your projects.',
        live_link: 'https://bannergen.io',
        github_url: 'https://github.com/evetorres/banner-generator',
        created_at: '2022-03-05',
        project_banner_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1200&auto=format&fit=crop'
    },
    {
        id: '6',
        name: 'Live Link Preview',
        author: 'Frank Zhao',
        description: 'Preview live links with rich metadata and screenshots.',
        live_link: "example.com",
        github_url: 'https://github.com/frankzhao/live-link-preview',
        created_at: '2024-02-20',
        project_banner_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
    }
]
const page = () => {
    return (
        <main className="py-12 md:py-32">
            <div className="mx-auto max-w-5xl px-8 lg:px-0">
                <TextScramble className="mb-8 text-primary uppercase text-3xl font-bold md:mb-16 lg:text-4xl">
                    Projects showcase
                </TextScramble>
            </div>

            <div className="mx-auto max-w-5xl px-8 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                    {projects.map((project) => (
                        <Dcardcode
                            key={project.id}
                            title={project.name}
                            author={project.author}
                            description={project.description}
                            imgUrl={project.project_banner_url ?? undefined}
                            github_url={project.github_url ?? undefined}
                            liveUrl={project.live_link ?? undefined}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}

export default page
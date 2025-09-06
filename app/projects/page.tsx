import React from 'react'
import { Dcardcode } from '@/components/Dcardcode'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { Project } from '@/db/types'
import { fetchProjects } from '@/db/queries'
import Fallback from '@/components/Fallback'

const Projects = async () => {
    const projects: Project[] = await fetchProjects()

    if (!projects || projects.length === 0) {
        return (
            <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-8 py-12 md:py-32 lg:px-0">
                <Fallback
                    message="No projects found."
                    illustration={
                        <svg
                            width="80"
                            height="80"
                            fill="none"
                            viewBox="0 0 80 80"
                        >
                            <circle cx="40" cy="40" r="40" fill="#18181b" />
                            <path
                                d="M25 40h30M40 25v30"
                                stroke="#52525b"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    }
                />
            </main>
        )
    }

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Projects Showcase
            </TextScramble>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                {projects.map((project) => (
                    <Dcardcode
                        key={project.id}
                        title={project.name}
                        author={project.author}
                        description={project.description}
                        imgUrl={project.projectBannerUrl ?? undefined}
                        github_url={project.githubUrl ?? undefined}
                        liveUrl={project.liveLink ?? undefined}
                    />
                ))}
            </div>
        </main>
    )
}

export default Projects

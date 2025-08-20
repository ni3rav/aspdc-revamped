'use client'

import { useProjects } from '@/hooks/useProjects'

export default function ProjectsPage() {
    const { data, isLoading, isError } = useProjects()

    if (isLoading) {
        return <div className="p-6 text-gray-600">Loading projects...</div>
    }

    if (isError || !data) {
        return <div className="p-6 text-red-500">Failed to load projects.</div>
    }

    return (
        <main className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Projects</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((project) => (
                    <div
                        key={project.githubUrl}
                        className="rounded-md border border-gray-200 p-4 transition hover:shadow-md"
                    >
                        <h2 className="mb-1 text-lg font-semibold">
                            {project.name}
                        </h2>
                        <p className="mb-2 text-sm text-gray-500">
                            by {project.author}
                        </p>
                        <p className="mb-4 text-sm">{project.description}</p>
                        <div className="flex gap-4 text-sm">
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Live
                                </a>
                            )}
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    GitHub
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

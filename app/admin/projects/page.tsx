'use client'
import { ProjectCard, AddProjectCard } from '@/components/admin/project-card'
import { useProjects } from '@/hooks/useProjects'

export default function ProjectsPage() {
    const { data: projects, isLoading, error } = useProjects()

    if (isLoading)
        return (
            <div className="text-muted-foreground text-center">
                Loading projects...
            </div>
        )
    if (error)
        return (
            <div className="text-destructive text-center">
                Error loading projects
            </div>
        )

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-foreground mb-8 text-3xl font-bold">
                Projects Showcase
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Add new project card */}
                <AddProjectCard />

                {/* Display existing projects */}
                {projects?.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {projects?.length === 0 && (
                <p className="text-muted-foreground mt-8 text-center">
                    No projects yet. Showcase your first project!
                </p>
            )}
        </div>
    )
}

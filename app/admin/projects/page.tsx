'use client'

import { CompoundCard } from '@/components/admin'
import { InsertionDialog } from '@/components/admin'
import { ModifyDialog } from '@/components/admin/modify-dialog'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { ProjectForm } from '@/components/admin/forms'
import {
    useProjects,
    useAddProject,
    useUpdateProject,
    useDeleteProject,
} from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'

export default function ProjectsPage() {
    const { data: projects, isLoading: projectsLoading } = useProjects()
    const addProjectMutation = useAddProject()
    const updateProjectMutation = useUpdateProject()
    const deleteProjectMutation = useDeleteProject()

    return (
        <div className="container mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <p className="text-muted-foreground">
                        Showcase your work and achievements
                    </p>
                </div>
                <InsertionDialog>
                    <InsertionDialog.Trigger label="Add New Project" />
                    <InsertionDialog.Content>
                        <InsertionDialog.Header>
                            <InsertionDialog.Title>
                                Create New Project
                            </InsertionDialog.Title>
                            <InsertionDialog.Description>
                                Add a new project to showcase
                            </InsertionDialog.Description>
                        </InsertionDialog.Header>
                        <InsertionDialog.Form mutation={addProjectMutation}>
                            {({ onSubmit, isLoading }) => (
                                <ProjectForm
                                    onSubmit={onSubmit}
                                    isLoading={isLoading}
                                    submitLabel="Create Project"
                                />
                            )}
                        </InsertionDialog.Form>
                    </InsertionDialog.Content>
                </InsertionDialog>
            </div>

            {projectsLoading ? (
                <div className="py-8 text-center">Loading projects...</div>
            ) : (
                <div className="grid gap-6">
                    {projects?.map((project) => (
                        <CompoundCard
                            key={project.id}
                            title={project.name}
                            subtitle={`By ${project.author}`}
                            description={project.description}
                            imageUrl={project.projectBannerUrl}
                            badges={[{ label: 'Project', variant: 'default' }]}
                            actions={
                                <div className="flex gap-2">
                                    <ModifyDialog>
                                        <ModifyDialog.Trigger label="Edit" />
                                        <ModifyDialog.Content>
                                            <ModifyDialog.Header>
                                                <ModifyDialog.Title>
                                                    Edit Project
                                                </ModifyDialog.Title>
                                            </ModifyDialog.Header>
                                            <ModifyDialog.Form
                                                mutation={updateProjectMutation}
                                                initialData={project}
                                            >
                                                {({
                                                    onSubmit,
                                                    isLoading,
                                                    initialData,
                                                }) => (
                                                    <ProjectForm
                                                        onSubmit={onSubmit}
                                                        isLoading={isLoading}
                                                        initialData={
                                                            initialData
                                                        }
                                                        submitLabel="Update Project"
                                                    />
                                                )}
                                            </ModifyDialog.Form>
                                        </ModifyDialog.Content>
                                    </ModifyDialog>

                                    <DeleteDialog>
                                        <DeleteDialog.Trigger />
                                        <DeleteDialog.Content>
                                            <DeleteDialog.Header>
                                                <DeleteDialog.Title>
                                                    Delete Project
                                                </DeleteDialog.Title>
                                            </DeleteDialog.Header>
                                            <DeleteDialog.Confirmation
                                                mutation={deleteProjectMutation}
                                                itemId={project.id}
                                                itemName="project"
                                            />
                                        </DeleteDialog.Content>
                                    </DeleteDialog>
                                </div>
                            }
                            footer={
                                <div className="flex gap-2">
                                    {project.liveLink && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Live Demo
                                            </a>
                                        </Button>
                                    )}
                                    {project.githubUrl && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                GitHub
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, Plus, ExternalLink, Github, User } from 'lucide-react'
import { Project, NewProject } from '@/db/types'
import {
    useUpdateProject,
    useDeleteProject,
    useAddProject,
} from '@/hooks/useProjects'

interface ProjectCardProps {
    project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState<Partial<Project>>({
        name: project.name,
        author: project.author,
        description: project.description,
        liveLink: project.liveLink,
        githubUrl: project.githubUrl,
        projectBannerUrl: project.projectBannerUrl,
    })

    const updateMutation = useUpdateProject()
    const deleteMutation = useDeleteProject()

    const handleEdit = () => {
        updateMutation.mutate(
            { id: project.id, project: editData },
            {
                onSuccess: () => setIsEditOpen(false),
            }
        )
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project?')) {
            deleteMutation.mutate(project.id)
        }
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center text-sm">
                        <User className="mr-1 h-4 w-4" />
                        {project.author}
                    </div>
                </div>
                <CardTitle className="text-foreground">
                    {project.name}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {project.projectBannerUrl && (
                    <div className="mb-3">
                        <img
                            src={project.projectBannerUrl}
                            alt={project.name}
                            className="border-border h-32 w-full rounded-md border object-cover"
                        />
                    </div>
                )}
                <p className="text-muted-foreground text-sm">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {project.liveLink && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-primary hover:text-primary"
                        >
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="mr-1 h-4 w-4" />
                                Live Demo
                            </a>
                        </Button>
                    )}
                    {project.githubUrl && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-foreground"
                        >
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="mr-1 h-4 w-4" />
                                Source Code
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-foreground"
                        >
                            <Pencil className="mr-1 h-4 w-4" />
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">
                                Edit Project
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="text-foreground"
                                >
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={editData.name || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="author"
                                    className="text-foreground"
                                >
                                    Author
                                </Label>
                                <Input
                                    id="author"
                                    value={editData.author || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            author: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="description"
                                    className="text-foreground"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={editData.description || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="liveLink"
                                    className="text-foreground"
                                >
                                    Live Link
                                </Label>
                                <Input
                                    id="liveLink"
                                    value={editData.liveLink || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            liveLink: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="githubUrl"
                                    className="text-foreground"
                                >
                                    GitHub URL
                                </Label>
                                <Input
                                    id="githubUrl"
                                    value={editData.githubUrl || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            githubUrl: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="projectBannerUrl"
                                    className="text-foreground"
                                >
                                    Project Banner URL
                                </Label>
                                <Input
                                    id="projectBannerUrl"
                                    value={editData.projectBannerUrl || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            projectBannerUrl: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleEdit}
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending
                                        ? 'Saving...'
                                        : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    )
}

export function AddProjectCard() {
    const [isOpen, setIsOpen] = useState(false)
    const [newProject, setNewProject] = useState<NewProject>({
        name: '',
        author: '',
        description: '',
        liveLink: null,
        githubUrl: null,
        projectBannerUrl: null,
    })

    const addMutation = useAddProject()

    const handleAdd = () => {
        addMutation.mutate(newProject, {
            onSuccess: () => {
                setIsOpen(false)
                setNewProject({
                    name: '',
                    author: '',
                    description: '',
                    liveLink: null,
                    githubUrl: null,
                    projectBannerUrl: null,
                })
            },
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Card className="bg-card border-border hover:bg-accent/50 cursor-pointer border-dashed transition-colors">
                    <CardContent className="flex h-40 flex-col items-center justify-center space-y-2">
                        <Plus className="text-muted-foreground h-8 w-8" />
                        <p className="text-muted-foreground">Add Project</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        Add New Project
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="new-name" className="text-foreground">
                            Name
                        </Label>
                        <Input
                            id="new-name"
                            value={newProject.name}
                            onChange={(e) =>
                                setNewProject({
                                    ...newProject,
                                    name: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label htmlFor="new-author" className="text-foreground">
                            Author
                        </Label>
                        <Input
                            id="new-author"
                            value={newProject.author}
                            onChange={(e) =>
                                setNewProject({
                                    ...newProject,
                                    author: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-description"
                            className="text-foreground"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="new-description"
                            value={newProject.description}
                            onChange={(e) =>
                                setNewProject({
                                    ...newProject,
                                    description: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-liveLink"
                            className="text-foreground"
                        >
                            Live Link
                        </Label>
                        <Input
                            id="new-liveLink"
                            value={newProject.liveLink || ''}
                            onChange={(e) =>
                                setNewProject({
                                    ...newProject,
                                    liveLink: e.target.value || null,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-githubUrl"
                            className="text-foreground"
                        >
                            GitHub URL
                        </Label>
                        <Input
                            id="new-githubUrl"
                            value={newProject.githubUrl || ''}
                            onChange={(e) =>
                                setNewProject({
                                    ...newProject,
                                    githubUrl: e.target.value || null,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-projectBannerUrl"
                            className="text-foreground"
                        >
                            Project Banner URL
                        </Label>
                        <Input
                            id="new-projectBannerUrl"
                            value={newProject.projectBannerUrl || ''}
                            onChange={(e) =>
                                setNewProject({
                                    ...newProject,
                                    projectBannerUrl: e.target.value || null,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAdd}
                            disabled={addMutation.isPending}
                        >
                            {addMutation.isPending
                                ? 'Adding...'
                                : 'Add Project'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

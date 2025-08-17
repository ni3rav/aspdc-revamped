'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { NewProject, Project } from '@/db/types'

interface ProjectFormProps {
    onSubmit: (data: NewProject) => void
    isLoading?: boolean
    initialData?: Project
    submitLabel?: string
}

export function ProjectForm({
    onSubmit,
    isLoading,
    initialData,
    submitLabel = 'Submit',
}: ProjectFormProps) {
    const [formData, setFormData] = useState<NewProject>({
        name: initialData?.name ?? '',
        author: initialData?.author ?? '',
        description: initialData?.description ?? '',
        live_link: initialData?.live_link ?? '',
        github_url: initialData?.github_url ?? '',
        project_banner_url: initialData?.project_banner_url ?? '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    required
                />
            </div>

            <div>
                <Label htmlFor="author">Author</Label>
                <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            author: e.target.value,
                        }))
                    }
                    required
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
                    }
                    required
                />
            </div>

            <div>
                <Label htmlFor="live_link">Live Link</Label>
                <Input
                    id="live_link"
                    type="url"
                    value={formData?.live_link ?? ''}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            live_link: e.target.value,
                        }))
                    }
                />
            </div>

            <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                    id="github_url"
                    type="url"
                    value={formData?.github_url ?? ''}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            github_url: e.target.value,
                        }))
                    }
                />
            </div>

            <div>
                <Label htmlFor="project_banner_url">Banner Image URL</Label>
                <Input
                    id="project_banner_url"
                    type="url"
                    value={formData?.project_banner_url ?? ''}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            project_banner_url: e.target.value,
                        }))
                    }
                />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Submitting...' : submitLabel}
            </Button>
        </form>
    )
}

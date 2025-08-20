'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Project } from '@/db/types'

interface ProjectFormProps {
    // ✅ accepts Partial<Project> instead of NewProject
    // because update only needs changed fields, not a full project
    onSubmit: (data: Partial<Project>) => void
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
    const [formData, setFormData] = useState<Partial<Project>>({
        name: initialData?.name ?? '',
        author: initialData?.author ?? '',
        description: initialData?.description ?? '',
        liveLink: initialData?.liveLink ?? '',
        githubUrl: initialData?.githubUrl ?? '',
        projectBannerUrl: initialData?.projectBannerUrl ?? '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // ✅ Clean out empty strings & undefined
        // so DB only updates provided fields
        const cleaned = Object.fromEntries(
            Object.entries(formData).filter(
                ([_, v]) => v !== '' && v !== undefined
            )
        )

        onSubmit(cleaned)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                    id="name"
                    value={formData.name ?? ''}
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
                    value={formData.author ?? ''}
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
                    value={formData.description ?? ''}
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
                <Label htmlFor="liveLink">Live Link</Label>
                <Input
                    id="liveLink"
                    type="url"
                    value={formData.liveLink ?? ''}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            liveLink: e.target.value,
                        }))
                    }
                />
            </div>

            <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                    id="githubUrl"
                    type="url"
                    value={formData.githubUrl ?? ''}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            githubUrl: e.target.value,
                        }))
                    }
                />
            </div>

            <div>
                <Label htmlFor="projectBannerUrl">Banner Image URL</Label>
                <Input
                    id="projectBannerUrl"
                    type="url"
                    value={formData.projectBannerUrl ?? ''}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            projectBannerUrl: e.target.value,
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

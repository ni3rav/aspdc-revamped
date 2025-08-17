'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DialogFooter } from '@/components/ui/dialog'
import type { Blog, NewBlog } from '@/db/types'

interface BlogFormProps {
    onSubmit: (data: NewBlog | Partial<Blog>) => void
    isLoading: boolean
    initialData?: Blog
    submitLabel?: string
}

export function BlogForm({
    onSubmit,
    isLoading,
    initialData,
    submitLabel = 'Save',
}: BlogFormProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        author: initialData?.author || '',
        link: initialData?.link || '',
        publish_date: initialData?.publish_date || '',
        cover_image: initialData?.cover_image || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter blog title"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="Enter author name"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="link">Link</Label>
                <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => handleChange('link', e.target.value)}
                    placeholder="https://example.com/blog-post"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="publish_date">Publish Date</Label>
                <Input
                    id="publish_date"
                    type="date"
                    value={formData.publish_date}
                    onChange={(e) =>
                        handleChange('publish_date', e.target.value)
                    }
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input
                    id="cover_image"
                    type="url"
                    value={formData.cover_image}
                    onChange={(e) =>
                        handleChange('cover_image', e.target.value)
                    }
                    placeholder="https://example.com/image.jpg (optional)"
                />
            </div>

            <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    )
}

'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { NewEvent, Event } from '@/supabase/types'

interface EventFormProps {
    onSubmit: (data: NewEvent) => void
    isLoading?: boolean
    initialData?: Event
    submitLabel?: string
}

export function EventForm({
    onSubmit,
    isLoading,
    initialData,
    submitLabel = 'Submit',
}: EventFormProps) {
    const [formData, setFormData] = useState<NewEvent>({
        name: initialData?.name || '',
        date: initialData?.date || '',
        details: initialData?.details || '',
        image_urls: initialData?.image_urls || [],
    })

    const [imageUrlInput, setImageUrlInput] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const addImageUrl = () => {
        if (imageUrlInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                image_urls: [...prev.image_urls, imageUrlInput.trim()],
            }))
            setImageUrlInput('')
        }
    }

    const removeImageUrl = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, i) => i !== index),
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Event Name</Label>
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
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            date: e.target.value,
                        }))
                    }
                    required
                />
            </div>

            <div>
                <Label htmlFor="details">Details</Label>
                <Textarea
                    id="details"
                    value={formData.details}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            details: e.target.value,
                        }))
                    }
                    required
                />
            </div>

            <div>
                <Label>Image URLs</Label>
                <div className="mb-2 flex gap-2">
                    <Input
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Enter image URL"
                    />
                    <Button
                        type="button"
                        onClick={addImageUrl}
                        variant="outline"
                    >
                        Add
                    </Button>
                </div>
                {formData.image_urls.map((url, index) => (
                    <div key={index} className="mb-1 flex items-center gap-2">
                        <span className="flex-1 truncate text-sm">{url}</span>
                        <Button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            variant="destructive"
                            size="sm"
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Submitting...' : submitLabel}
            </Button>
        </form>
    )
}

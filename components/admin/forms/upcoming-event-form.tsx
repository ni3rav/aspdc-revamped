'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DialogFooter } from '@/components/ui/dialog'
import type { UpcomingEvent, NewUpcomingEvent } from '@/db/types'

interface UpcomingEventFormProps {
    onSubmit: (data: NewUpcomingEvent | Partial<UpcomingEvent>) => void
    isLoading: boolean
    initialData?: UpcomingEvent
    submitLabel?: string
}

export function UpcomingEventForm({
    onSubmit,
    isLoading,
    initialData,
    submitLabel = 'Save',
}: UpcomingEventFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        date: initialData?.date || '',
        description: initialData?.description || '',
        location: initialData?.location || '',
        registration_link: initialData?.registration_link || '',
        event_image_url: initialData?.event_image_url || '',
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
                <Label htmlFor="name">Event Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter event name"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                        handleChange('description', e.target.value)
                    }
                    placeholder="Describe the upcoming event"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Event location (optional)"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="registration_link">Registration Link</Label>
                <Input
                    id="registration_link"
                    type="url"
                    value={formData.registration_link}
                    onChange={(e) =>
                        handleChange('registration_link', e.target.value)
                    }
                    placeholder="https://example.com/register (optional)"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="event_image_url">Event Image URL</Label>
                <Input
                    id="event_image_url"
                    type="url"
                    value={formData.event_image_url}
                    onChange={(e) =>
                        handleChange('event_image_url', e.target.value)
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

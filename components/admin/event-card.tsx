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
import { Pencil, Trash2, Plus, Calendar, ImageIcon } from 'lucide-react'
import { Event, NewEvent } from '@/db/types'
import { useUpdateEvent, useDeleteEvent, useAddEvent } from '@/hooks/useEvents'

interface EventCardProps {
    event: Event
}

export function EventCard({ event }: EventCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState<Partial<Event>>({
        name: event.name,
        date: event.date,
        details: event.details,
        imageUrls: event.imageUrls,
    })

    const updateMutation = useUpdateEvent()
    const deleteMutation = useDeleteEvent()

    const handleEdit = () => {
        updateMutation.mutate(
            { id: event.id, event: editData },
            {
                onSuccess: () => setIsEditOpen(false),
            }
        )
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this event?')) {
            deleteMutation.mutate(event.id)
        }
    }

    const handleImageUrlsChange = (value: string) => {
        const urls = value
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url)
        setEditData({ ...editData, imageUrls: urls })
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center text-sm">
                        <Calendar className="mr-1 h-4 w-4" />
                        {event.date instanceof Date
                            ? event.date.toLocaleDateString()
                            : new Date(event.date).toLocaleDateString()}
                    </div>
                    {event.imageUrls.length > 0 && (
                        <div className="text-muted-foreground flex items-center text-sm">
                            <ImageIcon className="mr-1 h-4 w-4" />
                            {event.imageUrls.length} image
                            {event.imageUrls.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
                <CardTitle className="text-foreground">{event.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">{event.details}</p>
                {event.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {event.imageUrls.slice(0, 4).map((url, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={url}
                                    alt={`${event.name} ${index + 1}`}
                                    className="border-border h-20 w-full rounded-md border object-cover"
                                />
                                {index === 3 && event.imageUrls.length > 4 && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
                                        <span className="text-sm text-white">
                                            +{event.imageUrls.length - 4} more
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
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
                                Edit Event
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
                                    htmlFor="date"
                                    className="text-foreground"
                                >
                                    Date
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={
                                        editData.date
                                            ? (() => {
                                                  const dateObj =
                                                      editData.date instanceof
                                                      Date
                                                          ? editData.date
                                                          : new Date(
                                                                editData.date as string
                                                            )
                                                  return !isNaN(
                                                      dateObj.getTime()
                                                  )
                                                      ? dateObj
                                                            .toISOString()
                                                            .split('T')[0]
                                                      : ''
                                              })()
                                            : ''
                                    }
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            date: new Date(e.target.value),
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="details"
                                    className="text-foreground"
                                >
                                    Details
                                </Label>
                                <Textarea
                                    id="details"
                                    value={editData.details || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            details: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="imageUrls"
                                    className="text-foreground"
                                >
                                    Image URLs (comma-separated)
                                </Label>
                                <Textarea
                                    id="imageUrls"
                                    value={editData.imageUrls?.join(', ') || ''}
                                    onChange={(e) =>
                                        handleImageUrlsChange(e.target.value)
                                    }
                                    className="bg-background border-border text-foreground"
                                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
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

export function AddEventCard() {
    const [isOpen, setIsOpen] = useState(false)
    const [newEvent, setNewEvent] = useState<NewEvent>({
        name: '',
        date: new Date(),
        details: '',
        imageUrls: [],
    })

    const addMutation = useAddEvent()

    const handleAdd = () => {
        addMutation.mutate(newEvent, {
            onSuccess: () => {
                setIsOpen(false)
                setNewEvent({
                    name: '',
                    date: new Date(),
                    details: '',
                    imageUrls: [],
                })
            },
        })
    }

    const handleImageUrlsChange = (value: string) => {
        const urls = value
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url)
        setNewEvent({ ...newEvent, imageUrls: urls })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Card className="bg-card border-border hover:bg-accent/50 cursor-pointer border-dashed transition-colors">
                    <CardContent className="flex h-40 flex-col items-center justify-center space-y-2">
                        <Plus className="text-muted-foreground h-8 w-8" />
                        <p className="text-muted-foreground">Add Event</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        Add New Event
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="new-name" className="text-foreground">
                            Name
                        </Label>
                        <Input
                            id="new-name"
                            value={newEvent.name}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    name: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label htmlFor="new-date" className="text-foreground">
                            Date
                        </Label>
                        <Input
                            id="new-date"
                            type="date"
                            value={newEvent.date.toISOString().split('T')[0]}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    date: new Date(e.target.value),
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-details"
                            className="text-foreground"
                        >
                            Details
                        </Label>
                        <Textarea
                            id="new-details"
                            value={newEvent.details}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    details: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-imageUrls"
                            className="text-foreground"
                        >
                            Image URLs (comma-separated)
                        </Label>
                        <Textarea
                            id="new-imageUrls"
                            value={newEvent.imageUrls.join(', ')}
                            onChange={(e) =>
                                handleImageUrlsChange(e.target.value)
                            }
                            className="bg-background border-border text-foreground"
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
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
                            {addMutation.isPending ? 'Adding...' : 'Add Event'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

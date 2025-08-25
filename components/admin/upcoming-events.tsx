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
import {
    Pencil,
    Trash2,
    Plus,
    Calendar,
    MapPin,
    ExternalLink,
} from 'lucide-react'
import { UpcomingEvent, NewUpcomingEvent } from '@/db/types'
import {
    useUpdateUpcomingEvent,
    useDeletUpcomingEvent,
    useAddUpcomingEvent,
} from '@/hooks/useUpcomingEvents'

interface UpcomingEventCardProps {
    event: UpcomingEvent
}

export function UpcomingEventCard({ event }: UpcomingEventCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState<Partial<UpcomingEvent>>({
        name: event.name,
        date: event.date,
        description: event.description,
        location: event.location,
        registrationLink: event.registrationLink,
        eventImageUrl: event.eventImageUrl,
    })

    const updateMutation = useUpdateUpcomingEvent()
    const deleteMutation = useDeletUpcomingEvent()

    const handleEdit = () => {
        updateMutation.mutate(
            { id: event.id, event: editData },
            {
                onSuccess: () => setIsEditOpen(false),
            }
        )
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this upcoming event?')) {
            deleteMutation.mutate(event.id)
        }
    }

    const isEventSoon = () => {
        const now = new Date()
        const eventDate = new Date(event.date)
        const diffTime = eventDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 7 && diffDays >= 0
    }

    return (
        <Card
            className={`bg-card border-border ${isEventSoon() ? 'border-primary' : ''}`}
        >
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <div className="text-muted-foreground flex items-center text-sm">
                        <Calendar className="mr-1 h-4 w-4" />
                        {(event.date instanceof Date
                            ? event.date
                            : new Date(event.date)
                        ).toLocaleDateString()}
                        {isEventSoon() && (
                            <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-1 text-xs">
                                Soon
                            </span>
                        )}
                    </div>
                </div>
                <CardTitle className="text-foreground">{event.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {event.eventImageUrl && (
                    <div className="mb-3">
                        <img
                            src={event.eventImageUrl}
                            alt={event.name}
                            className="border-border h-32 w-full rounded-md border object-cover"
                        />
                    </div>
                )}
                <p className="text-muted-foreground text-sm">
                    {event.description}
                </p>
                {event.location && (
                    <div className="text-muted-foreground flex items-center text-sm">
                        <MapPin className="mr-1 h-4 w-4" />
                        {event.location}
                    </div>
                )}
                {event.registrationLink && (
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-primary hover:text-primary w-fit"
                    >
                        <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            Register Now
                        </a>
                    </Button>
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
                                Edit Upcoming Event
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
                                            ? editData.date instanceof Date
                                                ? editData.date
                                                      .toISOString()
                                                      .split('T')[0]
                                                : new Date(
                                                      editData.date as string
                                                  )
                                                      .toISOString()
                                                      .split('T')[0]
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
                                    htmlFor="location"
                                    className="text-foreground"
                                >
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    value={editData.location || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            location: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="registrationLink"
                                    className="text-foreground"
                                >
                                    Registration Link
                                </Label>
                                <Input
                                    id="registrationLink"
                                    value={editData.registrationLink || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            registrationLink: e.target.value,
                                        })
                                    }
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="eventImageUrl"
                                    className="text-foreground"
                                >
                                    Event Image URL
                                </Label>
                                <Input
                                    id="eventImageUrl"
                                    value={editData.eventImageUrl || ''}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            eventImageUrl: e.target.value,
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

export function AddUpcomingEventCard() {
    const [isOpen, setIsOpen] = useState(false)
    const [newEvent, setNewEvent] = useState<NewUpcomingEvent>({
        name: '',
        date: new Date(),
        description: '',
        location: null,
        registrationLink: null,
        eventImageUrl: null,
    })

    const addMutation = useAddUpcomingEvent()

    const handleAdd = () => {
        addMutation.mutate(newEvent, {
            onSuccess: () => {
                setIsOpen(false)
                setNewEvent({
                    name: '',
                    date: new Date(),
                    description: '',
                    location: null,
                    registrationLink: null,
                    eventImageUrl: null,
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
                        <p className="text-muted-foreground">
                            Add Upcoming Event
                        </p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        Add New Upcoming Event
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
                            htmlFor="new-description"
                            className="text-foreground"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="new-description"
                            value={newEvent.description}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    description: e.target.value,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-location"
                            className="text-foreground"
                        >
                            Location
                        </Label>
                        <Input
                            id="new-location"
                            value={newEvent.location || ''}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    location: e.target.value || null,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-registrationLink"
                            className="text-foreground"
                        >
                            Registration Link
                        </Label>
                        <Input
                            id="new-registrationLink"
                            value={newEvent.registrationLink || ''}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    registrationLink: e.target.value || null,
                                })
                            }
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="new-eventImageUrl"
                            className="text-foreground"
                        >
                            Event Image URL
                        </Label>
                        <Input
                            id="new-eventImageUrl"
                            value={newEvent.eventImageUrl || ''}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    eventImageUrl: e.target.value || null,
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
                                : 'Add Upcoming Event'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

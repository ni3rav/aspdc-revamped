'use client'
import { AddEventCard, EventCard } from '@/components/admin/event-card'
import { useEvents } from '@/hooks/useEvents'

export default function EventsPage() {
    const { data: events, isLoading, error } = useEvents()

    if (isLoading)
        return (
            <div className="text-muted-foreground text-center">
                Loading events...
            </div>
        )
    if (error)
        return (
            <div className="text-destructive text-center">
                Error loading events
            </div>
        )

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-foreground mb-8 text-3xl font-bold">
                Past Events
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Add new event card */}
                <AddEventCard />

                {/* Display existing events */}
                {events?.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {events?.length === 0 && (
                <p className="text-muted-foreground mt-8 text-center">
                    No events yet. Add your first event!
                </p>
            )}
        </div>
    )
}

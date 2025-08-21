'use client'
import {
    UpcomingEventCard,
    AddUpcomingEventCard,
} from '@/components/admin/upcoming-events'
import { useUpcomingEvents } from '@/hooks/useUpcomingEvents'

export default function UpcomingEventsPage() {
    const { data: upcomingEvents, isLoading, error } = useUpcomingEvents()

    if (isLoading)
        return (
            <div className="text-muted-foreground text-center">
                Loading upcoming events...
            </div>
        )
    if (error)
        return (
            <div className="text-destructive text-center">
                Error loading upcoming events
            </div>
        )

    // Filter events - show upcoming first, then past
    const now = new Date()
    const futureEvents =
        upcomingEvents?.filter((event) => new Date(event.date) >= now) || []
    const pastEvents =
        upcomingEvents?.filter((event) => new Date(event.date) < now) || []

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-foreground mb-8 text-3xl font-bold">
                Upcoming Events
            </h1>

            {/* Upcoming Events Section */}
            {futureEvents.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-foreground mb-6 text-2xl font-semibold">
                        Coming Soon
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {futureEvents.map((event) => (
                            <UpcomingEventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            )}

            {/* Add new event and past events */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Add new upcoming event card */}
                <AddUpcomingEventCard />

                {/* Past events with muted styling */}
                {pastEvents.map((event) => (
                    <div key={event.id} className="opacity-60">
                        <UpcomingEventCard event={event} />
                    </div>
                ))}
            </div>

            {upcomingEvents?.length === 0 && (
                <p className="text-muted-foreground mt-8 text-center">
                    No upcoming events yet. Schedule your first event!
                </p>
            )}
        </div>
    )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchEvents } from '@/db/queries'
import { addEvent, deleteEvent, updateEvent } from '@/db/mutations'
import { toast } from 'sonner'
import { NewEvent, Event } from '@/db/types'

export function useEvents() {
    return useQuery({
        queryKey: ['fetch-events'],
        queryFn: fetchEvents,
    })
}

export function useAddEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (event: NewEvent) => addEvent(event),
        onSuccess: () => {
            toast.success('Event added successfully')
            queryClient.invalidateQueries({ queryKey: ['fetch-events'] })
        },
        onError: () => {
            toast.error('Failed to add event')
        },
    })
}

export function useUpdateEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, event }: { id: string; event: Partial<Event> }) => {
            const formattedEvent: Partial<Event> = {
                ...event,
                ...(event.date && { date: new Date(event.date) }),
            }
            return updateEvent(id, formattedEvent)
        },
        onSuccess: () => {
            toast.success('Event updated successfully')
            queryClient.invalidateQueries({ queryKey: ['fetch-events'] })
        },
        onError: (error: Error) => {
            toast.error('Failed to update event')
            console.error('Error updating event:', error.message)
        },
    })
}

export function useDeleteEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteEvent(id),
        onSuccess: () => {
            toast.success('event deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['fetch-events'] })
        },
        onError: (error: Error) => {
            toast.error('Failed to delete blog')
            console.error('Error deleting blog:', error.message)
        },
    })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchUpcomingEvents } from '@/db/queries'
import {
    addUpcomingEvent,
    deleteUpcomingEvent,
    updateUpcomingEvent,
} from '@/db/mutations'
import { toast } from 'sonner'
import { NewUpcomingEvent, UpcomingEvent } from '@/db/types'

export function useUpcomingEvents() {
    return useQuery({
        queryKey: ['fetch-upcoming-events'],
        queryFn: fetchUpcomingEvents,
    })
}

export function useAddUpcomingEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (event: NewUpcomingEvent) => addUpcomingEvent(event),
        onSuccess: () => {
            toast.success('Upcoming event added successfully')
            queryClient.invalidateQueries({
                queryKey: ['fetch-upcoming-events'],
            })
        },
        onError: () => {
            toast.error('Failed to add upcoming event')
        },
    })
}

export function useUpdateUpcomingEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            event,
        }: {
            id: string
            event: Partial<UpcomingEvent>
        }) => updateUpcomingEvent(id, event),
        onSuccess: () => {
            toast.success('upcoming event updated successfully')
            queryClient.invalidateQueries({
                queryKey: ['fetch-upcoming-events'],
            })
        },
        onError: (error: Error) => {
            toast.error('Failed to update upcoming event')
            console.error('Error updating upcoming event:', error.message)
        },
    })
}

export function useDeletUpcomingEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteUpcomingEvent(id),
        onSuccess: () => {
            toast.success('upcoming event deleted successfully')
            queryClient.invalidateQueries({
                queryKey: ['fetch-upcoming-events'],
            })
        },
        onError: (error: Error) => {
            toast.error('Failed to delete upcoming event')
            console.error('Error deleting upcoming event:', error.message)
        },
    })
}

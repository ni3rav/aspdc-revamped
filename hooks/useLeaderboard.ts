import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchLeaderboard } from '@/db/queries'
import {
    addLeaderboardEntry,
    deleteLeaderboardEntry,
    updateLeaderboardEntry,
} from '@/db/mutations'
import { toast } from 'sonner'
import { LeaderboardEntry, NewLeaderboardEntry } from '@/db/types'

export function useLeaderboard() {
    return useQuery({
        queryKey: ['fetch-leaderboard'],
        queryFn: fetchLeaderboard,
    })
}

export function useAddLeaderboardEntry() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (entry: NewLeaderboardEntry) => addLeaderboardEntry(entry),
        onSuccess: () => {
            toast.success('Leaderboard entry added successfully')
            queryClient.invalidateQueries({ queryKey: ['fetch-leaderboard'] })
        },
        onError: () => {
            toast.error('Failed to add leaderboard entry')
        },
    })
}

export function useUpdateLeaderBoardEntry() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            leaderBoardEntry,
        }: {
            id: string
            leaderBoardEntry: Partial<LeaderboardEntry>
        }) => updateLeaderboardEntry(id, leaderBoardEntry),
        onSuccess: () => {
            toast.success('leaderboard-entry updated successfully')
            queryClient.invalidateQueries({ queryKey: ['fetch-leaderboard'] })
        },
        onError: (error: Error) => {
            toast.error('Failed to update leaderboard-entry')
            console.error('Error updating leaderboard-entry:', error.message)
        },
    })
}

export function useDeleteLeaderboardEntry() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteLeaderboardEntry(id),
        onSuccess: () => {
            toast.success('leaderboard-entry deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['fetch-leaderboard'] })
        },
        onError: (error: Error) => {
            toast.error('Failed to delete leaderboard-entry')
            console.error('Error deleting leaderboard-entry:', error.message)
        },
    })
}

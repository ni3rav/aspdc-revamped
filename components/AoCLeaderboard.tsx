'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

interface Member {
    id: number
    name: string
    stars: number
    local_score: number
    last_star_ts: number
    completion_day_level: Record<
        string,
        Record<string, { get_star_ts: number; star_index: number }>
    >
}

interface LeaderboardData {
    event: string
    owner_id: number
    num_days: number
    day1_ts: number
    members: Record<string, Member>
}

interface AoCLeaderboardProps {
    data: LeaderboardData | null
}

const AoCLeaderboard = ({ data }: AoCLeaderboardProps) => {
    const [sortedMembers, setSortedMembers] = useState<Member[]>([])

    useEffect(() => {
        if (!data) return

        const members = Object.values(data.members)
        const sorted = members.sort((a, b) => {
            // Sort by local_score first (descending)
            if (b.local_score !== a.local_score) {
                return b.local_score - a.local_score
            }
            // Then by stars (descending)
            if (b.stars !== a.stars) {
                return b.stars - a.stars
            }
            // Then by last star timestamp (ascending - earlier is better)
            return a.last_star_ts - b.last_star_ts
        })

        setSortedMembers(sorted)
    }, [data])

    if (!data) {
        return (
            <Card className="bg-card/50 border-destructive/20 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                    <span className="mb-4 text-7xl">⚠️</span>
                    <h2 className="text-3xl font-bold text-neutral-100">
                        Unable to Load Leaderboard
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Please try again later or check your connection.
                    </p>
                </CardContent>
            </Card>
        )
    }

    if (sortedMembers.length === 0) {
        return (
            <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                    <span className="mb-4 text-7xl">🎄</span>
                    <h2 className="text-3xl font-bold text-neutral-100">
                        No Participants Yet
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Be the first to join and start solving!
                    </p>
                </CardContent>
            </Card>
        )
    }

    const getMedalEmoji = (position: number) => {
        if (position === 1) return '🥇'
        if (position === 2) return '🥈'
        if (position === 3) return '🥉'
        return position.toString()
    }

    const formatLastStar = (timestamp: number) => {
        if (timestamp === 0) return 'No stars yet'
        const date = new Date(timestamp * 1000)
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata',
        })
    }

    const getCompletedDays = (
        completionDayLevel: Member['completion_day_level']
    ) => {
        return Object.keys(completionDayLevel).length
    }

    const getStarProgress = (
        completionDayLevel: Member['completion_day_level']
    ) => {
        const days = Object.entries(completionDayLevel)
        return days.map(([day, parts]) => ({
            day: parseInt(day),
            stars: Object.keys(parts).length,
        }))
    }

    return (
        <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2 text-2xl">
                    <span>⭐</span>
                    <span>Current Standings</span>
                    <Badge variant="outline" className="ml-auto text-sm">
                        {sortedMembers.length} participants
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Desktop View */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                        <thead>
                            <tr className="border-primary/20 border-b">
                                <th className="text-muted-foreground p-3 text-left font-semibold">
                                    Rank
                                </th>
                                <th className="text-muted-foreground p-3 text-left font-semibold">
                                    Name
                                </th>
                                <th className="text-muted-foreground p-3 text-center font-semibold">
                                    Score
                                </th>
                                <th className="text-muted-foreground p-3 text-center font-semibold">
                                    Stars
                                </th>
                                <th className="text-muted-foreground p-3 text-center font-semibold">
                                    Days
                                </th>
                                <th className="text-muted-foreground p-3 text-left font-semibold">
                                    Last Star
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMembers.map((member, index) => {
                                const position = index + 1
                                const completedDays = getCompletedDays(
                                    member.completion_day_level
                                )

                                return (
                                    <tr
                                        key={member.id}
                                        className="border-border/50 hover:bg-primary/5 border-b transition-colors"
                                    >
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold">
                                                    {getMedalEmoji(position)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-foreground font-medium">
                                                {member.name ||
                                                    `Anonymous ${member.id}`}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <Badge
                                                variant={
                                                    member.local_score > 0
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {member.local_score}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="text-yellow-400">
                                                    ⭐
                                                </span>
                                                <span className="text-foreground font-semibold">
                                                    {member.stars}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span
                                                className={`font-medium ${completedDays > 0 ? 'text-primary' : 'text-muted-foreground'}`}
                                            >
                                                {completedDays}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-muted-foreground text-sm">
                                                {formatLastStar(
                                                    member.last_star_ts
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="space-y-3 md:hidden">
                    {sortedMembers.map((member, index) => {
                        const position = index + 1
                        const completedDays = getCompletedDays(
                            member.completion_day_level
                        )

                        return (
                            <div
                                key={member.id}
                                className="bg-background/50 border-border/50 space-y-2 rounded-lg border p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">
                                            {getMedalEmoji(position)}
                                        </span>
                                        <span className="text-foreground font-semibold">
                                            {member.name ||
                                                `Anonymous ${member.id}`}
                                        </span>
                                    </div>
                                    <Badge
                                        variant={
                                            member.local_score > 0
                                                ? 'default'
                                                : 'outline'
                                        }
                                    >
                                        {member.local_score} pts
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">
                                                ⭐
                                            </span>
                                            <span className="text-foreground font-semibold">
                                                {member.stars}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            <span
                                                className={
                                                    completedDays > 0
                                                        ? 'text-primary font-medium'
                                                        : ''
                                                }
                                            >
                                                {completedDays}
                                            </span>{' '}
                                            days
                                        </div>
                                    </div>
                                </div>

                                {member.last_star_ts > 0 && (
                                    <div className="text-muted-foreground text-xs">
                                        Last:{' '}
                                        {formatLastStar(member.last_star_ts)}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Footer Info */}
                <div className="border-border/50 text-muted-foreground mt-6 border-t pt-4 text-center text-sm">
                    <p>
                        Leaderboard updates every 15 minutes • Event:{' '}
                        {data.event} • {data.num_days} Days
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default AoCLeaderboard

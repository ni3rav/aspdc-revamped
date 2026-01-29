'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface LeaderboardData {
    id: string
    fullName: string
    codeforcesHandle: string
    rating: number
    rank: string
    maxRating?: number
}

interface LeaderboardTableProps {
    data: LeaderboardData[]
}

function getRankBadgeVariant(
    rank: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
    const lowerRank = rank.toLowerCase()
    if (lowerRank.includes('grandmaster') || lowerRank.includes('legendary'))
        return 'destructive'
    if (lowerRank.includes('master') || lowerRank.includes('candidate'))
        return 'default'
    return 'secondary'
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px] text-center">
                            Rank
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Codeforces Handle</TableHead>
                        <TableHead className="text-center">Rating</TableHead>
                        <TableHead className="text-center">
                            Max Rating
                        </TableHead>
                        <TableHead>CF Rank</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-muted-foreground h-32 text-center"
                            >
                                No users registered yet. Be the first to join!
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((user, index) => (
                            <TableRow
                                key={user.id}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                <TableCell className="text-center font-bold">
                                    {index === 0 && '🥇'}
                                    {index === 1 && '🥈'}
                                    {index === 2 && '🥉'}
                                    {index > 2 && index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {user.fullName}
                                </TableCell>
                                <TableCell>
                                    <a
                                        href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        {user.codeforcesHandle}
                                    </a>
                                </TableCell>
                                <TableCell className="text-center font-semibold">
                                    {user.rating || (
                                        <span className="text-muted-foreground">
                                            Unrated
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-center">
                                    {user.maxRating || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={getRankBadgeVariant(user.rank)}
                                    >
                                        {user.rank}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

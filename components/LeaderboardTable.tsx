'use client'

import { useState, useMemo } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LeaderboardData {
    id: string
    fullName: string
    codeforcesHandle: string | null
    rating: number
    rank: string
    maxRating?: number
}

interface LeaderboardTableProps {
    data: LeaderboardData[]
}

type SortField = 'rating' | 'maxRating' | 'name'
type SortOrder = 'asc' | 'desc'

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
    const [sortField, setSortField] = useState<SortField>('rating')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    const sortedData = useMemo(() => {
        const sorted = [...data].sort((a, b) => {
            let aVal: number | string
            let bVal: number | string

            switch (sortField) {
                case 'rating':
                    aVal = a.rating || 0
                    bVal = b.rating || 0
                    break
                case 'maxRating':
                    aVal = a.maxRating || 0
                    bVal = b.maxRating || 0
                    break
                case 'name':
                    aVal = a.fullName.toLowerCase()
                    bVal = b.fullName.toLowerCase()
                    break
                default:
                    return 0
            }

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortOrder === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal)
            }

            return sortOrder === 'asc'
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number)
        })

        return sorted
    }, [data, sortField, sortOrder])

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('desc')
        }
    }

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
        return sortOrder === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
        )
    }

    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px] text-center">
                            Rank
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="-ml-3 h-8 hover:bg-transparent"
                                onClick={() => toggleSort('name')}
                            >
                                Name
                                <SortIcon field="name" />
                            </Button>
                        </TableHead>
                        <TableHead>Codeforces Handle</TableHead>
                        <TableHead className="text-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="-ml-3 h-8 hover:bg-transparent"
                                onClick={() => toggleSort('rating')}
                            >
                                Rating
                                <SortIcon field="rating" />
                            </Button>
                        </TableHead>
                        <TableHead className="text-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="-ml-3 h-8 hover:bg-transparent"
                                onClick={() => toggleSort('maxRating')}
                            >
                                Max Rating
                                <SortIcon field="maxRating" />
                            </Button>
                        </TableHead>
                        <TableHead>CF Rank</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-muted-foreground h-32 text-center"
                            >
                                No users registered yet. Be the first to join!
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedData.map((user, index) => (
                            <TableRow
                                key={user.id}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                <TableCell className="text-center font-bold">
                                    {index + 1}
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

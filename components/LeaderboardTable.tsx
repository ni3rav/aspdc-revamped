'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

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

export function LeaderboardTable({ data }: LeaderboardTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Codeforces Handle</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Max Rating</TableHead>
                    <TableHead>CF Rank</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">
                            No users registered yet
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((user, index) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {index + 1}
                            </TableCell>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>
                                <a
                                    href={`https://codeforces.com/profile/${user.codeforcesHandle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {user.codeforcesHandle}
                                </a>
                            </TableCell>
                            <TableCell>{user.rating || 'Unrated'}</TableCell>
                            <TableCell>{user.maxRating || 'N/A'}</TableCell>
                            <TableCell>{user.rank}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}

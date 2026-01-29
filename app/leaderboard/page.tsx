import { fetchLeaderboardUsers } from '@/db/queries'
import { getMultipleCodeforcesUsers } from '@/lib/codeforces'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { RegisterForm } from '@/components/RegisterForm'
import type { LeaderboardUser } from '@/db/types'

export default async function LeaderboardPage() {
    const users = await fetchLeaderboardUsers()

    // Build semicolon-separated string
    const handles = users.map((u) => u.codeforcesHandle).join(';')

    // Fetch CF data for all users
    const cfUsers = handles ? await getMultipleCodeforcesUsers(handles) : []

    // Merge data
    const leaderboardData = users.map((user: LeaderboardUser) => {
        const cfData = cfUsers.find(
            (cf) =>
                cf.handle.toLowerCase() === user.codeforcesHandle.toLowerCase()
        )
        return {
            ...user,
            rating: cfData?.rating ?? 0,
            rank: cfData?.rank ?? 'unrated',
            maxRating: cfData?.maxRating,
        }
    })

    // Sort by rating
    leaderboardData.sort((a, b) => b.rating - a.rating)

    return (
        <div className="container mx-auto space-y-12 py-10">
            <div>
                <h1 className="mb-6 text-3xl font-bold">
                    Codeforces Leaderboard
                </h1>
                <LeaderboardTable data={leaderboardData} />
            </div>

            <div>
                <h2 className="mb-6 text-2xl font-bold">
                    Register for Leaderboard
                </h2>
                <RegisterForm />
            </div>
        </div>
    )
}

import { fetchLeaderboardUsers } from '@/db/queries'
import { getMultipleCodeforcesUsers } from '@/lib/codeforces'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { RegisterModal } from '@/components/RegisterModal'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
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
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-4 xl:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Codeforces Leaderboard
            </TextScramble>

            <div className="mb-8 space-y-8">
                <RegisterModal />
                <LeaderboardTable data={leaderboardData} />
            </div>
        </main>
    )
}

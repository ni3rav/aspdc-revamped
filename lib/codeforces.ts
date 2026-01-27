import { CodeforcesUser } from '@/db/types'

interface CodeforcesAPIResponse<T> {
    status: 'OK' | 'FAILED'
    result?: T
    comment?: string
}

export async function getCodeforcesUser(
    handle: string
): Promise<CodeforcesUser | null> {
    try {
        const response = await fetch(
            `https://codeforces.com/api/user.info?handles=${handle}`,
            { next: { revalidate: 60 } }
        )

        if (!response.ok) {
            console.error(
                `Codeforces API error: ${response.status} ${response.statusText}`
            )
            return null
        }

        const data = (await response.json()) as CodeforcesAPIResponse<any[]>

        if (data.status !== 'OK' || !data.result || data.result.length === 0) {
            return null
        }

        const user = data.result[0]

        return {
            handle: user.handle,
            rating: user.rating ?? undefined,
            maxRating: user.maxRating ?? undefined,
            rank: user.rank ?? undefined,
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
            maxRank: user.maxRank ?? undefined,
        }
    } catch (error) {
        console.error('Error fetching Codeforces user:', error)
        return null
    }
}

export type RankingStats = {
    participantCount: number
    rank: number
    usersAbove: number
    usersBelow: number
    higherThanPercent: number
    topPercent: number
}

export type ScoreHistogramBucket = {
    start: number
    end: number
    label: string
    count: number
}

function displayedScore(score: number): number {
    return Math.min(100, Math.max(0, Math.round(score)))
}

export function calculateRankingStats(
    userScore: number,
    participantScores: number[]
): RankingStats {
    const score = displayedScore(userScore)
    const scores =
        participantScores.length === 0
            ? [score]
            : participantScores.map(displayedScore)
    const participantCount = scores.length
    const usersAbove = scores.filter(
        (participantScore) => participantScore > score
    ).length
    const usersBelow = scores.filter(
        (participantScore) => participantScore < score
    ).length
    const rank = usersAbove + 1

    return {
        participantCount,
        rank,
        usersAbove,
        usersBelow,
        higherThanPercent: Math.floor((100 * usersBelow) / participantCount),
        topPercent: Math.ceil((100 * rank) / participantCount),
    }
}

export function createScoreHistogram(
    participantScores: number[]
): ScoreHistogramBucket[] {
    const buckets = Array.from({ length: 10 }, (_, index) => {
        const start = index * 10
        const end = index === 9 ? 100 : start + 9
        return {
            start,
            end,
            label: `${start}–${end}`,
            count: 0,
        }
    })

    for (const rawScore of participantScores) {
        const score = displayedScore(rawScore)
        const bucketIndex = Math.min(9, Math.floor(score / 10))
        buckets[bucketIndex]!.count += 1
    }

    return buckets
}

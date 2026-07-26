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

export function getCompetitionRank(
    userScore: number,
    participantScores: number[]
): number {
    const score = displayedScore(userScore)
    return (
        participantScores
            .map(displayedScore)
            .filter((participantScore) => participantScore > score).length + 1
    )
}

export function assignCompetitionRanks(participantScores: number[]): number[] {
    const displayedScores = participantScores.map(displayedScore)
    const sortedScores = [...displayedScores].sort((a, b) => b - a)
    const rankByScore = new Map<number, number>()
    sortedScores.forEach((score, index) => {
        if (!rankByScore.has(score)) rankByScore.set(score, index + 1)
    })
    return displayedScores.map((score) => rankByScore.get(score)!)
}

export function calculateRankingStats(
    userScore: number,
    participantScores: number[]
): RankingStats {
    const score = displayedScore(userScore)
    if (participantScores.length === 0) {
        throw new Error('Ranking requires a non-empty participant cohort.')
    }
    const scores = participantScores.map(displayedScore)
    const participantCount = scores.length
    const usersAbove = scores.filter(
        (participantScore) => participantScore > score
    ).length
    const usersBelow = scores.filter(
        (participantScore) => participantScore < score
    ).length
    const rank = getCompetitionRank(score, scores)

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

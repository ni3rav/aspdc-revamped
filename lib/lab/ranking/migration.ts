import type { RankingScoreV2, RankingSnapshotV2 } from './types'
import { getCompetitionRank } from './rank'

export function getMigrationRankMovement({
    oldScore,
    newScore,
    allOldScores,
    candidateNewScores,
}: {
    oldScore: number
    newScore: number
    allOldScores: number[]
    candidateNewScores: number[]
}) {
    const oldRank = getCompetitionRank(oldScore, allOldScores)
    const newRank = getCompetitionRank(newScore, candidateNewScores)

    return {
        oldRank,
        newRank,
        movement: oldRank - newRank,
    }
}

export function assertRankingSnapshotOwner(
    profileLogin: string,
    snapshotLogin: string
): void {
    if (profileLogin.toLowerCase() === snapshotLogin.toLowerCase()) return

    throw new Error(
        `Linked GitHub token resolved to @${snapshotLogin}, not profile @${profileLogin}.`
    )
}

export function createMigrationCapReport(
    snapshot: RankingSnapshotV2,
    score: RankingScoreV2
): string {
    const activeOriginalRepositories = score.credited.activeOriginalRepositories

    return [
        `caps commits ${snapshot.commits.reduce(
            (sum, contribution) => sum + contribution.commitCount,
            0
        )}→${score.credited.creditedCommits}`,
        `PR records ${snapshot.pullRequests.length}→${score.credited.creditedPullRequestPoints} points`,
        `reviews ${snapshot.reviews.length}→${score.credited.creditedReviews}`,
        `issues ${snapshot.issues.length}→${score.credited.creditedIssues}`,
        `active original repos ${activeOriginalRepositories}→${Math.min(
            activeOriginalRepositories,
            5
        )}`,
        `stewardship candidates ${activeOriginalRepositories}→${score.credited.stewardshipRepositories} selected`,
    ].join('; ')
}

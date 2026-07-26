export const RANKING_SCORE_VERSION = 2 as const

export type RankingRepositoryV2 = {
    id: string
    nameWithOwner: string
    ownerLogin: string
    isPrivate: boolean
    isFork: boolean
    hasReadme: boolean
    hasDescription: boolean
    hasTopics: boolean
    hasLicense: boolean
    hasReleaseOrTag: boolean
    /** Display-only context. These values must never affect competitive score. */
    stargazersCount?: number
    /** Display-only context. These values must never affect competitive score. */
    forksCount?: number
}

type PublicContributionV2 = {
    occurredAt: string
    repositoryId: string
    isRestricted: boolean
}

export type CommitContributionV2 = PublicContributionV2 & {
    commitCount: number
}

export type PullRequestContributionV2 = PublicContributionV2 & {
    pullRequestId: string
    state: 'OPEN' | 'CLOSED' | 'MERGED'
}

export type ReviewContributionV2 = PublicContributionV2 & {
    pullRequestId: string
    pullRequestAuthorLogin: string
}

export type IssueContributionV2 = PublicContributionV2 & {
    issueId: string
}

export type RankingSnapshotV2 = {
    scoreVersion: typeof RANKING_SCORE_VERSION
    login: string
    userType: 'User'
    windowStart: string
    windowEnd: string
    capturedAt: string
    repositories: RankingRepositoryV2[]
    commits: CommitContributionV2[]
    pullRequests: PullRequestContributionV2[]
    reviews: ReviewContributionV2[]
    issues: IssueContributionV2[]
}

export type RankingPillarScores = {
    sustainedActivity: number
    building: number
    collaboration: number
    stewardship: number
}

export type RankingCreditedAggregates = {
    activeDays: number
    activeWeeks: number
    creditedCommits: number
    activeOriginalRepositories: number
    creditedPullRequestPoints: number
    creditedReviews: number
    creditedIssues: number
    stewardshipRepositories: number
}

export type RankingScoreV2 = {
    scoreVersion: typeof RANKING_SCORE_VERSION
    developerScore: number
    pillars: RankingPillarScores
    credited: RankingCreditedAggregates
}

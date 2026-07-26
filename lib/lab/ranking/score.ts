import {
    RANKING_SCORE_VERSION,
    type RankingRepositoryV2,
    type RankingScoreV2,
    type RankingSnapshotV2,
} from './types'

const DAY_MS = 24 * 60 * 60 * 1000

function clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(maximum, Math.max(minimum, value))
}

export function linear(value: number, cap: number): number {
    return 100 * (clamp(value, 0, cap) / cap)
}

export function diminishing(value: number, cap: number): number {
    return 100 * Math.sqrt(clamp(value, 0, cap) / cap)
}

function utcDay(occurredAt: string): string | null {
    const date = new Date(occurredAt)
    if (Number.isNaN(date.getTime())) return null
    return date.toISOString().slice(0, 10)
}

function utcWeek(occurredAt: string): string | null {
    const date = new Date(occurredAt)
    if (Number.isNaN(date.getTime())) return null

    const startOfDay = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    )
    const mondayOffset = (date.getUTCDay() + 6) % 7
    return new Date(startOfDay - mondayOffset * DAY_MS)
        .toISOString()
        .slice(0, 10)
}

function withinWindow(
    occurredAt: string,
    snapshot: RankingSnapshotV2
): boolean {
    const timestamp = new Date(occurredAt).getTime()
    const start = new Date(snapshot.windowStart).getTime()
    const end = new Date(snapshot.windowEnd).getTime()
    return (
        Number.isFinite(timestamp) &&
        Number.isFinite(start) &&
        Number.isFinite(end) &&
        timestamp >= start &&
        timestamp <= end
    )
}

function publicOriginalRepositories(
    snapshot: RankingSnapshotV2
): Map<string, RankingRepositoryV2> {
    return new Map(
        snapshot.repositories
            .filter((repository) => !repository.isPrivate && !repository.isFork)
            .map((repository) => [repository.id, repository])
    )
}

function addActivityDate(
    occurredAt: string,
    activeDays: Set<string>,
    activeWeeks: Set<string>
) {
    const day = utcDay(occurredAt)
    const week = utcWeek(occurredAt)
    if (day) activeDays.add(day)
    if (week) activeWeeks.add(week)
}

function creditCommits(
    snapshot: RankingSnapshotV2,
    repositories: Map<string, RankingRepositoryV2>
): {
    total: number
    byRepository: Map<string, number>
} {
    const commitsByDayAndRepository = new Map<string, Map<string, number>>()

    for (const contribution of snapshot.commits) {
        if (
            contribution.isRestricted ||
            contribution.commitCount <= 0 ||
            !withinWindow(contribution.occurredAt, snapshot) ||
            !repositories.has(contribution.repositoryId)
        ) {
            continue
        }
        const day = utcDay(contribution.occurredAt)
        if (!day) continue
        const byRepository =
            commitsByDayAndRepository.get(day) ?? new Map<string, number>()
        byRepository.set(
            contribution.repositoryId,
            (byRepository.get(contribution.repositoryId) ?? 0) +
                contribution.commitCount
        )
        commitsByDayAndRepository.set(day, byRepository)
    }

    const creditedByRepository = new Map<string, number>()
    let total = 0

    for (const byRepository of commitsByDayAndRepository.values()) {
        let remainingForDay = 5
        const repositoryCommits = [...byRepository.entries()].sort(([a], [b]) =>
            a.localeCompare(b)
        )
        for (const [repositoryId, commitCount] of repositoryCommits) {
            if (remainingForDay === 0) break
            const credited = Math.min(commitCount, remainingForDay)
            creditedByRepository.set(
                repositoryId,
                (creditedByRepository.get(repositoryId) ?? 0) + credited
            )
            total += credited
            remainingForDay -= credited
        }
    }

    return { total, byRepository: creditedByRepository }
}

function creditPullRequests(
    snapshot: RankingSnapshotV2,
    repositories: Map<string, RankingRepositoryV2>
): number {
    const perDay = new Map<string, number>()
    const perRepository = new Map<string, number>()
    let total = 0

    const contributions = snapshot.pullRequests
        .map((contribution) => ({
            ...contribution,
            points:
                contribution.state === 'MERGED'
                    ? 1
                    : contribution.state === 'OPEN'
                      ? 0.5
                      : 0,
        }))
        .filter((contribution) => {
            const repository = repositories.get(contribution.repositoryId)
            return (
                !contribution.isRestricted &&
                contribution.points > 0 &&
                withinWindow(contribution.occurredAt, snapshot) &&
                repository !== undefined &&
                repository.ownerLogin.toLowerCase() !==
                    snapshot.login.toLowerCase()
            )
        })
        .sort(
            (a, b) =>
                b.points - a.points ||
                a.occurredAt.localeCompare(b.occurredAt) ||
                a.pullRequestId.localeCompare(b.pullRequestId)
        )

    for (const contribution of contributions) {
        const day = utcDay(contribution.occurredAt)
        if (!day) continue
        const dayRemaining = 2 - (perDay.get(day) ?? 0)
        const repositoryRemaining =
            4 - (perRepository.get(contribution.repositoryId) ?? 0)
        const credited = Math.max(
            0,
            Math.min(contribution.points, dayRemaining, repositoryRemaining)
        )
        if (credited === 0) continue

        perDay.set(day, (perDay.get(day) ?? 0) + credited)
        perRepository.set(
            contribution.repositoryId,
            (perRepository.get(contribution.repositoryId) ?? 0) + credited
        )
        total += credited
    }

    return total
}

function creditReviews(
    snapshot: RankingSnapshotV2,
    repositories: Map<string, RankingRepositoryV2>
): number {
    const perDay = new Map<string, number>()
    const perRepository = new Map<string, number>()
    const seenPullRequestDays = new Set<string>()
    let total = 0

    const contributions = [...snapshot.reviews].sort(
        (a, b) =>
            a.occurredAt.localeCompare(b.occurredAt) ||
            a.pullRequestId.localeCompare(b.pullRequestId)
    )
    for (const contribution of contributions) {
        const repository = repositories.get(contribution.repositoryId)
        const day = utcDay(contribution.occurredAt)
        if (
            contribution.isRestricted ||
            !day ||
            !withinWindow(contribution.occurredAt, snapshot) ||
            !repository ||
            repository.ownerLogin.toLowerCase() ===
                snapshot.login.toLowerCase() ||
            contribution.pullRequestAuthorLogin.toLowerCase() ===
                snapshot.login.toLowerCase()
        ) {
            continue
        }

        const pullRequestDay = `${contribution.pullRequestId}:${day}`
        if (
            seenPullRequestDays.has(pullRequestDay) ||
            (perDay.get(day) ?? 0) >= 4 ||
            (perRepository.get(contribution.repositoryId) ?? 0) >= 10
        ) {
            continue
        }

        seenPullRequestDays.add(pullRequestDay)
        perDay.set(day, (perDay.get(day) ?? 0) + 1)
        perRepository.set(
            contribution.repositoryId,
            (perRepository.get(contribution.repositoryId) ?? 0) + 1
        )
        total += 1
    }

    return total
}

function creditIssues(
    snapshot: RankingSnapshotV2,
    repositories: Map<string, RankingRepositoryV2>
): number {
    const perDay = new Map<string, number>()
    const perRepository = new Map<string, number>()
    let total = 0

    const contributions = [...snapshot.issues].sort(
        (a, b) =>
            a.occurredAt.localeCompare(b.occurredAt) ||
            a.issueId.localeCompare(b.issueId)
    )
    for (const contribution of contributions) {
        const repository = repositories.get(contribution.repositoryId)
        const day = utcDay(contribution.occurredAt)
        if (
            contribution.isRestricted ||
            !day ||
            !withinWindow(contribution.occurredAt, snapshot) ||
            !repository ||
            repository.ownerLogin.toLowerCase() ===
                snapshot.login.toLowerCase() ||
            (perDay.get(day) ?? 0) >= 2 ||
            (perRepository.get(contribution.repositoryId) ?? 0) >= 4
        ) {
            continue
        }

        perDay.set(day, (perDay.get(day) ?? 0) + 1)
        perRepository.set(
            contribution.repositoryId,
            (perRepository.get(contribution.repositoryId) ?? 0) + 1
        )
        total += 1
    }

    return total
}

function hygieneScore(repository: RankingRepositoryV2): number {
    return (
        (repository.hasReadme ? 40 : 0) +
        (repository.hasDescription ? 25 : 0) +
        (repository.hasTopics ? 15 : 0) +
        (repository.hasLicense ? 10 : 0) +
        (repository.hasReleaseOrTag ? 10 : 0)
    )
}

function collectActiveDates(
    snapshot: RankingSnapshotV2,
    repositories: Map<string, RankingRepositoryV2>
): { activeDays: number; activeWeeks: number } {
    const activeDays = new Set<string>()
    const activeWeeks = new Set<string>()

    const contributionGroups = [
        snapshot.commits,
        snapshot.pullRequests,
        snapshot.reviews,
        snapshot.issues,
    ] as const

    for (const contributions of contributionGroups) {
        for (const contribution of contributions) {
            if (
                contribution.isRestricted ||
                !withinWindow(contribution.occurredAt, snapshot) ||
                !repositories.has(contribution.repositoryId)
            ) {
                continue
            }
            addActivityDate(contribution.occurredAt, activeDays, activeWeeks)
        }
    }

    return {
        activeDays: activeDays.size,
        activeWeeks: activeWeeks.size,
    }
}

export function scoreRankingSnapshotV2(
    snapshot: RankingSnapshotV2
): RankingScoreV2 {
    const repositories = publicOriginalRepositories(snapshot)
    const activity = collectActiveDates(snapshot, repositories)
    const commits = creditCommits(snapshot, repositories)

    const activeOriginalRepositories = [...commits.byRepository.keys()].filter(
        (repositoryId) =>
            repositories
                .get(repositoryId)
                ?.ownerLogin.localeCompare(snapshot.login, undefined, {
                    sensitivity: 'accent',
                }) === 0
    )

    const activeWeekScore = linear(activity.activeWeeks, 13)
    const activeDayScore = linear(activity.activeDays, 36)
    const sustainedActivity = 0.65 * activeWeekScore + 0.35 * activeDayScore

    const commitScore = diminishing(commits.total, 90)
    const activeRepoScore = linear(activeOriginalRepositories.length, 5)
    const building = 0.7 * commitScore + 0.3 * activeRepoScore

    const creditedPullRequestPoints = creditPullRequests(snapshot, repositories)
    const creditedReviews = creditReviews(snapshot, repositories)
    const creditedIssues = creditIssues(snapshot, repositories)
    const collaboration =
        0.45 * diminishing(creditedPullRequestPoints, 12) +
        0.35 * diminishing(creditedReviews, 24) +
        0.2 * diminishing(creditedIssues, 10)

    const stewardshipRepositories = activeOriginalRepositories
        .map((repositoryId) => ({
            repository: repositories.get(repositoryId)!,
            creditedCommits: commits.byRepository.get(repositoryId) ?? 0,
        }))
        .sort(
            (a, b) =>
                b.creditedCommits - a.creditedCommits ||
                a.repository.nameWithOwner.localeCompare(
                    b.repository.nameWithOwner
                )
        )
        .slice(0, 5)
    const stewardship =
        stewardshipRepositories.length === 0
            ? 0
            : stewardshipRepositories.reduce(
                  (sum, entry) => sum + hygieneScore(entry.repository),
                  0
              ) / stewardshipRepositories.length

    const developerScore = Math.round(
        0.3 * sustainedActivity +
            0.3 * building +
            0.25 * collaboration +
            0.15 * stewardship
    )

    return {
        scoreVersion: RANKING_SCORE_VERSION,
        developerScore: clamp(developerScore, 0, 100),
        pillars: {
            sustainedActivity,
            building,
            collaboration,
            stewardship,
        },
        credited: {
            activeDays: activity.activeDays,
            activeWeeks: activity.activeWeeks,
            creditedCommits: commits.total,
            activeOriginalRepositories: activeOriginalRepositories.length,
            creditedPullRequestPoints,
            creditedReviews,
            creditedIssues,
            stewardshipRepositories: stewardshipRepositories.length,
        },
    }
}

export function getDeveloperScoreBand(score: number): string {
    if (score >= 95) return 'Deliberately rare'
    if (score >= 80) return 'Exceptional for the target cohort'
    if (score >= 60) return 'Strong sustained contributor'
    if (score >= 40) return 'Active builder'
    if (score >= 20) return 'Emerging activity'
    return 'Little recent public evidence'
}

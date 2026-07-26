import { RANKING_V2_POLICY, RANKING_WINDOW_MS } from './policy'
import { RANKING_SCORE_VERSION, type RankingSnapshotV2 } from './types'

function requireCondition(
    condition: unknown,
    message: string
): asserts condition {
    if (!condition) {
        throw new Error(`Invalid ranking snapshot: ${message}`)
    }
}

function timestamp(value: unknown, field: string): number {
    requireCondition(typeof value === 'string', `${field} must be a string`)
    const parsed = new Date(value).getTime()
    requireCondition(Number.isFinite(parsed), `${field} must be a valid date`)
    return parsed
}

export function validateRankingSnapshotV2(snapshot: RankingSnapshotV2): void {
    requireCondition(
        snapshot && typeof snapshot === 'object',
        'snapshot must be an object'
    )
    requireCondition(
        snapshot.scoreVersion === RANKING_SCORE_VERSION,
        `scoreVersion must be ${RANKING_SCORE_VERSION}`
    )
    requireCondition(snapshot.userType === 'User', 'userType must be User')
    requireCondition(
        typeof snapshot.login === 'string' && snapshot.login.trim().length > 0,
        'login is required'
    )

    const windowStart = timestamp(snapshot.windowStart, 'windowStart')
    const windowEnd = timestamp(snapshot.windowEnd, 'windowEnd')
    const capturedAt = timestamp(snapshot.capturedAt, 'capturedAt')
    requireCondition(
        windowStart < windowEnd,
        'windowStart must precede windowEnd'
    )
    requireCondition(
        windowEnd - windowStart === RANKING_WINDOW_MS,
        `window must be exactly ${RANKING_V2_POLICY.windowDays} days`
    )
    requireCondition(
        capturedAt === windowEnd,
        'capturedAt must equal windowEnd'
    )

    requireCondition(
        Array.isArray(snapshot.repositories),
        'repositories must be an array'
    )
    const repositoryIds = new Set<string>()
    for (const repository of snapshot.repositories) {
        requireCondition(
            repository && typeof repository === 'object',
            'repository entries must be objects'
        )
        requireCondition(
            typeof repository.id === 'string' && repository.id.length > 0,
            'repository id is required'
        )
        requireCondition(
            !repositoryIds.has(repository.id),
            `repository id ${repository.id} is duplicated`
        )
        repositoryIds.add(repository.id)
        requireCondition(
            typeof repository.nameWithOwner === 'string' &&
                repository.nameWithOwner.length > 0,
            `repository ${repository.id} needs nameWithOwner`
        )
        requireCondition(
            typeof repository.ownerLogin === 'string' &&
                repository.ownerLogin.length > 0,
            `repository ${repository.id} needs ownerLogin`
        )
        for (const field of [
            'isPrivate',
            'isFork',
            'hasReadme',
            'hasDescription',
            'hasTopics',
            'hasLicense',
            'hasReleaseOrTag',
        ] as const) {
            requireCondition(
                typeof repository[field] === 'boolean',
                `repository ${repository.id} ${field} must be boolean`
            )
        }
    }

    const groups = [
        ['commits', snapshot.commits],
        ['pullRequests', snapshot.pullRequests],
        ['reviews', snapshot.reviews],
        ['issues', snapshot.issues],
    ] as const
    for (const [groupName, contributions] of groups) {
        requireCondition(
            Array.isArray(contributions),
            `${groupName} must be an array`
        )
        for (const contribution of contributions) {
            requireCondition(
                contribution && typeof contribution === 'object',
                `${groupName} entries must be objects`
            )
            const occurredAt = timestamp(
                contribution.occurredAt,
                `${groupName}.occurredAt`
            )
            requireCondition(
                occurredAt >= windowStart && occurredAt <= windowEnd,
                `${groupName} contribution falls outside the window`
            )
            requireCondition(
                typeof contribution.repositoryId === 'string' &&
                    repositoryIds.has(contribution.repositoryId),
                `${groupName} references unknown repository ${contribution.repositoryId}`
            )
            requireCondition(
                typeof contribution.isRestricted === 'boolean',
                `${groupName}.isRestricted must be boolean`
            )
        }
    }

    for (const commit of snapshot.commits) {
        requireCondition(
            Number.isInteger(commit.commitCount) && commit.commitCount >= 0,
            'commitCount must be a non-negative integer'
        )
    }
    for (const pullRequest of snapshot.pullRequests) {
        requireCondition(
            ['OPEN', 'CLOSED', 'MERGED'].includes(pullRequest.state),
            'pull request state is invalid'
        )
        requireCondition(
            typeof pullRequest.pullRequestId === 'string' &&
                pullRequest.pullRequestId.length > 0,
            'pullRequestId is required'
        )
    }
    for (const review of snapshot.reviews) {
        requireCondition(
            typeof review.pullRequestId === 'string' &&
                review.pullRequestId.length > 0,
            'review pullRequestId is required'
        )
        requireCondition(
            typeof review.pullRequestAuthorLogin === 'string' &&
                review.pullRequestAuthorLogin.length > 0,
            'review pullRequestAuthorLogin is required'
        )
    }
    for (const issue of snapshot.issues) {
        requireCondition(
            typeof issue.issueId === 'string' && issue.issueId.length > 0,
            'issueId is required'
        )
    }
}

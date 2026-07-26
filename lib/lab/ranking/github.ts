import {
    RANKING_SCORE_VERSION,
    type RankingRepositoryV2,
    type RankingSnapshotV2,
} from './types'
import { validateRankingSnapshotV2 } from './validate'

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'
const GITHUB_REST_URL = 'https://api.github.com'
const RANKING_WINDOW_DAYS = 90
const MAX_PAGINATION_REQUESTS = 100
const README_REQUEST_CONCURRENCY = 6

export class GitHubRankingDataIncompleteError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'GitHubRankingDataIncompleteError'
    }
}

type PageInfo = {
    hasNextPage: boolean
    endCursor: string | null
}

type GitHubRepositoryNode = {
    id: string
    nameWithOwner: string
    owner: { login: string }
    isPrivate: boolean
    isFork: boolean
    description: string | null
    repositoryTopics: { totalCount: number }
    licenseInfo: { key: string } | null
    releases: { totalCount: number }
    refs: { totalCount: number } | null
}

type ContributionConnection<T> = {
    nodes: Array<T | null>
    pageInfo: PageInfo
}

type RankingGraphQLData = {
    viewer: {
        __typename: string
        login: string
        contributionsCollection: {
            commitContributionsByRepository: Array<{
                repository: GitHubRepositoryNode
                contributions: ContributionConnection<{
                    occurredAt: string
                    commitCount: number
                    isRestricted: boolean
                }>
            }>
            pullRequestContributions: ContributionConnection<{
                occurredAt: string
                isRestricted: boolean
                pullRequest: {
                    id: string
                    state: 'OPEN' | 'CLOSED'
                    merged: boolean
                    repository: GitHubRepositoryNode
                }
            }>
            pullRequestReviewContributions: ContributionConnection<{
                occurredAt: string
                isRestricted: boolean
                pullRequestReview: {
                    pullRequest: {
                        id: string
                        author: { login: string } | null
                        repository: GitHubRepositoryNode
                    }
                }
            }>
            issueContributions: ContributionConnection<{
                occurredAt: string
                isRestricted: boolean
                issue: {
                    id: string
                    repository: GitHubRepositoryNode
                }
            }>
        }
    }
}

type RankingGraphQLResponse = {
    data?: RankingGraphQLData
    errors?: Array<{ message: string }>
}

const RANKING_QUERY = `
query RankingContributions(
    $from: DateTime!
    $to: DateTime!
    $pullRequestCursor: String
    $reviewCursor: String
    $issueCursor: String
) {
    viewer {
        __typename
        login
        contributionsCollection(from: $from, to: $to) {
            commitContributionsByRepository(maxRepositories: 100) {
                repository {
                    ...RankingRepository
                }
                contributions(first: 100) {
                    nodes {
                        occurredAt
                        commitCount
                        isRestricted
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
            pullRequestContributions(
                first: 100
                after: $pullRequestCursor
            ) {
                nodes {
                    occurredAt
                    isRestricted
                    pullRequest {
                        id
                        state
                        merged
                        repository {
                            ...RankingRepository
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
            pullRequestReviewContributions(
                first: 100
                after: $reviewCursor
            ) {
                nodes {
                    occurredAt
                    isRestricted
                    pullRequestReview {
                        pullRequest {
                            id
                            author {
                                login
                            }
                            repository {
                                ...RankingRepository
                            }
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
            issueContributions(first: 100, after: $issueCursor) {
                nodes {
                    occurredAt
                    isRestricted
                    issue {
                        id
                        repository {
                            ...RankingRepository
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    }
}

fragment RankingRepository on Repository {
    id
    nameWithOwner
    owner {
        login
    }
    isPrivate
    isFork
    description
    repositoryTopics(first: 1) {
        totalCount
    }
    licenseInfo {
        key
    }
    releases(first: 1) {
        totalCount
    }
    refs(refPrefix: "refs/tags/", first: 1) {
        totalCount
    }
}
`

async function requestRankingPage(
    accessToken: string,
    variables: {
        from: string
        to: string
        pullRequestCursor: string | null
        reviewCursor: string | null
        issueCursor: string | null
    }
): Promise<RankingGraphQLData> {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({ query: RANKING_QUERY, variables }),
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error(
            `GitHub GraphQL request failed (${response.status}) while collecting ranking data.`
        )
    }

    const payload = (await response.json()) as RankingGraphQLResponse
    if (payload.errors?.length) {
        throw new Error(
            `GitHub GraphQL request failed: ${payload.errors
                .map((error) => error.message)
                .join('; ')}`
        )
    }
    if (!payload.data?.viewer?.contributionsCollection) {
        throw new GitHubRankingDataIncompleteError(
            'GitHub returned no ranking contribution collection.'
        )
    }

    return payload.data
}

function normalizeRepository(
    repository: GitHubRepositoryNode
): RankingRepositoryV2 {
    return {
        id: repository.id,
        nameWithOwner: repository.nameWithOwner,
        ownerLogin: repository.owner.login,
        isPrivate: repository.isPrivate,
        isFork: repository.isFork,
        // Resolved later through GitHub's canonical README endpoint.
        hasReadme: false,
        hasDescription: Boolean(repository.description?.trim()),
        hasTopics: repository.repositoryTopics.totalCount > 0,
        hasLicense: repository.licenseInfo !== null,
        hasReleaseOrTag:
            repository.releases.totalCount > 0 ||
            (repository.refs?.totalCount ?? 0) > 0,
    }
}

async function hasCanonicalReadme(
    accessToken: string,
    nameWithOwner: string
): Promise<boolean> {
    const [owner, name, ...extra] = nameWithOwner.split('/')
    if (!owner || !name || extra.length > 0) {
        throw new GitHubRankingDataIncompleteError(
            `GitHub returned an invalid repository name: ${nameWithOwner}.`
        )
    }

    const response = await fetch(
        `${GITHUB_REST_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/readme`,
        {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${accessToken}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
            cache: 'no-store',
        }
    )
    if (response.status === 404) return false
    if (!response.ok) {
        throw new GitHubRankingDataIncompleteError(
            `GitHub README lookup failed (${response.status}) for ${nameWithOwner}.`
        )
    }
    return true
}

async function resolveCanonicalReadmes(
    accessToken: string,
    repositories: Map<string, RankingRepositoryV2>,
    commits: RankingSnapshotV2['commits'],
    login: string
) {
    const activeOwnedRepositoryIds = [
        ...new Set(commits.map((contribution) => contribution.repositoryId)),
    ].filter((repositoryId) => {
        const repository = repositories.get(repositoryId)
        return (
            repository &&
            !repository.isPrivate &&
            !repository.isFork &&
            repository.ownerLogin.toLowerCase() === login.toLowerCase()
        )
    })

    for (
        let offset = 0;
        offset < activeOwnedRepositoryIds.length;
        offset += README_REQUEST_CONCURRENCY
    ) {
        const batch = activeOwnedRepositoryIds.slice(
            offset,
            offset + README_REQUEST_CONCURRENCY
        )
        const results = await Promise.all(
            batch.map(async (repositoryId) => {
                const repository = repositories.get(repositoryId)!
                return {
                    repository,
                    hasReadme: await hasCanonicalReadme(
                        accessToken,
                        repository.nameWithOwner
                    ),
                }
            })
        )
        for (const result of results) {
            result.repository.hasReadme = result.hasReadme
        }
    }
}

function nextCursor(label: string, pageInfo: PageInfo): string | null {
    if (!pageInfo.hasNextPage) return null
    if (!pageInfo.endCursor) {
        throw new GitHubRankingDataIncompleteError(
            `GitHub reported more ${label} without a pagination cursor.`
        )
    }
    return pageInfo.endCursor
}

/**
 * Collects the complete public evidence used by ranking V2.
 *
 * Persona collection deliberately remains in ../github.ts so competitive
 * ranking changes cannot alter character assignment inputs.
 */
export async function fetchGitHubRankingSnapshot(
    accessToken: string,
    capturedAt: Date = new Date()
): Promise<RankingSnapshotV2> {
    const windowEnd = capturedAt.toISOString()
    const windowStart = new Date(
        capturedAt.getTime() - RANKING_WINDOW_DAYS * 24 * 60 * 60 * 1000
    ).toISOString()
    const repositories = new Map<string, RankingRepositoryV2>()
    const commits: RankingSnapshotV2['commits'] = []
    const pullRequests: RankingSnapshotV2['pullRequests'] = []
    const reviews: RankingSnapshotV2['reviews'] = []
    const issues: RankingSnapshotV2['issues'] = []

    let pullRequestCursor: string | null = null
    let reviewCursor: string | null = null
    let issueCursor: string | null = null
    let pullRequestsComplete = false
    let reviewsComplete = false
    let issuesComplete = false
    let commitsCollected = false
    let login: string | null = null

    for (
        let requestCount = 0;
        requestCount < MAX_PAGINATION_REQUESTS;
        requestCount++
    ) {
        const data = await requestRankingPage(accessToken, {
            from: windowStart,
            to: windowEnd,
            pullRequestCursor,
            reviewCursor,
            issueCursor,
        })

        if (data.viewer.__typename !== 'User') {
            throw new Error(
                'Ranking analysis requires an authenticated GitHub user account.'
            )
        }
        if (login && login !== data.viewer.login) {
            throw new GitHubRankingDataIncompleteError(
                'The authenticated GitHub account changed during pagination.'
            )
        }
        login = data.viewer.login

        const collection = data.viewer.contributionsCollection

        if (!commitsCollected) {
            if (collection.commitContributionsByRepository.length === 100) {
                throw new GitHubRankingDataIncompleteError(
                    'GitHub reached the commit-repository collection limit; ranking data may be incomplete.'
                )
            }
            for (const group of collection.commitContributionsByRepository) {
                if (
                    group.repository.isPrivate ||
                    group.contributions.pageInfo.hasNextPage
                ) {
                    if (group.contributions.pageInfo.hasNextPage) {
                        throw new GitHubRankingDataIncompleteError(
                            `Commit contributions for ${group.repository.nameWithOwner} exceeded the complete 90-day page.`
                        )
                    }
                    continue
                }
                const normalized = normalizeRepository(group.repository)
                repositories.set(normalized.id, normalized)
                for (const contribution of group.contributions.nodes) {
                    if (!contribution || contribution.isRestricted) continue
                    commits.push({
                        occurredAt: contribution.occurredAt,
                        repositoryId: normalized.id,
                        isRestricted: false,
                        commitCount: contribution.commitCount,
                    })
                }
            }
            commitsCollected = true
        }

        if (!pullRequestsComplete) {
            for (const contribution of collection.pullRequestContributions
                .nodes) {
                if (
                    !contribution ||
                    contribution.isRestricted ||
                    contribution.pullRequest.repository.isPrivate
                ) {
                    continue
                }
                const repository = normalizeRepository(
                    contribution.pullRequest.repository
                )
                repositories.set(repository.id, repository)
                pullRequests.push({
                    occurredAt: contribution.occurredAt,
                    repositoryId: repository.id,
                    isRestricted: false,
                    pullRequestId: contribution.pullRequest.id,
                    state: contribution.pullRequest.merged
                        ? 'MERGED'
                        : contribution.pullRequest.state,
                })
            }
            const cursor = nextCursor(
                'pull request contributions',
                collection.pullRequestContributions.pageInfo
            )
            pullRequestsComplete = cursor === null
            pullRequestCursor = cursor
        }

        if (!reviewsComplete) {
            for (const contribution of collection.pullRequestReviewContributions
                .nodes) {
                const pullRequest = contribution?.pullRequestReview.pullRequest
                if (
                    !contribution ||
                    contribution.isRestricted ||
                    !pullRequest?.author?.login ||
                    pullRequest.repository.isPrivate
                ) {
                    continue
                }
                const repository = normalizeRepository(pullRequest.repository)
                repositories.set(repository.id, repository)
                reviews.push({
                    occurredAt: contribution.occurredAt,
                    repositoryId: repository.id,
                    isRestricted: false,
                    pullRequestId: pullRequest.id,
                    pullRequestAuthorLogin: pullRequest.author.login,
                })
            }
            const cursor = nextCursor(
                'pull request review contributions',
                collection.pullRequestReviewContributions.pageInfo
            )
            reviewsComplete = cursor === null
            reviewCursor = cursor
        }

        if (!issuesComplete) {
            for (const contribution of collection.issueContributions.nodes) {
                if (
                    !contribution ||
                    contribution.isRestricted ||
                    contribution.issue.repository.isPrivate
                ) {
                    continue
                }
                const repository = normalizeRepository(
                    contribution.issue.repository
                )
                repositories.set(repository.id, repository)
                issues.push({
                    occurredAt: contribution.occurredAt,
                    repositoryId: repository.id,
                    isRestricted: false,
                    issueId: contribution.issue.id,
                })
            }
            const cursor = nextCursor(
                'issue contributions',
                collection.issueContributions.pageInfo
            )
            issuesComplete = cursor === null
            issueCursor = cursor
        }

        if (
            commitsCollected &&
            pullRequestsComplete &&
            reviewsComplete &&
            issuesComplete
        ) {
            await resolveCanonicalReadmes(
                accessToken,
                repositories,
                commits,
                login!
            )
            const snapshot: RankingSnapshotV2 = {
                scoreVersion: RANKING_SCORE_VERSION,
                login: login!,
                userType: 'User',
                windowStart,
                windowEnd,
                capturedAt: windowEnd,
                repositories: [...repositories.values()],
                commits,
                pullRequests,
                reviews,
                issues,
            }
            validateRankingSnapshotV2(snapshot)
            return snapshot
        }
    }

    throw new GitHubRankingDataIncompleteError(
        'GitHub ranking pagination exceeded the safety limit.'
    )
}

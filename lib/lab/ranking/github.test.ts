import { afterEach, describe, expect, it, vi } from 'vitest'
import {
    GitHubRankingDataIncompleteError,
    fetchGitHubRankingSnapshot,
} from './github'

type GraphQLResponse = {
    data?: unknown
    errors?: Array<{ message: string }>
}

function jsonResponse(body: GraphQLResponse) {
    return {
        ok: true,
        status: 200,
        json: async () => body,
    }
}

function repository(
    id: string,
    ownerLogin = 'student',
    overrides: Record<string, unknown> = {}
) {
    return {
        id,
        nameWithOwner: `${ownerLogin}/${id}`,
        owner: { login: ownerLogin },
        isPrivate: false,
        isFork: false,
        description: 'Course project',
        repositoryTopics: { totalCount: 1 },
        licenseInfo: { key: 'mit' },
        releases: { totalCount: 1 },
        refs: { totalCount: 0 },
        defaultBranchRef: {
            target: {
                tree: {
                    entries: [{ name: 'README.md', type: 'blob' }],
                },
            },
        },
        ...overrides,
    }
}

function connection(nodes: unknown[], hasNextPage = false, endCursor = null) {
    return {
        nodes,
        pageInfo: { hasNextPage, endCursor },
    }
}

function responseData(options: {
    commits?: unknown[]
    pullRequests?: ReturnType<typeof connection>
    reviews?: ReturnType<typeof connection>
    issues?: ReturnType<typeof connection>
    typename?: string
}) {
    return {
        viewer: {
            __typename: options.typename ?? 'User',
            login: 'student',
            contributionsCollection: {
                commitContributionsByRepository: options.commits ?? [],
                pullRequestContributions:
                    options.pullRequests ?? connection([]),
                pullRequestReviewContributions:
                    options.reviews ?? connection([]),
                issueContributions: options.issues ?? connection([]),
            },
        },
    }
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('fetchGitHubRankingSnapshot', () => {
    it('collects a complete public 90-day snapshot across contribution pages', async () => {
        const ownRepo = repository('coursework', 'student', {
            defaultBranchRef: {
                target: {
                    tree: {
                        entries: [{ name: 'README.rst', type: 'blob' }],
                    },
                },
            },
        })
        const externalRepo = repository('club-site', 'aspdc')
        const privateRepo = repository('private-lab', 'student', {
            isPrivate: true,
        })
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(
                jsonResponse({
                    data: responseData({
                        commits: [
                            {
                                repository: ownRepo,
                                contributions: connection([
                                    {
                                        occurredAt: '2026-07-01T12:00:00.000Z',
                                        commitCount: 3,
                                        isRestricted: false,
                                    },
                                    {
                                        occurredAt: '2026-07-02T12:00:00.000Z',
                                        commitCount: 20,
                                        isRestricted: true,
                                    },
                                ]),
                            },
                            {
                                repository: privateRepo,
                                contributions: connection([
                                    {
                                        occurredAt: '2026-07-03T12:00:00.000Z',
                                        commitCount: 50,
                                        isRestricted: false,
                                    },
                                ]),
                            },
                        ],
                        pullRequests: connection(
                            [
                                {
                                    occurredAt: '2026-07-04T12:00:00.000Z',
                                    isRestricted: false,
                                    pullRequest: {
                                        id: 'pr-1',
                                        state: 'OPEN',
                                        merged: false,
                                        repository: externalRepo,
                                    },
                                },
                            ],
                            true,
                            'pr-cursor'
                        ),
                        reviews: connection([
                            {
                                occurredAt: '2026-07-05T12:00:00.000Z',
                                isRestricted: false,
                                pullRequestReview: {
                                    pullRequest: {
                                        id: 'review-pr',
                                        author: { login: 'maintainer' },
                                        repository: externalRepo,
                                    },
                                },
                            },
                        ]),
                        issues: connection([
                            {
                                occurredAt: '2026-07-06T12:00:00.000Z',
                                isRestricted: false,
                                issue: {
                                    id: 'issue-1',
                                    repository: externalRepo,
                                },
                            },
                        ]),
                    }),
                })
            )
            .mockResolvedValueOnce(
                jsonResponse({
                    data: responseData({
                        pullRequests: connection([
                            {
                                occurredAt: '2026-07-07T12:00:00.000Z',
                                isRestricted: false,
                                pullRequest: {
                                    id: 'pr-2',
                                    state: 'CLOSED',
                                    merged: true,
                                    repository: externalRepo,
                                },
                            },
                        ]),
                    }),
                })
            )
        vi.stubGlobal('fetch', fetchMock)

        const snapshot = await fetchGitHubRankingSnapshot(
            'github-token',
            new Date('2026-07-26T12:00:00.000Z')
        )

        expect(fetchMock).toHaveBeenCalledTimes(2)
        const [url, init] = fetchMock.mock.calls[0]!
        expect(url).toBe('https://api.github.com/graphql')
        expect(init.headers).toMatchObject({
            Authorization: 'Bearer github-token',
        })
        const request = JSON.parse(String(init.body))
        expect(request.variables).toMatchObject({
            from: '2026-04-27T12:00:00.000Z',
            to: '2026-07-26T12:00:00.000Z',
            pullRequestCursor: null,
            reviewCursor: null,
            issueCursor: null,
        })
        const secondRequest = JSON.parse(
            String(fetchMock.mock.calls[1]![1].body)
        )
        expect(secondRequest.variables.pullRequestCursor).toBe('pr-cursor')

        expect(snapshot).toMatchObject({
            scoreVersion: 2,
            login: 'student',
            userType: 'User',
            windowStart: '2026-04-27T12:00:00.000Z',
            windowEnd: '2026-07-26T12:00:00.000Z',
            capturedAt: '2026-07-26T12:00:00.000Z',
        })
        expect(snapshot.repositories.map((repo) => repo.id).sort()).toEqual([
            'club-site',
            'coursework',
        ])
        expect(snapshot.commits).toEqual([
            {
                occurredAt: '2026-07-01T12:00:00.000Z',
                repositoryId: 'coursework',
                isRestricted: false,
                commitCount: 3,
            },
        ])
        expect(
            snapshot.repositories.find(({ id }) => id === 'coursework')
                ?.hasReadme
        ).toBe(true)
        expect(snapshot.pullRequests.map((item) => item.state)).toEqual([
            'OPEN',
            'MERGED',
        ])
        expect(snapshot.reviews).toHaveLength(1)
        expect(snapshot.issues).toHaveLength(1)
    })

    it('rejects an incomplete nested commit connection', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                jsonResponse({
                    data: responseData({
                        commits: [
                            {
                                repository: repository('coursework'),
                                contributions: connection([], true, 'more'),
                            },
                        ],
                    }),
                })
            )
        )

        await expect(
            fetchGitHubRankingSnapshot(
                'token',
                new Date('2026-07-26T12:00:00.000Z')
            )
        ).rejects.toBeInstanceOf(GitHubRankingDataIncompleteError)
    })

    it('rejects unsupported account types and GraphQL errors', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValueOnce(
                jsonResponse({
                    data: responseData({ typename: 'Organization' }),
                })
            )
        )
        await expect(
            fetchGitHubRankingSnapshot(
                'token',
                new Date('2026-07-26T12:00:00.000Z')
            )
        ).rejects.toThrow(/authenticated GitHub user/)

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValueOnce(
                jsonResponse({
                    errors: [{ message: 'Something failed' }],
                })
            )
        )
        await expect(
            fetchGitHubRankingSnapshot(
                'token',
                new Date('2026-07-26T12:00:00.000Z')
            )
        ).rejects.toThrow(/Something failed/)
    })
})

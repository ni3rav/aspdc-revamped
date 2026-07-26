import { afterEach, describe, expect, it, vi } from 'vitest'
import {
    GitHubRankingDataIncompleteError,
    fetchGitHubRankingSnapshot,
} from './github'

function jsonResponse(body: unknown) {
    return {
        ok: true,
        status: 200,
        json: async () => body,
    }
}

function restResponse(status: number) {
    return {
        ok: status >= 200 && status < 300,
        status,
    }
}

function authenticatedUserResponse() {
    return jsonResponse({
        login: 'student',
        type: 'User',
    })
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
    it('rejects bot accounts before collecting ranking contributions', async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(
            jsonResponse({
                login: 'course-helper[bot]',
                type: 'Bot',
            })
        )
        vi.stubGlobal('fetch', fetchMock)

        await expect(
            fetchGitHubRankingSnapshot(
                'github-token',
                new Date('2026-07-26T12:00:00.000Z')
            )
        ).rejects.toThrow(/authenticated GitHub user account/)

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.calls[0]![0]).toBe('https://api.github.com/user')
    })

    it('collects a complete public 90-day snapshot across contribution pages', async () => {
        const ownRepo = repository('coursework')
        const externalRepo = repository('club-site', 'aspdc')
        const privateRepo = repository('private-lab', 'student', {
            isPrivate: true,
        })
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(authenticatedUserResponse())
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
            // GitHub's canonical endpoint recognizes supported README formats
            // in .github, root, and docs without duplicating that policy here.
            .mockResolvedValueOnce(restResponse(200))
        vi.stubGlobal('fetch', fetchMock)

        const snapshot = await fetchGitHubRankingSnapshot(
            'github-token',
            new Date('2026-07-26T12:00:00.000Z')
        )

        expect(fetchMock).toHaveBeenCalledTimes(4)
        expect(fetchMock.mock.calls[0]![0]).toBe('https://api.github.com/user')
        const [url, init] = fetchMock.mock.calls[1]!
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
            String(fetchMock.mock.calls[2]![1].body)
        )
        expect(secondRequest.variables.pullRequestCursor).toBe('pr-cursor')
        expect(fetchMock.mock.calls[3]![0]).toBe(
            'https://api.github.com/repos/student/coursework/readme'
        )

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

    it('uses GitHub canonical README resolution and accepts a missing README', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(authenticatedUserResponse())
            .mockResolvedValueOnce(
                jsonResponse({
                    data: responseData({
                        commits: [
                            {
                                repository: repository('coursework'),
                                contributions: connection([
                                    {
                                        occurredAt: '2026-07-01T12:00:00.000Z',
                                        commitCount: 1,
                                        isRestricted: false,
                                    },
                                ]),
                            },
                        ],
                    }),
                })
            )
            .mockResolvedValueOnce(restResponse(404))
        vi.stubGlobal('fetch', fetchMock)

        const snapshot = await fetchGitHubRankingSnapshot(
            'token',
            new Date('2026-07-26T12:00:00.000Z')
        )

        expect(snapshot.repositories[0]?.hasReadme).toBe(false)
        expect(fetchMock.mock.calls[2]![0]).toMatch(
            /\/repos\/student\/coursework\/readme$/
        )
    })

    it('rejects an incomplete nested commit connection', async () => {
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValueOnce(authenticatedUserResponse())
                .mockResolvedValue(
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
            vi
                .fn()
                .mockResolvedValueOnce(authenticatedUserResponse())
                .mockResolvedValueOnce(
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
            vi
                .fn()
                .mockResolvedValueOnce(authenticatedUserResponse())
                .mockResolvedValueOnce(
                    jsonResponse({
                        data: responseData({ typename: 'Bot' }),
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
            vi
                .fn()
                .mockResolvedValueOnce(authenticatedUserResponse())
                .mockResolvedValueOnce(
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

    it('rejects rate-limited GitHub responses without producing a snapshot', async () => {
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValueOnce(authenticatedUserResponse())
                .mockResolvedValue(restResponse(429))
        )

        await expect(
            fetchGitHubRankingSnapshot(
                'token',
                new Date('2026-07-26T12:00:00.000Z')
            )
        ).rejects.toThrow(/GitHub GraphQL request failed \(429\)/)
    })
})

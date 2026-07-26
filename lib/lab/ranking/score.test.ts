import { describe, expect, it } from 'vitest'
import { getDeveloperScoreBand, scoreRankingSnapshotV2 } from './score'
import {
    RANKING_SCORE_VERSION,
    type RankingRepositoryV2,
    type RankingSnapshotV2,
} from './types'

function repository(
    id: string,
    overrides: Partial<RankingRepositoryV2> = {}
): RankingRepositoryV2 {
    return {
        id,
        nameWithOwner: `student/${id}`,
        ownerLogin: 'student',
        isPrivate: false,
        isFork: false,
        hasReadme: false,
        hasDescription: false,
        hasTopics: false,
        hasLicense: false,
        hasReleaseOrTag: false,
        ...overrides,
    }
}

function snapshot(
    overrides: Partial<RankingSnapshotV2> = {}
): RankingSnapshotV2 {
    return {
        scoreVersion: RANKING_SCORE_VERSION,
        login: 'student',
        userType: 'User',
        windowStart: '2026-04-27T12:00:00.000Z',
        windowEnd: '2026-07-26T12:00:00.000Z',
        capturedAt: '2026-07-26T12:00:00.000Z',
        repositories: [],
        commits: [],
        pullRequests: [],
        reviews: [],
        issues: [],
        ...overrides,
    }
}

describe('scoreRankingSnapshotV2', () => {
    it('returns zero when there is no qualifying public evidence', () => {
        expect(scoreRankingSnapshotV2(snapshot())).toEqual({
            scoreVersion: 2,
            developerScore: 0,
            pillars: {
                sustainedActivity: 0,
                building: 0,
                collaboration: 0,
                stewardship: 0,
            },
            credited: {
                activeDays: 0,
                activeWeeks: 0,
                creditedCommits: 0,
                activeOriginalRepositories: 0,
                creditedPullRequestPoints: 0,
                creditedReviews: 0,
                creditedIssues: 0,
                stewardshipRepositories: 0,
            },
        })
    })

    it('applies sustained, building, and stewardship caps without collaboration reweighting', () => {
        const repositories = Array.from({ length: 5 }, (_, index) =>
            repository(`repo-${index}`, {
                hasReadme: true,
                hasDescription: true,
                hasTopics: true,
                hasLicense: true,
                hasReleaseOrTag: true,
            })
        )
        const commits = Array.from({ length: 36 }, (_, index) => ({
            occurredAt: new Date(
                Date.UTC(2026, 3, 28 + Math.floor((index * 89) / 35))
            ).toISOString(),
            repositoryId: repositories[index % repositories.length]!.id,
            isRestricted: false,
            commitCount: 5,
        }))

        const result = scoreRankingSnapshotV2(
            snapshot({ repositories, commits })
        )

        expect(result.developerScore).toBe(75)
        expect(result.pillars).toEqual({
            sustainedActivity: 100,
            building: 100,
            collaboration: 0,
            stewardship: 100,
        })
        expect(result.credited).toMatchObject({
            activeDays: 36,
            activeWeeks: 13,
            creditedCommits: 180,
            activeOriginalRepositories: 5,
            stewardshipRepositories: 5,
        })
    })

    it('credits capped external pull requests, reviews, and issues', () => {
        const externalRepositories = Array.from({ length: 3 }, (_, index) =>
            repository(`external-${index}`, {
                nameWithOwner: `aspdc/external-${index}`,
                ownerLogin: 'aspdc',
            })
        )
        const day = (index: number) =>
            new Date(Date.UTC(2026, 6, 1 + index)).toISOString()

        const result = scoreRankingSnapshotV2(
            snapshot({
                repositories: externalRepositories,
                pullRequests: Array.from({ length: 12 }, (_, index) => ({
                    occurredAt: day(Math.floor(index / 2)),
                    repositoryId: externalRepositories[index % 3]!.id,
                    isRestricted: false,
                    pullRequestId: `pr-${index}`,
                    state: 'MERGED' as const,
                })),
                reviews: Array.from({ length: 24 }, (_, index) => ({
                    occurredAt: day(Math.floor(index / 4)),
                    repositoryId: externalRepositories[index % 3]!.id,
                    isRestricted: false,
                    pullRequestId: `review-pr-${index}`,
                    pullRequestAuthorLogin: `author-${index}`,
                })),
                issues: Array.from({ length: 10 }, (_, index) => ({
                    occurredAt: day(Math.floor(index / 2)),
                    repositoryId: externalRepositories[index % 3]!.id,
                    isRestricted: false,
                    issueId: `issue-${index}`,
                })),
            })
        )

        expect(result.pillars.collaboration).toBe(100)
        expect(result.credited).toMatchObject({
            creditedPullRequestPoints: 12,
            creditedReviews: 24,
            creditedIssues: 10,
        })
    })

    it('credits an eligible open external pull request as half a point', () => {
        const external = repository('external', {
            nameWithOwner: 'aspdc/external',
            ownerLogin: 'aspdc',
        })
        const result = scoreRankingSnapshotV2(
            snapshot({
                repositories: [external],
                pullRequests: [
                    {
                        occurredAt: '2026-07-01T12:00:00.000Z',
                        repositoryId: external.id,
                        isRestricted: false,
                        pullRequestId: 'open-pr',
                        state: 'OPEN',
                    },
                ],
            })
        )

        expect(result.credited.creditedPullRequestPoints).toBe(0.5)
        expect(result.pillars.collaboration).toBeCloseTo(
            0.45 * 100 * Math.sqrt(0.5 / 12)
        )
    })

    it('ignores popularity, fork creation, private, and restricted evidence', () => {
        const original = repository('coursework')
        const noisyFork = repository('popular-fork', {
            isFork: true,
            stargazersCount: 50_000,
            forksCount: 20_000,
        })
        const baseline = snapshot({
            repositories: [original],
            commits: [
                {
                    occurredAt: '2026-07-01T12:00:00.000Z',
                    repositoryId: original.id,
                    isRestricted: false,
                    commitCount: 1,
                },
            ],
        })
        const noisy = snapshot({
            ...baseline,
            repositories: [
                { ...original, stargazersCount: 99_999, forksCount: 99_999 },
                noisyFork,
                repository('private', { isPrivate: true }),
            ],
            commits: [
                ...baseline.commits,
                {
                    occurredAt: '2026-07-02T12:00:00.000Z',
                    repositoryId: noisyFork.id,
                    isRestricted: false,
                    commitCount: 500,
                },
                {
                    occurredAt: '2026-07-03T12:00:00.000Z',
                    repositoryId: 'private',
                    isRestricted: false,
                    commitCount: 500,
                },
                {
                    occurredAt: '2026-07-04T12:00:00.000Z',
                    repositoryId: original.id,
                    isRestricted: true,
                    commitCount: 500,
                },
            ],
        })

        expect(scoreRankingSnapshotV2(noisy)).toEqual(
            scoreRankingSnapshotV2(baseline)
        )
    })

    it('caps commit credit at five per UTC day and remains monotonic', () => {
        const repo = repository('coursework')
        const oneCommit = scoreRankingSnapshotV2(
            snapshot({
                repositories: [repo],
                commits: [
                    {
                        occurredAt: '2026-07-01T01:00:00.000Z',
                        repositoryId: repo.id,
                        isRestricted: false,
                        commitCount: 1,
                    },
                ],
            })
        )
        const manyCommits = scoreRankingSnapshotV2(
            snapshot({
                repositories: [repo],
                commits: [
                    {
                        occurredAt: '2026-07-01T01:00:00.000Z',
                        repositoryId: repo.id,
                        isRestricted: false,
                        commitCount: 4,
                    },
                    {
                        occurredAt: '2026-07-01T23:00:00.000Z',
                        repositoryId: repo.id,
                        isRestricted: false,
                        commitCount: 400,
                    },
                ],
            })
        )

        expect(manyCommits.credited.creditedCommits).toBe(5)
        expect(manyCommits.developerScore).toBeGreaterThanOrEqual(
            oneCommit.developerScore
        )
    })

    it('does not turn ineligible collaboration into active days', () => {
        const external = repository('external', {
            ownerLogin: 'community',
            nameWithOwner: 'community/external',
        })
        const result = scoreRankingSnapshotV2(
            snapshot({
                repositories: [external],
                pullRequests: [
                    {
                        occurredAt: '2026-07-01T12:00:00.000Z',
                        repositoryId: external.id,
                        isRestricted: false,
                        pullRequestId: 'closed-pr',
                        state: 'CLOSED',
                    },
                ],
                reviews: [
                    {
                        occurredAt: '2026-07-02T12:00:00.000Z',
                        repositoryId: external.id,
                        isRestricted: false,
                        pullRequestId: 'self-authored-pr',
                        pullRequestAuthorLogin: 'student',
                    },
                ],
            })
        )

        expect(result.developerScore).toBe(0)
        expect(result.credited.activeDays).toBe(0)
        expect(result.credited.activeWeeks).toBe(0)
    })

    it('cannot lose stewardship points when more qualifying work is added', () => {
        const documented = Array.from({ length: 5 }, (_, index) =>
            repository(`documented-${index}`, {
                hasReadme: true,
                hasDescription: true,
                hasTopics: true,
                hasLicense: true,
                hasReleaseOrTag: true,
            })
        )
        const undocumented = repository('undocumented')
        const commits = documented.map((repo, index) => ({
            occurredAt: new Date(Date.UTC(2026, 6, index + 1)).toISOString(),
            repositoryId: repo.id,
            isRestricted: false,
            commitCount: 1,
        }))
        const before = scoreRankingSnapshotV2(
            snapshot({ repositories: documented, commits })
        )
        const after = scoreRankingSnapshotV2(
            snapshot({
                repositories: [...documented, undocumented],
                commits: [
                    ...commits,
                    {
                        occurredAt: '2026-07-10T12:00:00.000Z',
                        repositoryId: undocumented.id,
                        isRestricted: false,
                        commitCount: 5,
                    },
                ],
            })
        )

        expect(after.pillars.stewardship).toBeGreaterThanOrEqual(
            before.pillars.stewardship
        )
        expect(after.developerScore).toBeGreaterThanOrEqual(
            before.developerScore
        )
    })

    it('keeps stewardship monotonic when same-day commits hit the shared cap', () => {
        const documented = repository('z-documented', {
            hasReadme: true,
            hasDescription: true,
            hasTopics: true,
            hasLicense: true,
            hasReleaseOrTag: true,
        })
        const undocumented = repository('a-undocumented')
        const documentedCommit = {
            occurredAt: '2026-07-01T12:00:00.000Z',
            repositoryId: documented.id,
            isRestricted: false,
            commitCount: 5,
        }
        const before = scoreRankingSnapshotV2(
            snapshot({
                repositories: [documented],
                commits: [documentedCommit],
            })
        )
        const after = scoreRankingSnapshotV2(
            snapshot({
                repositories: [documented, undocumented],
                commits: [
                    documentedCommit,
                    {
                        ...documentedCommit,
                        repositoryId: undocumented.id,
                    },
                ],
            })
        )

        expect(after.credited.activeOriginalRepositories).toBe(2)
        expect(after.pillars.stewardship).toBeGreaterThanOrEqual(
            before.pillars.stewardship
        )
        expect(after.developerScore).toBeGreaterThanOrEqual(
            before.developerScore
        )
    })

    it('rejects malformed snapshots instead of silently scoring them', () => {
        expect(() =>
            scoreRankingSnapshotV2(
                snapshot({
                    capturedAt: 'not-a-date',
                })
            )
        ).toThrow(/capturedAt/)
        expect(() =>
            scoreRankingSnapshotV2(
                snapshot({
                    commits: [
                        {
                            occurredAt: '2026-07-01T12:00:00.000Z',
                            repositoryId: 'missing',
                            isRestricted: false,
                            commitCount: 1,
                        },
                    ],
                })
            )
        ).toThrow(/unknown repository/)
    })
})

describe('getDeveloperScoreBand', () => {
    it.each([
        [0, 'Little recent public evidence'],
        [20, 'Emerging activity'],
        [40, 'Active builder'],
        [60, 'Strong sustained contributor'],
        [80, 'Exceptional for the target cohort'],
        [95, 'Deliberately rare'],
        [100, 'Deliberately rare'],
    ])('maps %i to its stable interpretation', (score, label) => {
        expect(getDeveloperScoreBand(score)).toBe(label)
    })
})

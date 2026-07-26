import { describe, expect, it } from 'vitest'
import { getDeveloperScoreBand, scoreRankingSnapshotV2 } from './score'
import {
    RANKING_SCORE_VERSION,
    type RankingRepositoryV2,
    type RankingSnapshotV2,
} from './types'

const WINDOW_START = Date.UTC(2026, 3, 28)

function occurredAt(index: number, total: number): string {
    const offset = total <= 1 ? 0 : Math.floor((index * 89) / (total - 1))
    return new Date(WINDOW_START + offset * 24 * 60 * 60 * 1000).toISOString()
}

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

const hygienic = {
    hasReadme: true,
    hasDescription: true,
    hasTopics: true,
    hasLicense: true,
    hasReleaseOrTag: true,
}

function builder(dayCount: number, repositoryCount: number) {
    const repositories = Array.from({ length: repositoryCount }, (_, index) =>
        repository(`project-${index}`, hygienic)
    )
    return snapshot({
        repositories,
        commits: Array.from({ length: dayCount }, (_, index) => ({
            occurredAt: occurredAt(index, dayCount),
            repositoryId: repositories[index % repositoryCount]!.id,
            isRestricted: false,
            commitCount: 5,
        })),
    })
}

function strongCollaborator(): RankingSnapshotV2 {
    const base = builder(12, 2)
    const externalRepositories = Array.from({ length: 3 }, (_, index) =>
        repository(`external-${index}`, {
            nameWithOwner: `community/external-${index}`,
            ownerLogin: 'community',
        })
    )
    return {
        ...base,
        repositories: [...base.repositories, ...externalRepositories],
        pullRequests: Array.from({ length: 12 }, (_, index) => ({
            occurredAt: occurredAt(index, 12),
            repositoryId: externalRepositories[index % 3]!.id,
            isRestricted: false,
            pullRequestId: `pr-${index}`,
            state: 'MERGED' as const,
        })),
        reviews: Array.from({ length: 24 }, (_, index) => ({
            occurredAt: occurredAt(index, 24),
            repositoryId: externalRepositories[index % 3]!.id,
            isRestricted: false,
            pullRequestId: `review-${index}`,
            pullRequestAuthorLogin: `peer-${index}`,
        })),
        issues: Array.from({ length: 10 }, (_, index) => ({
            occurredAt: occurredAt(index, 10),
            repositoryId: externalRepositories[index % 3]!.id,
            isRestricted: false,
            issueId: `issue-${index}`,
        })),
    }
}

describe('version 2 golden cohort', () => {
    it('keeps representative early-career profiles in the approved order and score bands', () => {
        const inactive = scoreRankingSnapshotV2(snapshot())
        const fork = repository('fork', {
            isFork: true,
            stargazersCount: 100_000,
            forksCount: 50_000,
        })
        const forkHeavy = scoreRankingSnapshotV2(
            snapshot({
                repositories: [fork],
                commits: [
                    {
                        occurredAt: occurredAt(0, 1),
                        repositoryId: fork.id,
                        isRestricted: false,
                        commitCount: 10_000,
                    },
                ],
            })
        )
        const burstRepository = repository('burst')
        const bursty = scoreRankingSnapshotV2(
            snapshot({
                repositories: [burstRepository],
                commits: [
                    {
                        occurredAt: occurredAt(0, 1),
                        repositoryId: burstRepository.id,
                        isRestricted: false,
                        commitCount: 1_000,
                    },
                ],
            })
        )
        const occasional = scoreRankingSnapshotV2(builder(4, 1))
        const steady = scoreRankingSnapshotV2(builder(24, 3))
        const collaborator = scoreRankingSnapshotV2(strongCollaborator())
        const outlierBase = builder(36, 5)
        const collaboratorEvidence = strongCollaborator()
        const outlier = scoreRankingSnapshotV2({
            ...outlierBase,
            repositories: [
                ...outlierBase.repositories,
                ...collaboratorEvidence.repositories.filter(
                    ({ ownerLogin }) => ownerLogin === 'community'
                ),
            ],
            pullRequests: collaboratorEvidence.pullRequests,
            reviews: collaboratorEvidence.reviews,
            issues: collaboratorEvidence.issues,
        })

        expect(inactive.developerScore).toBe(0)
        expect(forkHeavy.developerScore).toBe(0)
        expect(bursty.developerScore).toBeGreaterThan(forkHeavy.developerScore)
        expect(occasional.developerScore).toBeGreaterThan(bursty.developerScore)
        expect(steady.developerScore).toBeGreaterThan(occasional.developerScore)
        expect(collaborator.developerScore).toBeGreaterThan(
            steady.developerScore
        )
        expect(outlier.developerScore).toBeGreaterThan(
            collaborator.developerScore
        )

        expect(getDeveloperScoreBand(inactive.developerScore)).toBe(
            'Little recent public evidence'
        )
        expect(getDeveloperScoreBand(bursty.developerScore)).toBe(
            'Little recent public evidence'
        )
        expect(getDeveloperScoreBand(occasional.developerScore)).toBe(
            'Emerging activity'
        )
        expect(getDeveloperScoreBand(steady.developerScore)).toBe(
            'Strong sustained contributor'
        )
        expect(getDeveloperScoreBand(collaborator.developerScore)).toBe(
            'Exceptional for the target cohort'
        )
        expect(getDeveloperScoreBand(outlier.developerScore)).toBe(
            'Deliberately rare'
        )
    })
})

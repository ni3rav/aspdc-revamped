import { describe, expect, it } from 'vitest'
import type { GitHubSnapshot } from '../types'
import { runLabAnalysisV2 } from './analyze'
import { RANKING_SCORE_VERSION, type RankingSnapshotV2 } from './types'

const personaSnapshot: GitHubSnapshot = {
    login: 'student',
    accountCreatedAt: '2024-01-01T00:00:00.000Z',
    followers: 2,
    following: 3,
    publicRepos: 1,
    repos: [
        {
            name: 'coursework',
            language: 'TypeScript',
            topicsCount: 1,
            hasDescription: true,
            isFork: false,
            stargazersCount: 0,
            forksCount: 0,
        },
    ],
    events: [
        {
            type: 'PushEvent',
            createdAt: '2026-07-01T12:00:00.000Z',
        },
    ],
}

function rankingSnapshot(stars = 0, forks = 0): RankingSnapshotV2 {
    return {
        scoreVersion: RANKING_SCORE_VERSION,
        login: 'student',
        userType: 'User',
        windowStart: '2026-04-27T12:00:00.000Z',
        windowEnd: '2026-07-26T12:00:00.000Z',
        capturedAt: '2026-07-26T12:00:00.000Z',
        repositories: [
            {
                id: 'coursework',
                nameWithOwner: 'student/coursework',
                ownerLogin: 'student',
                isPrivate: false,
                isFork: false,
                hasReadme: true,
                hasDescription: true,
                hasTopics: true,
                hasLicense: false,
                hasReleaseOrTag: false,
                stargazersCount: stars,
                forksCount: forks,
            },
        ],
        commits: [
            {
                occurredAt: '2026-07-01T12:00:00.000Z',
                repositoryId: 'coursework',
                isRestricted: false,
                commitCount: 3,
            },
        ],
        pullRequests: [],
        reviews: [],
        issues: [],
    }
}

describe('runLabAnalysisV2', () => {
    it('keeps persona output separate from the competitive ranking result', () => {
        const baseline = runLabAnalysisV2(personaSnapshot, rankingSnapshot())
        const popular = runLabAnalysisV2(
            personaSnapshot,
            rankingSnapshot(100_000, 50_000)
        )

        expect(popular.persona).toEqual(baseline.persona)
        expect(popular.ranking).toEqual(baseline.ranking)
        expect(baseline.ranking.scoreVersion).toBe(2)
        expect(baseline.persona.characterId).toBe(
            baseline.persona.characterMatches[0]!.id
        )
    })

    it('produces a content-free persistence snapshot with published inputs', () => {
        const result = runLabAnalysisV2(personaSnapshot, rankingSnapshot())

        expect(result.persistedRankingSnapshot).toMatchObject({
            scoreVersion: 2,
            login: 'student',
            windowStart: '2026-04-27T12:00:00.000Z',
            windowEnd: '2026-07-26T12:00:00.000Z',
            capturedAt: '2026-07-26T12:00:00.000Z',
            dailyCreditedCommits: { '2026-07-01': 3 },
            activeDays: ['2026-07-01'],
            credited: result.ranking.credited,
        })
        expect(result.persistedRankingSnapshot.repositories).toEqual([
            {
                nameWithOwner: 'student/coursework',
                creditedCommits: 3,
                hasReadme: true,
                hasDescription: true,
                hasTopics: true,
                hasLicense: false,
                hasReleaseOrTag: false,
            },
        ])
        expect(JSON.stringify(result.persistedRankingSnapshot)).not.toMatch(
            /title|body|message|token/i
        )
    })
})

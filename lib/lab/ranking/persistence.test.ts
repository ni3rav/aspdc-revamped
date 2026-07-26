import { PgDialect } from 'drizzle-orm/pg-core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { executeMock } = vi.hoisted(() => ({
    executeMock: vi.fn(),
}))

vi.mock('@/db/drizzle', () => ({
    db: {
        execute: executeMock,
    },
}))

import {
    persistLabAnalysisV2,
    type PersistLabAnalysisV2Input,
} from '../../../db/lab-analysis'

const analyzedAt = new Date('2026-07-26T12:00:00.000Z')

function input(): PersistLabAnalysisV2Input {
    return {
        profile: {
            userId: 'user-1',
            githubUsername: 'student',
            characterId: 'jesse',
            characterSimilarity: 88,
            developerScore: 42,
            traitScores: { Discipline: 70 },
            githubSnapshot: { login: 'student' },
            analyzedAt,
        },
        score: {
            scoreVersion: 2,
            developerScore: 67,
            pillarScores: {
                sustainedActivity: 60,
                building: 70,
                collaboration: 65,
                stewardship: 80,
            },
            rankingSnapshot: {
                scoreVersion: 2,
                login: 'student',
                windowStart: '2026-04-27T12:00:00.000Z',
                windowEnd: '2026-07-26T12:00:00.000Z',
                capturedAt: '2026-07-26T12:00:00.000Z',
                dailyCreditedCommits: { '2026-07-01': 3 },
                activeDays: ['2026-07-01'],
                activeWeeks: ['2026-06-29'],
                credited: {
                    activeDays: 1,
                    activeWeeks: 1,
                    creditedCommits: 3,
                    activeOriginalRepositories: 1,
                    creditedPullRequestPoints: 0,
                    creditedReviews: 0,
                    creditedIssues: 0,
                    stewardshipRepositories: 1,
                },
                repositories: [],
            },
            capturedAt: analyzedAt,
        },
        achievements: [
            {
                achievementId: 'the-one-who-builds',
                unlockedAt: analyzedAt,
            },
        ],
        replaceAchievementIds: ['no-half-measures', 'the-one-who-builds'],
    }
}

beforeEach(() => {
    executeMock.mockReset()
})

describe('persistLabAnalysisV2', () => {
    it('writes persona, V2 score, first-cutover cleanup, and achievements atomically', async () => {
        executeMock.mockResolvedValue({
            rows: [
                {
                    id: 'profile-1',
                    user_id: 'user-1',
                    github_username: 'student',
                    character_id: 'jesse',
                    character_similarity: 88,
                    developer_score: 42,
                    trait_scores: { Discipline: 70 },
                    github_snapshot: { login: 'student' },
                    analyzed_at: analyzedAt,
                },
            ],
        })

        const result = await persistLabAnalysisV2(input())

        expect(result.id).toBe('profile-1')
        expect(executeMock).toHaveBeenCalledTimes(1)
        const statement = executeMock.mock.calls[0]![0]
        const compiled = new PgDialect().sqlToQuery(statement)
        const normalizedSql = compiled.sql.replace(/\s+/g, ' ').toLowerCase()

        expect(normalizedSql).toContain('with existing_profile as materialized')
        expect(normalizedSql).toContain('existing_score as materialized')
        expect(normalizedSql).toContain('insert into lab_profiles')
        expect(normalizedSql).toContain('insert into lab_profile_scores')
        expect(normalizedSql).toContain('insert into lab_achievements')
        expect(normalizedSql).toContain(
            'not exists (select 1 from existing_score)'
        )
        expect(normalizedSql).toContain(
            'on conflict (profile_id, achievement_id) do nothing'
        )
        expect(compiled.params).toContain(2)
    })

    it('does not issue follow-up writes when the atomic statement fails', async () => {
        executeMock.mockRejectedValue(new Error('database unavailable'))

        await expect(persistLabAnalysisV2(input())).rejects.toThrow(
            'database unavailable'
        )
        expect(executeMock).toHaveBeenCalledTimes(1)
    })
})

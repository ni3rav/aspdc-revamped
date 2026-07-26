import { PgDialect } from 'drizzle-orm/pg-core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { selectMock, cacheLifeMock } = vi.hoisted(() => ({
    selectMock: vi.fn(),
    cacheLifeMock: vi.fn(),
}))

vi.mock('@/db/drizzle', () => ({
    db: {
        select: selectMock,
    },
}))

vi.mock('next/cache', () => ({
    cacheLife: cacheLifeMock,
}))

import {
    fetchLabProfilesByScore,
    fetchLabScoreDistribution,
} from '../../../db/queries'

beforeEach(() => {
    selectMock.mockReset()
    cacheLifeMock.mockReset()
})

describe('V2 ranking queries', () => {
    it('uses the versioned score for leaderboard values and cohort membership', async () => {
        let joinCondition: unknown
        const rows = [
            {
                profile: {
                    id: 'profile-1',
                    userId: 'user-1',
                    githubUsername: 'student',
                    characterId: 'jesse',
                    characterSimilarity: 88,
                    developerScore: 12,
                    traitScores: {},
                    githubSnapshot: {},
                    analyzedAt: new Date('2026-07-26T12:00:00.000Z'),
                },
                rankingScore: {
                    id: 'score-1',
                    profileId: 'profile-1',
                    scoreVersion: 2,
                    developerScore: 77,
                    pillarScores: {
                        sustainedActivity: 75,
                        building: 80,
                        collaboration: 70,
                        stewardship: 85,
                    },
                    rankingSnapshot: {},
                    capturedAt: new Date('2026-07-26T12:00:00.000Z'),
                    createdAt: new Date('2026-07-26T12:00:00.000Z'),
                    updatedAt: new Date('2026-07-26T12:00:00.000Z'),
                },
            },
        ]
        const orderBy = vi.fn().mockResolvedValue(rows)
        const innerJoin = vi.fn((_table: unknown, condition: unknown) => {
            joinCondition = condition
            return { orderBy }
        })
        selectMock.mockReturnValue({
            from: vi.fn().mockReturnValue({ innerJoin }),
        })

        const result = await fetchLabProfilesByScore()

        expect(result[0]?.developerScore).toBe(77)
        expect(result[0]?.rankingScore.scoreVersion).toBe(2)
        const compiled = new PgDialect().sqlToQuery(
            joinCondition as Parameters<PgDialect['sqlToQuery']>[0]
        )
        expect(compiled.params).toContain(2)
    })

    it('filters the score distribution to the V2 cohort', async () => {
        let whereCondition: unknown
        const orderBy = vi.fn().mockResolvedValue([{ developerScore: 77 }])
        const where = vi.fn((condition: unknown) => {
            whereCondition = condition
            return { orderBy }
        })
        selectMock.mockReturnValue({
            from: vi.fn().mockReturnValue({ where }),
        })

        const result = await fetchLabScoreDistribution()

        expect(result).toEqual([{ developerScore: 77 }])
        const compiled = new PgDialect().sqlToQuery(
            whereCondition as Parameters<PgDialect['sqlToQuery']>[0]
        )
        expect(compiled.params).toEqual([2])
    })
})

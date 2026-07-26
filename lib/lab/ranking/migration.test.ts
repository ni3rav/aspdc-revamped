import { describe, expect, it } from 'vitest'
import {
    assertRankingSnapshotOwner,
    createMigrationCapReport,
    getMigrationRankMovement,
} from './migration'
import { RANKING_SCORE_VERSION } from './types'

describe('assertRankingSnapshotOwner', () => {
    it('accepts the linked profile login case-insensitively', () => {
        expect(() =>
            assertRankingSnapshotOwner('StudentDev', 'studentdev')
        ).not.toThrow()
    })

    it('rejects a token that belongs to another GitHub login', () => {
        expect(() =>
            assertRankingSnapshotOwner('student', 'other-developer')
        ).toThrow(
            'Linked GitHub token resolved to @other-developer, not profile @student.'
        )
    })
})

describe('createMigrationCapReport', () => {
    it('reports every capped or selected migration input', () => {
        const report = createMigrationCapReport(
            {
                scoreVersion: RANKING_SCORE_VERSION,
                login: 'student',
                userType: 'User',
                windowStart: '2026-04-27T12:00:00.000Z',
                windowEnd: '2026-07-26T12:00:00.000Z',
                capturedAt: '2026-07-26T12:00:00.000Z',
                repositories: [],
                commits: [
                    {
                        occurredAt: '2026-07-01T12:00:00.000Z',
                        repositoryId: 'coursework',
                        isRestricted: false,
                        commitCount: 8,
                    },
                ],
                pullRequests: [{}, {}, {}] as never[],
                reviews: [{}, {}] as never[],
                issues: [{}] as never[],
            },
            {
                scoreVersion: RANKING_SCORE_VERSION,
                developerScore: 64,
                pillars: {
                    sustainedActivity: 50,
                    building: 70,
                    collaboration: 60,
                    stewardship: 75,
                },
                credited: {
                    activeDays: 1,
                    activeWeeks: 1,
                    creditedCommits: 5,
                    activeOriginalRepositories: 7,
                    creditedPullRequestPoints: 2.5,
                    creditedReviews: 2,
                    creditedIssues: 1,
                    stewardshipRepositories: 5,
                },
            }
        )

        expect(report).toBe(
            'caps commits 8→5; PR records 3→2.5 points; reviews 2→2; issues 1→1; active original repos 7→5; stewardship candidates 7→5 selected'
        )
    })
})

describe('getMigrationRankMovement', () => {
    it('compares V1 against every legacy profile when V2 candidates were skipped', () => {
        expect(
            getMigrationRankMovement({
                oldScore: 80,
                newScore: 85,
                allOldScores: [100, 90, 80],
                candidateNewScores: [85],
            })
        ).toEqual({
            oldRank: 3,
            newRank: 1,
            movement: 2,
        })
    })
})

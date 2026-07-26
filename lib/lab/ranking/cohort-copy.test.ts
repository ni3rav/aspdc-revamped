import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MetricsExplanation } from '@/components/lab/metrics-explanation'
import { RankingOverview } from '@/components/lab/ranking-overview'
import type { LabProfileScore } from '@/db/types'

const targetCohort = 'calibrated for undergraduate and early-career developers'

function rankingScore(): LabProfileScore {
    const timestamp = new Date('2026-07-26T12:00:00.000Z')
    return {
        id: 'score-1',
        profileId: 'profile-1',
        scoreVersion: 2,
        developerScore: 64,
        pillarScores: {
            sustainedActivity: 60,
            building: 70,
            collaboration: 55,
            stewardship: 75,
        },
        rankingSnapshot: {
            scoreVersion: 2,
            login: 'student',
            windowStart: '2026-04-27T12:00:00.000Z',
            windowEnd: '2026-07-26T12:00:00.000Z',
            capturedAt: '2026-07-26T12:00:00.000Z',
            dailyCreditedCommits: {},
            activeDays: [],
            activeWeeks: [],
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
            repositories: [],
        },
        capturedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
    }
}

describe('Ranking V2 target cohort copy', () => {
    it('publishes the intended audience in methodology and profile context', () => {
        const methodology = renderToStaticMarkup(
            createElement(MetricsExplanation)
        )
        const overview = renderToStaticMarkup(
            createElement(RankingOverview, { score: rankingScore() })
        )

        expect(methodology).toContain(targetCohort)
        expect(overview).toContain(targetCohort)
    })
})

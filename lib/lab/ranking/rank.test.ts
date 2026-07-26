import { describe, expect, it } from 'vitest'
import { calculateRankingStats, createScoreHistogram } from './rank'

describe('calculateRankingStats', () => {
    it('uses competition rank and strict score comparisons for ties', () => {
        const scores = [91, 91, 84, 70, 70]

        expect(calculateRankingStats(91, scores)).toMatchObject({
            participantCount: 5,
            rank: 1,
            usersAbove: 0,
            usersBelow: 3,
            higherThanPercent: 60,
            topPercent: 20,
        })
        expect(calculateRankingStats(84, scores)).toMatchObject({
            rank: 3,
            usersAbove: 2,
            usersBelow: 2,
            higherThanPercent: 40,
            topPercent: 60,
        })
        expect(calculateRankingStats(70, scores)).toMatchObject({
            rank: 4,
            usersAbove: 3,
            usersBelow: 0,
            higherThanPercent: 0,
            topPercent: 80,
        })
    })

    it('reports rank one of five as top 20 percent', () => {
        expect(calculateRankingStats(100, [100, 80, 60, 40, 20])).toMatchObject(
            {
                rank: 1,
                participantCount: 5,
                topPercent: 20,
            }
        )
    })
})

describe('createScoreHistogram', () => {
    it('returns the actual cohort in fixed score buckets', () => {
        const histogram = createScoreHistogram([0, 9, 10, 55, 91, 100])

        expect(histogram).toHaveLength(10)
        expect(histogram[0]).toEqual({
            start: 0,
            end: 9,
            label: '0–9',
            count: 2,
        })
        expect(histogram[1]?.count).toBe(1)
        expect(histogram[5]?.count).toBe(1)
        expect(histogram[9]).toEqual({
            start: 90,
            end: 100,
            label: '90–100',
            count: 2,
        })
        expect(histogram.reduce((sum, bucket) => sum + bucket.count, 0)).toBe(6)
    })
})

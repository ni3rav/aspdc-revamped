import { describe, expect, it } from 'vitest'
import { getProfileDisplayData } from './profile'
import type { LabProfile } from '@/db/types'

const mockProfile: LabProfile = {
    id: 'test-profile-id',
    userId: 'test-user-id',
    githubUsername: 'walterwhite',
    characterId: 'walter-white',
    characterSimilarity: 95,
    developerScore: 88,
    traitScores: {
        Builder: 88,
        Architect: 82,
        Scientist: 95,
        Explorer: 55,
        TeamPlayer: 35,
        Mentor: 70,
        Leadership: 85,
        Consistency: 90,
        Discipline: 92,
        Curiosity: 80,
        Creativity: 75,
        Documentation: 70,
        OpenSource: 40,
        Communication: 55,
        Chaos: 45,
    },
    githubSnapshot: {
        capturedAt: '2026-07-20T12:00:00Z',
        snapshot: {
            login: 'walterwhite',
            accountCreatedAt: '2020-01-01T00:00:00Z',
            followers: 10,
            following: 5,
            publicRepos: 12,
            repos: [
                {
                    name: 'blue-sky-formula',
                    language: 'TypeScript',
                    topicsCount: 2,
                    hasDescription: true,
                    isFork: false,
                    stargazersCount: 50,
                    forksCount: 10,
                },
                {
                    name: 'meth-lab-monitor',
                    language: 'Python',
                    topicsCount: 1,
                    hasDescription: true,
                    isFork: false,
                    stargazersCount: 20,
                    forksCount: 2,
                },
                {
                    name: 'crystal-analytics',
                    language: 'Go',
                    topicsCount: 3,
                    hasDescription: true,
                    isFork: false,
                    stargazersCount: 100,
                    forksCount: 25,
                },
            ],
            events: [],
        },
    },
    analyzedAt: new Date(),
}

describe('getProfileDisplayData', () => {
    it('resolves primary character, top 3 matches, and unlocked achievements from profile with valid snapshot', () => {
        const data = getProfileDisplayData(mockProfile)

        expect(data.primaryCharacter.id).toBe(data.topMatches[0].id)
        expect(data.topMatches).toHaveLength(3)
        expect(data.topMatches[0].similarity).toBeGreaterThan(0)
        expect(data.achievements.length).toBeGreaterThan(0)
    })

    it('falls back to traitScores and dbAchievementIds when snapshot is empty or unparseable', () => {
        const profileWithoutSnapshot: LabProfile = {
            ...mockProfile,
            githubSnapshot: {},
        }

        const data = getProfileDisplayData(profileWithoutSnapshot, [
            'the-blue-sky',
            'science-bitch',
        ])

        expect(data.primaryCharacter.id).toBe('walter-white')
        expect(data.topMatches).toHaveLength(3)
        expect(data.achievements).toHaveLength(2)
        expect(data.achievements.map((a) => a.id)).toEqual([
            'the-blue-sky',
            'science-bitch',
        ])
    })

    it('handles unknown characterId gracefully by using top match or fallback name', () => {
        const unknownCharProfile: LabProfile = {
            ...mockProfile,
            characterId: 'unknown-character-xyz',
            githubSnapshot: {},
        }

        const data = getProfileDisplayData(unknownCharProfile)
        expect(data.primaryCharacter).toBeDefined()
        expect(data.topMatches).toHaveLength(3)
    })

    it('combines persisted durable and current dynamic rank achievements', () => {
        const data = getProfileDisplayData(mockProfile, ['no-half-measures'], {
            rank: 10,
        })

        expect(data.achievements.map((achievement) => achievement.id)).toEqual(
            expect.arrayContaining(['no-half-measures', 'say-my-name'])
        )
        expect(
            data.rankingAchievements.map((achievement) => achievement.id)
        ).toEqual(expect.arrayContaining(['no-half-measures', 'say-my-name']))
        expect(
            data.personaAchievements.some((achievement) =>
                ['no-half-measures', 'say-my-name'].includes(achievement.id)
            )
        ).toBe(false)
    })

    it('does not reinterpret legacy ranking badges without a V2 score', () => {
        const data = getProfileDisplayData(mockProfile, [
            'the-blue-sky',
            'no-half-measures',
        ])

        expect(data.achievements.map(({ id }) => id)).toEqual(['the-blue-sky'])
        expect(data.rankingAchievements).toEqual([])
    })
})

import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import type { PersistLabAnalysisV2Input } from '../../../db/lab-analysis'

let postgres: PGlite
let persistLabAnalysisV2: typeof import('../../../db/lab-analysis').persistLabAnalysisV2
let fetchLabProfilesByScore: typeof import('../../../db/queries').fetchLabProfilesByScore
let fetchLabScoreDistribution: typeof import('../../../db/queries').fetchLabScoreDistribution

const analyzedAt = new Date('2026-07-26T12:00:00.000Z')

function input(
    overrides: {
        username?: string
        characterId?: string
        score?: number
        achievements?: string[]
    } = {}
): PersistLabAnalysisV2Input {
    return {
        profile: {
            userId: 'user-1',
            githubUsername: overrides.username ?? 'student',
            characterId: overrides.characterId ?? 'jesse',
            characterSimilarity: 88,
            developerScore: 42,
            traitScores: { Discipline: 70 },
            githubSnapshot: { login: 'student' },
            analyzedAt,
        },
        score: {
            scoreVersion: 2,
            developerScore: overrides.score ?? 67,
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
        achievements: (overrides.achievements ?? ['the-one-who-builds']).map(
            (achievementId) => ({
                achievementId,
                unlockedAt: analyzedAt,
            })
        ),
        replaceAchievementIds: ['no-half-measures', 'the-one-who-builds'],
    }
}

async function rows<T>(query: string, params: unknown[] = []): Promise<T[]> {
    const result = await postgres.query<T>(query, params)
    return result.rows
}

beforeAll(async () => {
    postgres = new PGlite()
    await postgres.exec(`
        CREATE TABLE lab_profiles (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id text NOT NULL UNIQUE,
            github_username text NOT NULL UNIQUE,
            character_id text NOT NULL,
            character_similarity real NOT NULL,
            developer_score integer NOT NULL,
            trait_scores jsonb NOT NULL,
            github_snapshot jsonb NOT NULL,
            analyzed_at timestamp NOT NULL
        );
        CREATE TABLE lab_profile_scores (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id uuid NOT NULL REFERENCES lab_profiles(id) ON DELETE CASCADE,
            score_version integer NOT NULL,
            developer_score integer NOT NULL CHECK (developer_score BETWEEN 0 AND 100),
            pillar_scores jsonb NOT NULL,
            ranking_snapshot jsonb NOT NULL,
            captured_at timestamp NOT NULL,
            created_at timestamp NOT NULL DEFAULT now(),
            updated_at timestamp NOT NULL DEFAULT now(),
            UNIQUE (profile_id, score_version)
        );
        CREATE TABLE lab_achievements (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id uuid NOT NULL REFERENCES lab_profiles(id) ON DELETE CASCADE,
            achievement_id text NOT NULL,
            unlocked_at timestamp NOT NULL DEFAULT now(),
            UNIQUE (profile_id, achievement_id)
        );
    `)

    const testDb = drizzle(postgres)
    vi.doMock('@/db/drizzle', () => ({ db: testDb }))
    vi.doMock('next/cache', () => ({ cacheLife: vi.fn() }))
    ;({ persistLabAnalysisV2 } = await import('../../../db/lab-analysis'))
    ;({ fetchLabProfilesByScore, fetchLabScoreDistribution } =
        await import('../../../db/queries'))
})

beforeEach(async () => {
    await postgres.exec(
        'TRUNCATE lab_achievements, lab_profile_scores, lab_profiles CASCADE;'
    )
})

afterAll(async () => {
    await postgres.close()
})

describe('Lab ranking V2 database integration', () => {
    it('atomically writes persona, V2 score, and achievements', async () => {
        const profile = await persistLabAnalysisV2(input())

        const storedProfiles = await rows<{
            character_id: string
            developer_score: number
        }>('SELECT character_id, developer_score FROM lab_profiles')
        const storedScores = await rows<{
            score_version: number
            developer_score: number
        }>('SELECT score_version, developer_score FROM lab_profile_scores')
        const storedAchievements = await rows<{ achievement_id: string }>(
            'SELECT achievement_id FROM lab_achievements'
        )

        expect(profile.characterId).toBe('jesse')
        expect(storedProfiles).toEqual([
            { character_id: 'jesse', developer_score: 42 },
        ])
        expect(storedScores).toEqual([
            { score_version: 2, developer_score: 67 },
        ])
        expect(storedAchievements).toEqual([
            { achievement_id: 'the-one-who-builds' },
        ])
    })

    it('rolls back every row when a later score write fails', async () => {
        await persistLabAnalysisV2(input())

        await expect(
            persistLabAnalysisV2(
                input({
                    username: 'changed-student',
                    characterId: 'todd',
                    score: 101,
                    achievements: ['no-half-measures'],
                })
            )
        ).rejects.toThrow()

        const storedProfiles = await rows<{
            github_username: string
            character_id: string
        }>('SELECT github_username, character_id FROM lab_profiles')
        const storedScores = await rows<{ developer_score: number }>(
            'SELECT developer_score FROM lab_profile_scores'
        )
        const storedAchievements = await rows<{ achievement_id: string }>(
            'SELECT achievement_id FROM lab_achievements'
        )

        expect(storedProfiles).toEqual([
            { github_username: 'student', character_id: 'jesse' },
        ])
        expect(storedScores).toEqual([{ developer_score: 67 }])
        expect(storedAchievements).toEqual([
            { achievement_id: 'the-one-who-builds' },
        ])
    })

    it('cleans legacy IDs only on first cutover and preserves them on rerun', async () => {
        const [legacyProfile] = await rows<{ id: string }>(
            `INSERT INTO lab_profiles (
                user_id, github_username, character_id,
                character_similarity, developer_score, trait_scores,
                github_snapshot, analyzed_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id`,
            [
                'user-1',
                'student',
                'jesse',
                88,
                42,
                { Discipline: 70 },
                { login: 'student' },
                analyzedAt,
            ]
        )
        await postgres.query(
            `INSERT INTO lab_achievements (
                profile_id, achievement_id, unlocked_at
            ) VALUES ($1, $2, $3)`,
            [legacyProfile!.id, 'no-half-measures', analyzedAt]
        )

        await persistLabAnalysisV2(input())
        await persistLabAnalysisV2(input({ achievements: [] }))

        const storedAchievements = await rows<{ achievement_id: string }>(
            'SELECT achievement_id FROM lab_achievements ORDER BY achievement_id'
        )
        expect(storedAchievements).toEqual([
            { achievement_id: 'the-one-who-builds' },
        ])
    })

    it('keeps leaderboard and distribution queries inside the V2 cohort', async () => {
        await persistLabAnalysisV2(input({ score: 80 }))
        await postgres.query(
            `INSERT INTO lab_profiles (
                user_id, github_username, character_id,
                character_similarity, developer_score, trait_scores,
                github_snapshot, analyzed_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                'user-v1-only',
                'legacy-student',
                'todd',
                90,
                99,
                {},
                {},
                analyzedAt,
            ]
        )

        const leaderboard = await fetchLabProfilesByScore()
        const distribution = await fetchLabScoreDistribution()

        expect(leaderboard).toHaveLength(1)
        expect(leaderboard[0]).toMatchObject({
            githubUsername: 'student',
            developerScore: 80,
            rankingScore: { scoreVersion: 2 },
        })
        expect(distribution).toEqual([{ developerScore: 80 }])
    })
})

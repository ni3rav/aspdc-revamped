'use server'

import { sql } from 'drizzle-orm'
import { db } from '@/db/drizzle'
import type {
    LabProfile,
    NewLabAchievement,
    NewLabProfile,
    NewLabProfileScore,
} from '@/db/types'

export type PersistLabAnalysisV2Input = {
    profile: NewLabProfile
    score: Omit<NewLabProfileScore, 'profileId'>
    achievements: NewLabAchievement[]
    /** One-time migration cleanup for achievement IDs whose V1 meaning changed. */
    replaceAchievementIds?: string[]
}

type PersistedProfileRow = {
    id: string
    user_id: string
    github_username: string
    character_id: string
    character_similarity: number
    developer_score: number
    trait_scores: Record<string, number>
    github_snapshot: Record<string, unknown>
    analyzed_at: Date | string
}

/**
 * Persists the persona, versioned competitive score, and durable achievements
 * in one PostgreSQL statement. A single data-changing CTE is used because the
 * repository's Neon HTTP driver does not support callback transactions.
 */
export async function persistLabAnalysisV2(
    input: PersistLabAnalysisV2Input
): Promise<LabProfile> {
    const replaceAchievementIds = input.replaceAchievementIds ?? []
    const cleanupCte =
        replaceAchievementIds.length === 0
            ? sql.empty()
            : sql`,
deleted_achievements AS (
    DELETE FROM lab_achievements
    WHERE
        profile_id = (SELECT id FROM upserted_profile)
        AND achievement_id IN (${sql.join(
            replaceAchievementIds.map((id) => sql`${id}`),
            sql`, `
        )})
    RETURNING id
)`
    const cleanupDependency =
        replaceAchievementIds.length === 0
            ? sql.empty()
            : sql`CROSS JOIN (SELECT count(*) FROM deleted_achievements) AS cleanup`
    const achievementCte =
        input.achievements.length === 0
            ? sql.empty()
            : sql`,
inserted_achievements AS (
    INSERT INTO lab_achievements (
        profile_id,
        achievement_id,
        unlocked_at
    )
    SELECT
        upserted_profile.id,
        pending.achievement_id,
        pending.unlocked_at
    FROM upserted_profile
    ${cleanupDependency}
    CROSS JOIN (
        VALUES ${sql.join(
            input.achievements.map(
                (achievement) =>
                    sql`(${achievement.achievementId}, ${
                        achievement.unlockedAt ?? input.profile.analyzedAt
                    })`
            ),
            sql`, `
        )}
    ) AS pending(achievement_id, unlocked_at)
    ON CONFLICT (profile_id, achievement_id)
    DO NOTHING
    RETURNING id
)`

    const result = await db.execute(sql`
WITH upserted_profile AS (
    INSERT INTO lab_profiles (
        user_id,
        github_username,
        character_id,
        character_similarity,
        developer_score,
        trait_scores,
        github_snapshot,
        analyzed_at
    )
    VALUES (
        ${input.profile.userId},
        ${input.profile.githubUsername},
        ${input.profile.characterId},
        ${input.profile.characterSimilarity},
        ${input.profile.developerScore},
        ${JSON.stringify(input.profile.traitScores)}::jsonb,
        ${JSON.stringify(input.profile.githubSnapshot)}::jsonb,
        ${input.profile.analyzedAt}
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        github_username = EXCLUDED.github_username,
        character_id = EXCLUDED.character_id,
        character_similarity = EXCLUDED.character_similarity,
        developer_score = EXCLUDED.developer_score,
        trait_scores = EXCLUDED.trait_scores,
        github_snapshot = EXCLUDED.github_snapshot,
        analyzed_at = EXCLUDED.analyzed_at
    RETURNING *
),
upserted_score AS (
    INSERT INTO lab_profile_scores (
        profile_id,
        score_version,
        developer_score,
        pillar_scores,
        ranking_snapshot,
        captured_at
    )
    SELECT
        upserted_profile.id,
        ${input.score.scoreVersion},
        ${input.score.developerScore},
        ${JSON.stringify(input.score.pillarScores)}::jsonb,
        ${JSON.stringify(input.score.rankingSnapshot)}::jsonb,
        ${input.score.capturedAt}
    FROM upserted_profile
    ON CONFLICT (profile_id, score_version)
    DO UPDATE SET
        developer_score = EXCLUDED.developer_score,
        pillar_scores = EXCLUDED.pillar_scores,
        ranking_snapshot = EXCLUDED.ranking_snapshot,
        captured_at = EXCLUDED.captured_at,
        updated_at = now()
    RETURNING id
)
${cleanupCte}
${achievementCte}
SELECT
    id,
    user_id,
    github_username,
    character_id,
    character_similarity,
    developer_score,
    trait_scores,
    github_snapshot,
    analyzed_at
FROM upserted_profile
`)

    const row = result.rows[0] as PersistedProfileRow | undefined
    if (!row) {
        throw new Error('Lab analysis persistence returned no profile.')
    }

    return {
        id: row.id,
        userId: row.user_id,
        githubUsername: row.github_username,
        characterId: row.character_id,
        characterSimilarity: row.character_similarity,
        developerScore: row.developer_score,
        traitScores: row.trait_scores,
        githubSnapshot: row.github_snapshot,
        analyzedAt: new Date(row.analyzed_at),
    }
}

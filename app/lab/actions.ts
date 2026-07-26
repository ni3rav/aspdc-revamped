'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { persistLabAnalysisV2 } from '@/db/lab-analysis'
import { findLabProfileByUserId } from '@/db/queries'
import {
    persistGitHubSnapshot,
    readPersistedGitHubSnapshot,
    resolveGitHubSnapshot,
    type AnalysisPipelineResult,
} from '@/lib/lab/analyze'
import { auth } from '@/lib/auth'
import { fetchGitHubSnapshot } from '@/lib/lab/github'
import { getGitHubAccessToken } from '@/lib/lab/github-token'
import {
    DURABLE_RANKING_ACHIEVEMENT_IDS,
    unlockDurableRankingAchievements,
} from '@/lib/lab/achievements'
import { runLabAnalysisV2 } from '@/lib/lab/ranking/analyze'
import { fetchGitHubRankingSnapshot } from '@/lib/lab/ranking/github'
import type { RankingPillarScores } from '@/lib/lab/ranking/types'

export type AnalyzeLabProfileSuccess = {
    ok: true
    profile: {
        id: string
        githubUsername: string
        characterId: string
        characterSimilarity: number
        developerScore: number
        scoreVersion: number
        pillarScores: RankingPillarScores
        traitScores: AnalysisPipelineResult['traitScores']
        characterMatches: AnalysisPipelineResult['characterMatches']
        achievements: AnalysisPipelineResult['achievements']
        analyzedAt: string
    }
}

export type AnalyzeLabProfileError = {
    ok: false
    error: 'unauthenticated' | 'no_github' | 'github_api' | 'unknown'
    message: string
}

export type AnalyzeLabProfileResult =
    AnalyzeLabProfileSuccess | AnalyzeLabProfileError

export async function analyzeLabProfile(): Promise<AnalyzeLabProfileResult> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.user?.id) {
            return {
                ok: false,
                error: 'unauthenticated',
                message: 'You must be signed in to run an analysis.',
            }
        }

        const userId = session.user.id

        let accessToken: string
        try {
            accessToken = await getGitHubAccessToken(userId)
        } catch {
            return {
                ok: false,
                error: 'no_github',
                message:
                    'No GitHub account is linked. Sign in with GitHub and try again.',
            }
        }

        const existing = await findLabProfileByUserId(userId)
        const cached = existing
            ? readPersistedGitHubSnapshot(existing.githubSnapshot)
            : null

        let resolved: Awaited<ReturnType<typeof resolveGitHubSnapshot>>
        let rankingSnapshot: Awaited<
            ReturnType<typeof fetchGitHubRankingSnapshot>
        >
        const capturedAt = new Date()
        try {
            ;[resolved, rankingSnapshot] = await Promise.all([
                resolveGitHubSnapshot({
                    cached,
                    fetchFresh: () => fetchGitHubSnapshot(accessToken),
                    now: capturedAt,
                }),
                fetchGitHubRankingSnapshot(accessToken, capturedAt),
            ])
        } catch (error) {
            console.error('Lab GitHub collection failed', {
                userId,
                error:
                    error instanceof Error
                        ? { name: error.name, message: error.message }
                        : 'Unknown GitHub collection error',
            })
            return {
                ok: false,
                error: 'github_api',
                message:
                    'GitHub activity could not be collected completely. Your previous score was kept.',
            }
        }

        const analysis = runLabAnalysisV2(resolved.snapshot, rankingSnapshot)
        const analyzedAt = capturedAt
        const durableRankingAchievements = unlockDurableRankingAchievements(
            analysis.ranking
        )

        const profile = await persistLabAnalysisV2({
            profile: {
                userId,
                githubUsername: analysis.persona.githubUsername,
                characterId: analysis.persona.characterId,
                characterSimilarity: analysis.persona.characterSimilarity,
                // Kept temporarily as the version-1 rollback value.
                developerScore: analysis.persona.developerScore,
                traitScores: analysis.persona.traitScores,
                githubSnapshot: persistGitHubSnapshot(
                    analysis.persona.githubSnapshot,
                    resolved.capturedAt
                ),
                analyzedAt,
            },
            score: {
                scoreVersion: analysis.ranking.scoreVersion,
                developerScore: analysis.ranking.developerScore,
                pillarScores: analysis.ranking.pillars,
                rankingSnapshot: analysis.persistedRankingSnapshot,
                capturedAt: new Date(
                    analysis.persistedRankingSnapshot.capturedAt
                ),
            },
            achievements: [
                ...analysis.persona.achievements,
                ...durableRankingAchievements,
            ].map((achievement) => ({
                achievementId: achievement.id,
                unlockedAt: analyzedAt,
            })),
            replaceAchievementIds: [...DURABLE_RANKING_ACHIEVEMENT_IDS],
        })

        try {
            revalidatePath(`/lab/${analysis.persona.githubUsername}`)
            revalidatePath('/lab')
        } catch {
            // Ignore cache revalidation errors if outside request context
        }

        return {
            ok: true,
            profile: {
                id: profile.id,
                githubUsername: profile.githubUsername,
                characterId: profile.characterId,
                characterSimilarity: profile.characterSimilarity,
                developerScore: analysis.ranking.developerScore,
                scoreVersion: analysis.ranking.scoreVersion,
                pillarScores: analysis.ranking.pillars,
                traitScores: analysis.persona.traitScores,
                characterMatches: analysis.persona.characterMatches,
                achievements: [
                    ...analysis.persona.achievements,
                    ...durableRankingAchievements,
                ],
                analyzedAt: analyzedAt.toISOString(),
            },
        }
    } catch (error) {
        return {
            ok: false,
            error: 'unknown',
            message:
                error instanceof Error
                    ? error.message
                    : 'Analysis failed unexpectedly.',
        }
    }
}

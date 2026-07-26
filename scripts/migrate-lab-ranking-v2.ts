import { config } from 'dotenv'

config({ path: '.env.local' })

async function main() {
    const apply = process.argv.includes('--apply')
    const [
        { db },
        { account, labProfiles },
        { and, eq },
        { fetchGitHubRankingSnapshot },
        {
            createPersistedRankingSnapshotV2,
            getDeveloperScoreBand,
            scoreRankingSnapshotV2,
        },
        { RANKING_SCORE_VERSION },
        { unlockDurableRankingAchievements },
        { persistLabAnalysisV2 },
    ] = await Promise.all([
        import('@/db/drizzle'),
        import('@/db/schema'),
        import('drizzle-orm'),
        import('@/lib/lab/ranking/github'),
        import('@/lib/lab/ranking/score'),
        import('@/lib/lab/ranking/types'),
        import('@/lib/lab/achievements'),
        import('@/db/lab-analysis'),
    ])

    const profileRows = await db
        .select({
            profile: labProfiles,
            accessToken: account.accessToken,
        })
        .from(labProfiles)
        .leftJoin(
            account,
            and(
                eq(account.userId, labProfiles.userId),
                eq(account.providerId, 'github')
            )
        )
    const profiles = [
        ...new Map(
            profileRows.map((row) => [row.profile.id, row] as const)
        ).values(),
    ]

    console.log(
        `${apply ? 'APPLY' : 'DRY RUN'}: evaluating ${profiles.length} lab profiles`
    )

    let written = 0
    let skipped = 0
    let failed = 0
    const candidates: Array<{
        profile: (typeof profiles)[number]['profile']
        ranking: ReturnType<typeof scoreRankingSnapshotV2>
        persistedSnapshot: ReturnType<typeof createPersistedRankingSnapshotV2>
        capturedAt: Date
        achievements: Array<{
            achievementId: string
            unlockedAt: Date
        }>
    }> = []

    for (const { profile, accessToken } of profiles) {
        if (!accessToken) {
            skipped += 1
            console.log(`SKIP @${profile.githubUsername}: no GitHub token`)
            continue
        }

        try {
            const rankingSnapshot =
                await fetchGitHubRankingSnapshot(accessToken)
            const ranking = scoreRankingSnapshotV2(rankingSnapshot)
            const persistedSnapshot = createPersistedRankingSnapshotV2(
                rankingSnapshot,
                ranking
            )
            const capturedAt = new Date(rankingSnapshot.capturedAt)
            const achievements = unlockDurableRankingAchievements(ranking).map(
                (achievement) => ({
                    achievementId: achievement.id,
                    unlockedAt: capturedAt,
                })
            )

            candidates.push({
                profile,
                ranking,
                persistedSnapshot,
                capturedAt,
                achievements,
            })
        } catch (error) {
            failed += 1
            const message =
                error instanceof Error ? error.message : 'Unknown failure'
            console.error(`FAIL @${profile.githubUsername}: ${message}`)
        }
    }

    const oldScores = profiles.map(({ profile }) => profile.developerScore)
    const newScores = candidates.map(({ ranking }) => ranking.developerScore)
    const competitionRank = (score: number, cohort: number[]) =>
        1 + cohort.filter((candidateScore) => candidateScore > score).length

    for (const candidate of candidates) {
        const {
            profile,
            ranking,
            persistedSnapshot,
            capturedAt,
            achievements,
        } = candidate
        const oldRank = competitionRank(profile.developerScore, oldScores)
        const newRank = competitionRank(ranking.developerScore, newScores)
        const movement = oldRank - newRank
        console.log(
            [
                `${apply ? 'WRITE' : 'READY'} @${profile.githubUsername}`,
                `V1 ${profile.developerScore} (#${oldRank})`,
                `V2 ${ranking.developerScore} (#${newRank}, ${movement >= 0 ? '+' : ''}${movement})`,
                getDeveloperScoreBand(ranking.developerScore),
                `pillars ${JSON.stringify(ranking.pillars)}`,
                `character ${profile.characterId} unchanged`,
            ].join(' | ')
        )

        if (!apply) continue

        try {
            await persistLabAnalysisV2({
                profile: {
                    userId: profile.userId,
                    githubUsername: profile.githubUsername,
                    characterId: profile.characterId,
                    characterSimilarity: profile.characterSimilarity,
                    developerScore: profile.developerScore,
                    traitScores: profile.traitScores,
                    githubSnapshot: profile.githubSnapshot,
                    analyzedAt: profile.analyzedAt,
                },
                score: {
                    scoreVersion: RANKING_SCORE_VERSION,
                    developerScore: ranking.developerScore,
                    pillarScores: ranking.pillars,
                    rankingSnapshot: persistedSnapshot,
                    capturedAt,
                },
                achievements,
            })
            written += 1
        } catch (error) {
            failed += 1
            const message =
                error instanceof Error ? error.message : 'Unknown failure'
            console.error(`WRITE FAIL @${profile.githubUsername}: ${message}`)
        }
    }

    const bandDistribution = candidates.reduce<Record<string, number>>(
        (counts, { ranking }) => {
            const band = getDeveloperScoreBand(ranking.developerScore)
            counts[band] = (counts[band] ?? 0) + 1
            return counts
        },
        {}
    )
    console.log(`V2 score bands: ${JSON.stringify(bandDistribution)}`)
    console.log(
        `Complete: evaluated=${candidates.length} written=${written} skipped=${skipped} failed=${failed}`
    )
    if (!apply) {
        console.log(
            'No data was changed. Re-run with --apply only after reviewing this calibration report.'
        )
    }

    if (failed > 0) process.exitCode = 1
}

main().catch((error) => {
    const message = error instanceof Error ? error.message : 'Unknown failure'
    console.error(`Migration aborted before profile processing: ${message}`)
    process.exitCode = 1
})

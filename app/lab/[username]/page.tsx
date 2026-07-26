import { Suspense } from 'react'
import {
    fetchLabAchievementsByProfileId,
    fetchLabProfileByGithubUsername,
    fetchLabProfileScoreByProfileId,
    fetchLabScoreDistribution,
} from '@/db/queries'
import { getProfileDisplayData } from '@/lib/lab/profile'
import {
    calculateRankingStats,
    createScoreHistogram,
} from '@/lib/lab/ranking/rank'
import { CharacterHero } from '@/components/lab/character-hero'
import { TopMatches } from '@/components/lab/top-matches'
import { TraitRadarChart } from '@/components/lab/trait-radar'
import { AchievementsGrid } from '@/components/lab/achievements-grid'
import { RankingDistribution } from '@/components/lab/ranking-distribution'
import { RankingOverview } from '@/components/lab/ranking-overview'
import { NotFoundDossier } from '@/components/lab/not-found-dossier'
import { MetricsExplanation } from '@/components/lab/metrics-explanation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params
    const profile = await fetchLabProfileByGithubUsername(username)

    if (!profile) {
        return {
            title: `Developer Not Found | Breaking Devs`,
            description: `No developer profile found for @${username}.`,
        }
    }

    const displayData = getProfileDisplayData(profile)
    const title = `@${profile.githubUsername}'s Developer Profile | Breaking Devs`
    const description = `GitHub developer analysis for @${profile.githubUsername}. Persona match: ${displayData.primaryCharacter.name} (${displayData.primarySimilarity.toFixed(2)}% match).`
    const ogImageUrl = `/api/lab/og/${encodeURIComponent(profile.githubUsername)}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: `@${profile.githubUsername}'s Breaking Dev Dossier`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
    }
}

async function ProfileContent({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params
    const profile = await fetchLabProfileByGithubUsername(username)

    if (!profile) {
        return <NotFoundDossier username={username} />
    }

    const [dbAchievementIds, rankingScore, distributionRows] =
        await Promise.all([
            fetchLabAchievementsByProfileId(profile.id),
            fetchLabProfileScoreByProfileId(profile.id),
            fetchLabScoreDistribution(),
        ])

    const participantScores =
        distributionRows?.map(({ developerScore }) => developerScore) ?? []
    const rankingStats =
        rankingScore && participantScores.length > 0
            ? calculateRankingStats(
                  rankingScore.developerScore,
                  participantScores
              )
            : null
    const displayData = getProfileDisplayData(profile, dbAchievementIds, {
        rank: rankingStats?.rank,
        includeRankingAchievements: Boolean(rankingScore),
    })

    const primaryExplanation =
        displayData.topMatches[0]?.explanation ||
        displayData.primaryCharacter.summary

    return (
        <div className="bg-background text-foreground min-h-screen font-sans">
            {/* Section 1: Character Reveal Hero */}
            <CharacterHero
                username={profile.githubUsername}
                character={displayData.primaryCharacter}
                similarity={displayData.primarySimilarity}
                developerScore={rankingScore?.developerScore}
                explanation={primaryExplanation}
                profileUserId={profile.userId}
            />

            {/* Section 2: Top 3 Character Matches */}
            <TopMatches matches={displayData.topMatches} />

            {/* Section 3: Trait Radar Chart */}
            <TraitRadarChart traits={displayData.traits} />

            {/* Section 4: Versioned competitive ranking */}
            {rankingScore ? (
                <>
                    <RankingOverview
                        score={rankingScore}
                        stats={rankingStats ?? undefined}
                    />
                    {rankingStats ? (
                        <RankingDistribution
                            userScore={rankingScore.developerScore}
                            username={profile.githubUsername}
                            stats={rankingStats}
                            histogram={createScoreHistogram(participantScores)}
                        />
                    ) : (
                        <RankingUnavailable />
                    )}
                </>
            ) : (
                <UnrankedProfile username={profile.githubUsername} />
            )}

            {/* Section 5: Persona and ranking achievements */}
            <AchievementsGrid
                achievements={displayData.personaAchievements}
                totalAvailable={8}
                eyebrow="Persona milestones"
                title="Character & trait achievements"
                description={`${displayData.personaAchievements.length} of 8 persona milestones unlocked by the separate character-analysis pipeline.`}
                emptyDescription="No persona milestones are unlocked for this dossier yet."
            />
            <AchievementsGrid
                achievements={displayData.rankingAchievements}
                totalAvailable={5}
                eyebrow="Competitive milestones"
                title="Version 2 ranking achievements"
                description={`${displayData.rankingAchievements.length} of 5 ranking milestones unlocked from version 2 public evidence and current cohort rank.`}
                emptyDescription="No version 2 ranking milestones are unlocked yet."
            />

            {/* Section 6: Methodology & Metrics Explanation */}
            <MetricsExplanation />
        </div>
    )
}

function RankingUnavailable() {
    return (
        <section className="bg-background px-4 py-12">
            <Card className="mx-auto w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Current rank temporarily unavailable</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                    The version 2 score is preserved, but the analyzed cohort
                    could not be loaded. No rank or rank-dependent achievement
                    is shown until the cohort is available.
                </CardContent>
            </Card>
        </section>
    )
}

function UnrankedProfile({ username }: { username: string }) {
    return (
        <section className="bg-background px-4 py-12">
            <Card className="mx-auto w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Competitive score not yet available</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground flex flex-col items-start gap-4 leading-relaxed">
                    <p>
                        @{username}&apos;s character dossier is preserved, but
                        this profile has not completed the version 2 public
                        90-day analysis and is not included in the leaderboard.
                    </p>
                    <Link
                        href="/lab/analyze"
                        prefetch={false}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors"
                    >
                        Run version 2 analysis
                    </Link>
                </CardContent>
            </Card>
        </section>
    )
}

export default function LabProfilePage({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    return (
        <Suspense
            fallback={
                <div className="bg-background flex min-h-[calc(100vh-4rem)] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
                        <p className="text-muted-foreground font-mono text-xs">
                            DECRYPTING SUBJECT DOSSIER...
                        </p>
                    </div>
                </div>
            }
        >
            <ProfileContent params={params} />
        </Suspense>
    )
}

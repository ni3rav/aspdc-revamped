import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import type { LabProfileScore } from '@/db/types'
import { getDeveloperScoreBand } from '@/lib/lab/ranking/score'
import type { RankingStats } from '@/lib/lab/ranking/rank'

type RankingOverviewProps = {
    score: LabProfileScore
    stats?: RankingStats
}

const PILLARS = [
    {
        key: 'sustainedActivity',
        label: 'Sustained activity',
        weight: '30%',
    },
    { key: 'building', label: 'Building', weight: '30%' },
    {
        key: 'collaboration',
        label: 'External collaboration',
        weight: '25%',
    },
    { key: 'stewardship', label: 'Stewardship', weight: '15%' },
] as const

export function RankingOverview({ score, stats }: RankingOverviewProps) {
    const credited = score.rankingSnapshot.credited
    const capturedLabel = new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: 'UTC',
    }).format(score.capturedAt)
    const windowFormatter = new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC',
    })
    const windowStartLabel = windowFormatter.format(
        new Date(score.rankingSnapshot.windowStart)
    )
    const windowEndLabel = windowFormatter.format(
        new Date(score.rankingSnapshot.windowEnd)
    )

    return (
        <section
            aria-labelledby="ranking-overview-title"
            className="bg-background px-4 py-12"
        >
            <Card className="mx-auto w-full max-w-4xl overflow-hidden">
                <CardHeader className="border-b">
                    <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <CardTitle
                                id="ranking-overview-title"
                                className="text-2xl"
                            >
                                Competitive score
                            </CardTitle>
                            <CardDescription className="mt-2 max-w-[70ch] text-base leading-relaxed">
                                Recent public engineering activity and
                                stewardship over a rolling 90-day window,
                                calibrated for undergraduate and early-career
                                developers.
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                            <Badge variant="secondary">
                                Score {score.developerScore}/100
                            </Badge>
                            <Badge variant="outline">
                                {getDeveloperScoreBand(score.developerScore)}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-8">
                    <div>
                        <h3 className="mb-3 text-sm font-semibold">
                            Four scoring pillars
                        </h3>
                        <dl className="border-border grid border-y sm:grid-cols-2 sm:[&>div:nth-child(odd)]:border-r">
                            {PILLARS.map((pillar, index) => (
                                <div
                                    key={pillar.key}
                                    className="border-border flex items-center justify-between gap-4 border-b px-4 py-4 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
                                >
                                    <div className="min-w-0">
                                        <dt className="font-medium">
                                            {pillar.label}
                                        </dt>
                                        <dd className="text-muted-foreground text-sm">
                                            {pillar.weight} of final score
                                        </dd>
                                    </div>
                                    <span
                                        className="font-mono text-xl font-bold tabular-nums"
                                        aria-label={`${Math.round(score.pillarScores[pillar.key])} out of 100`}
                                    >
                                        {Math.round(
                                            score.pillarScores[pillar.key]
                                        )}
                                    </span>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div>
                        <h3 className="mb-3 text-sm font-semibold">
                            Credited public evidence
                        </h3>
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                            <Aggregate
                                label="Active days"
                                value={credited.activeDays}
                            />
                            <Aggregate
                                label="Active weeks"
                                value={credited.activeWeeks}
                            />
                            <Aggregate
                                label="Credited commits"
                                value={credited.creditedCommits}
                            />
                            <Aggregate
                                label="Active original repos"
                                value={credited.activeOriginalRepositories}
                            />
                            <Aggregate
                                label="External PR points"
                                value={credited.creditedPullRequestPoints}
                            />
                            <Aggregate
                                label="External reviews"
                                value={credited.creditedReviews}
                            />
                            <Aggregate
                                label="External issues"
                                value={credited.creditedIssues}
                            />
                            <Aggregate
                                label="Analyzed rank"
                                value={
                                    stats
                                        ? `${stats.rank} of ${stats.participantCount}`
                                        : 'Unavailable'
                                }
                            />
                        </dl>
                    </div>
                </CardContent>

                <CardFooter className="text-muted-foreground flex flex-col items-start gap-2 border-t text-sm">
                    <span>
                        Window {windowStartLabel} → {windowEndLabel} UTC
                    </span>
                    <span>Captured {capturedLabel} UTC · Score version 2</span>
                    <span>
                        Stars, forks received, followers, and fork creation
                        carry no ranking weight.
                    </span>
                </CardFooter>
            </Card>
        </section>
    )
}

function Aggregate({
    label,
    value,
}: {
    label: string
    value: number | string
}) {
    return (
        <div className="min-w-0">
            <dt className="text-muted-foreground text-sm leading-snug">
                {label}
            </dt>
            <dd className="mt-1 font-mono text-lg font-bold tabular-nums">
                {value}
            </dd>
        </div>
    )
}

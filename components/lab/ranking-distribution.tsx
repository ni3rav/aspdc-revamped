'use client'

import {
    Bar,
    BarChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import type { RankingStats, ScoreHistogramBucket } from '@/lib/lab/ranking/rank'

type RankingDistributionProps = {
    userScore: number
    username: string
    stats: RankingStats
    histogram: ScoreHistogramBucket[]
}

export function RankingDistribution({
    userScore,
    username,
    stats,
    histogram,
}: RankingDistributionProps) {
    return (
        <section
            aria-labelledby="ranking-distribution-title"
            className="bg-background px-4 py-12"
        >
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-7">
                <div className="text-center">
                    <h2
                        id="ranking-distribution-title"
                        className="text-2xl font-extrabold tracking-tight sm:text-3xl"
                    >
                        Among analyzed developers
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-2 max-w-[65ch] text-base leading-relaxed">
                        @{username}&apos;s displayed score is compared only with
                        profiles that have a version 2 analysis.
                    </p>
                </div>

                <div className="border-border bg-card overflow-hidden rounded-xl border shadow-md">
                    <dl className="border-border grid grid-cols-2 border-b sm:grid-cols-4">
                        <Statistic
                            label="Competition rank"
                            value={`#${stats.rank}`}
                        />
                        <Statistic
                            label="Participants"
                            value={stats.participantCount}
                        />
                        <Statistic
                            label="Higher than"
                            value={`${stats.higherThanPercent}%`}
                        />
                        <Statistic
                            label="Top share"
                            value={`${stats.topPercent}%`}
                        />
                    </dl>

                    <div className="p-4 sm:p-6">
                        <div
                            className="h-[320px] w-full"
                            role="img"
                            aria-label={`Actual version 2 score distribution. ${stats.participantCount} analyzed developers. ${username} has score ${userScore} and rank ${stats.rank}.`}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={histogram}
                                    margin={{
                                        top: 16,
                                        right: 12,
                                        bottom: 12,
                                        left: -12,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        stroke="var(--border)"
                                    />
                                    <XAxis
                                        dataKey="label"
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{
                                            fill: 'var(--muted)',
                                            opacity: 0.4,
                                        }}
                                        content={({ active, payload }) => {
                                            const bucket = payload?.[0]
                                                ?.payload as
                                                ScoreHistogramBucket | undefined
                                            if (!active || !bucket) return null
                                            return (
                                                <div className="border-border bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-sm shadow-md">
                                                    <div className="font-medium">
                                                        Score {bucket.label}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {bucket.count} analyzed
                                                        developer
                                                        {bucket.count === 1
                                                            ? ''
                                                            : 's'}
                                                    </div>
                                                </div>
                                            )
                                        }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="var(--primary)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <ReferenceLine
                                        x={
                                            histogram[
                                                Math.min(
                                                    9,
                                                    Math.floor(userScore / 10)
                                                )
                                            ]?.label
                                        }
                                        stroke="var(--foreground)"
                                        strokeDasharray="4 4"
                                        label={{
                                            value: 'You',
                                            fill: 'var(--foreground)',
                                            fontSize: 12,
                                            position: 'top',
                                        }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <ul className="sr-only">
                            {histogram.map((bucket) => (
                                <li key={bucket.start}>
                                    Score {bucket.label}: {bucket.count}{' '}
                                    participants
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

function Statistic({
    label,
    value,
}: {
    label: string
    value: number | string
}) {
    return (
        <div className="border-border min-w-0 border-b p-4 last:border-b-0 odd:border-r sm:border-r sm:border-b-0 sm:last:border-r-0">
            <dt className="text-muted-foreground text-sm">{label}</dt>
            <dd className="mt-1 font-mono text-2xl font-extrabold tabular-nums">
                {value}
            </dd>
        </div>
    )
}

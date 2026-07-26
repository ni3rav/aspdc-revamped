'use client'

import { useId, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TRAIT_IDS, type TraitId } from '@/lib/lab/types'
import { getTraitLabel, getTraitDescription } from '@/lib/lab/traits'

// ─── Shared accordion item ────────────────────────────────────────────────────

function AccordionItem({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false)
    const contentId = useId()

    return (
        <div className="border-border overflow-hidden rounded-lg border">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={contentId}
                className="hover:bg-muted/40 flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors"
            >
                <span className="text-foreground text-base font-semibold">
                    {title}
                </span>
                <span className="text-muted-foreground shrink-0 text-xs">
                    {open ? '▲' : '▼'}
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        id={contentId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="border-border border-t px-4 py-4 text-base leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Trait accordion item ─────────────────────────────────────────────────────

function TraitAccordionItem({
    traitId,
    rank,
}: {
    traitId: TraitId
    rank: number
}) {
    const [open, setOpen] = useState(false)
    const contentId = useId()
    const label = getTraitLabel(traitId)
    const description = getTraitDescription(traitId)

    return (
        <div className="border-border overflow-hidden rounded-lg border">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={contentId}
                className="hover:bg-muted/40 flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground w-6 shrink-0 font-mono text-xs">
                        {rank}.
                    </span>
                    <span className="text-foreground text-base font-semibold">
                        {label}
                    </span>
                </div>
                <span className="text-muted-foreground shrink-0 text-xs">
                    {open ? '▲' : '▼'}
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        id={contentId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <p className="border-border text-muted-foreground border-t px-4 py-3 text-base leading-relaxed">
                            {description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MetricsExplanation() {
    return (
        <section className="bg-background text-foreground relative w-full px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex w-full max-w-4xl flex-col gap-8"
            >
                {/* Section Header */}
                <div className="text-center">
                    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                        Methodology
                    </span>
                    <h2 className="text-foreground mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        How Your Profile is Built
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-base leading-relaxed">
                        The competitive score uses recent public evidence. The
                        character match uses a separate persona model and is not
                        used to rank developers.
                    </p>
                </div>

                {/* Block 1: Developer Score */}
                <div>
                    <h3 className="text-foreground mb-3 text-lg font-bold">
                        Developer Score (0 – 100)
                    </h3>
                    <div className="flex flex-col gap-2">
                        <AccordionItem title="Sustained activity — 30%">
                            <p className="text-muted-foreground">
                                Credits active days and weeks across a rolling
                                90-day public window. Active weeks reach full
                                credit at 13 and active days at 36; the pillar
                                combines them 65/35. Fifty contributions on one
                                day still count as one active day.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="Building — 30%">
                            <p className="text-muted-foreground">
                                Credits capped commit activity and work across
                                active original repositories. At most five
                                commits per UTC day count, with diminishing
                                returns reaching full commit credit at 90.
                                Active original repositories reach full credit
                                at five. The pillar combines commits and
                                repositories 70/30.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="External collaboration — 25%">
                            <p className="text-muted-foreground">
                                Credits public pull requests, reviews, and
                                issues in repositories you do not own. Pull
                                requests reach full credit at 12 points, reviews
                                at 24, and issues at 10, all with diminishing
                                returns. Their subweights are 45% pull requests,
                                35% reviews, and 20% issues. Merged pull
                                requests earn one point, open pull requests earn
                                half, and closed unmerged pull requests earn
                                none. Pull-request credit is capped at 2 points
                                per day and 4 per repository; reviews at 4 per
                                day and 10 per repository; issues at 2 per day
                                and 4 per repository.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="Repository stewardship — 15%">
                            <p className="text-muted-foreground">
                                The five strongest hygiene scores among active
                                original repositories contribute to a fixed
                                five-repository maximum, so adding qualifying
                                work cannot lower the pillar. Each is scored for
                                a GitHub-resolved README (40%), description
                                (25%), topics (15%), license (10%), and at least
                                one release or tag (10%). GitHub&apos;s README
                                resolution covers supported formats in the
                                .github, root, and docs locations.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="Functions and rounding">
                            <p className="text-muted-foreground">
                                Every diminishing-return input x with cap c is
                                scored as 100 × √(clamp(x, 0, c) ÷ c). Linear
                                inputs use 100 × clamp(x, 0, c) ÷ c. Pillars
                                keep full precision; only the final weighted
                                score is rounded to an integer and clamped from
                                0 to 100.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="What carries zero ranking weight">
                            <p className="text-muted-foreground">
                                Stars, forks received, follower counts, private
                                or restricted activity, language popularity, and
                                merely creating a fork do not change the score.
                                Work from a fork counts only when it becomes a
                                qualifying public upstream pull request or
                                review.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="What the score cannot prove">
                            <p className="text-muted-foreground">
                                The score summarizes visible GitHub evidence; it
                                does not measure code quality, difficulty,
                                learning progress, teamwork outside GitHub, or a
                                developer&apos;s overall ability.
                            </p>
                        </AccordionItem>
                    </div>
                </div>

                {/* Block 2: Archetype Matching */}
                <div>
                    <h3 className="text-foreground mb-3 text-lg font-bold">
                        Archetype Match %
                    </h3>
                    <div className="flex flex-col gap-2">
                        <AccordionItem title="How matching works">
                            <p className="text-muted-foreground">
                                Your 15 trait scores form a 15-dimensional
                                vector. We compare your coding profile against
                                each developer archetype using a blended
                                similarity algorithm combining vector direction
                                with signature trait emphasis. The percentage
                                measures how closely your developer habits align
                                with that archetype.
                            </p>
                        </AccordionItem>
                        <AccordionItem title="What the percentages mean">
                            <ul className="text-muted-foreground flex flex-col gap-2">
                                <li>
                                    <strong className="text-foreground">
                                        90–100%
                                    </strong>{' '}
                                    — Your habits are an almost identical
                                    pattern to this archetype.
                                </li>
                                <li>
                                    <strong className="text-foreground">
                                        70–89%
                                    </strong>{' '}
                                    — Strong alignment. You share most of the
                                    same tendencies.
                                </li>
                                <li>
                                    <strong className="text-foreground">
                                        50–69%
                                    </strong>{' '}
                                    — Moderate match. Some traits align, others
                                    diverge.
                                </li>
                                <li>
                                    <strong className="text-foreground">
                                        Below 50%
                                    </strong>{' '}
                                    — Weak match. Your coding style is quite
                                    different from this archetype.
                                </li>
                            </ul>
                        </AccordionItem>
                    </div>
                </div>

                {/* Block 3: What each trait measures */}
                <div>
                    <h3 className="text-foreground mb-1 text-lg font-bold">
                        What each trait measures
                    </h3>
                    <p className="text-muted-foreground mb-3 text-base leading-relaxed">
                        Each of the 15 traits is scored 0–100. Click any trait
                        to read what it measures and what a high score means.
                    </p>
                    <div className="flex flex-col gap-2">
                        {TRAIT_IDS.map((traitId, idx) => (
                            <TraitAccordionItem
                                key={traitId}
                                traitId={traitId as TraitId}
                                rank={idx + 1}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

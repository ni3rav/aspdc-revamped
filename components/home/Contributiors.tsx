import { cacheLife } from 'next/cache'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TextScramble } from '../motion-primitives/text-scramble'
import { TextEffect } from '../motion-primitives/text-effect'
import { InteractiveHoverButton } from '../magicui/interactive-hover-button'
import {
    AvatarGroup,
    AvatarGroupItem,
    AvatarGroupTooltip,
} from '../ui/avatar-group'

type Contributor = {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    user_view_type: string
    site_admin: boolean
    contributions: number
}

async function fetchContributors(): Promise<Contributor[]> {
    'use cache'
    cacheLife('hours')

    try {
        const response = await fetch(
            'https://api.github.com/repos/aspdc/aspdc-revamped/contributors'
        )
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching contributors', error)
        return []
    }
}

const chunkContributors = <T,>(items: T[], size: number) => {
    const result: T[][] = []
    for (let i = 0; i < items.length; i += size) {
        result.push(items.slice(i, i + size))
    }
    return result
}

const Contributiors = async () => {
    const data: Contributor[] = await fetchContributors()
    const contributors = data
        .filter((contributor) => Boolean(contributor.avatar_url))
        .filter((contributor) => contributor.login !== 'aspdc')
        .sort((a, b) => b.contributions - a.contributions)

    if (!contributors.length) {
        return (
            <section className="flex min-h-screen flex-col items-center justify-center py-20 text-center">
                <TextScramble
                    duration={1}
                    className="text-primary text-5xl font-extrabold tracking-tight md:text-7xl"
                >
                    Contributors
                </TextScramble>
                <TextEffect
                    per="char"
                    preset="blur"
                    speedReveal={2}
                    className="mt-6 max-w-2xl px-5 text-xl text-gray-400 md:px-0 md:text-2xl"
                >
                    We&apos;re fetching the contributor list from GitHub. Please
                    check back soon!
                </TextEffect>
            </section>
        )
    }

    const contributorRows = chunkContributors<Contributor>(contributors, 4)

    return (
        <section className="flex min-h-screen flex-col items-center justify-center py-20 text-center">
            {/* Title */}
            <TextScramble
                duration={1}
                className="text-primary text-5xl font-extrabold tracking-tight md:text-7xl"
            >
                Contributors
            </TextScramble>

            {/* Description */}
            <TextEffect
                per="char"
                preset="blur"
                speedReveal={2}
                className="mt-6 max-w-2xl px-5 text-xl text-gray-400 md:px-0 md:text-2xl"
            >
                The incredible contributors who made this website possible.
            </TextEffect>

            {/* Avatar Group */}
            <div className="my-12 flex flex-col items-center gap-8">
                {contributorRows.map((row, rowIndex) => (
                    <AvatarGroup
                        key={`contributor-row-${rowIndex}`}
                        animation={rowIndex % 2 === 0 ? 'default' : 'flip'}
                        className="!grid grid-cols-2 justify-items-center gap-6 !space-x-0 md:grid-cols-4 md:justify-items-center md:gap-8"
                        tooltipClassName="bg-neutral-900/90 text-white shadow-lg shadow-emerald-500/10"
                    >
                        {row.map((contributor: Contributor) => (
                            <AvatarGroupItem
                                key={contributor.id}
                                className="flex items-center justify-center"
                            >
                                <figure
                                    className={cn(
                                        'relative mx-auto h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-black/40 shadow-lg transition-all duration-300 hover:scale-[1.05] md:h-20 md:w-20'
                                    )}
                                >
                                    <Image
                                        alt={`${contributor.login} avatar`}
                                        src={contributor.avatar_url}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                        sizes="(max-width: 768px) 64px, 80px"
                                    />
                                </figure>
                                <AvatarGroupTooltip className="mt-2 items-center gap-1 text-center">
                                    <span className="text-lg font-semibold text-white capitalize md:text-xl">
                                        {contributor.login}
                                    </span>
                                    <span className="text-sm text-gray-200/90 md:text-base">
                                        {contributor.contributions}{' '}
                                        contributions
                                    </span>
                                </AvatarGroupTooltip>
                            </AvatarGroupItem>
                        ))}
                    </AvatarGroup>
                ))}
            </div>

            {/* Button */}
            <Link href="https://github.com/aspdc/aspdc-revamped/issues">
                <InteractiveHoverButton>
                    Want to contribute?
                </InteractiveHoverButton>
            </Link>
        </section>
    )
}

export default Contributiors

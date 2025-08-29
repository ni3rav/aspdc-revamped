import { fetchEvents } from '@/db/queries'
import { Event } from '@/db/types'
import React from 'react'
import { TextScramble } from '../motion-primitives/text-scramble'
import { TextEffect } from '../motion-primitives/text-effect'
import { InteractiveHoverButton } from '../magicui/interactive-hover-button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Marquee } from '../magicui/marquee'

const ImageCard = ({ img }: { img: string }) => {
    return (
        <figure
            className={cn(
                'relative h-48 w-48 cursor-pointer overflow-hidden rounded-xl border sm:h-64 sm:w-64 lg:h-96 lg:w-96',
                'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
                'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img alt="" src={img} className="h-full w-full object-cover" />
            </div>
        </figure>
    )
}

const EventShowcase = async () => {
    const items: Event[] = await fetchEvents()
    const images = items.flatMap((event) => event.imageUrls.slice(0, 2))
    const firstRow = images.slice(0, Math.ceil(images.length / 2))
    const secondRow = images.slice(Math.ceil(images.length / 2))
    return (
        <section className="mx-auto max-w-7xl px-6 py-16 text-center">
            <TextScramble
                duration={1}
                className="text-primary text-5xl font-extrabold tracking-tight md:text-5xl"
            >
                Gallery
            </TextScramble>
            <TextEffect
                per="char"
                preset="blur"
                speedReveal={2}
                className="mt-3 text-lg text-gray-400"
            >
                A glimpse into our past events — moments of learning,
                collaboration, and fun.
            </TextEffect>

            <div className="bg-background relative mt-15 flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center overflow-hidden rounded-lg sm:h-[calc(100vh-150px)] md:shadow-xl lg:h-screen">
                <Marquee pauseOnHover className="[--duration:20s]">
                    {firstRow.map((img: any, idx: number) => (
                        <ImageCard key={`${img}-${idx}`} img={img} />
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:20s]">
                    {secondRow.map((img: any, idx: number) => (
                        <ImageCard key={`${img}-${idx}`} img={img} />
                    ))}
                </Marquee>
                <div className="dark:from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#090909] sm:w-1/3"></div>
                <div className="dark:from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#090909] sm:w-1/3"></div>
            </div>

            <Link href={'/events'}>
                <InteractiveHoverButton>
                    Relive the Moments
                </InteractiveHoverButton>
            </Link>
        </section>
    )
}

export default EventShowcase

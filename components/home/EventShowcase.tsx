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
                'relative h-48 w-48 cursor-pointer overflow-hidden rounded-xl border sm:h-64 sm:w-64 lg:h-72 lg:w-72'
            )}
        >
            <img
                alt=""
                src={img}
                className="absolute inset-0 h-full w-full object-cover"
            />
        </figure>
    )
}

const EventShowcase = async () => {
    const items: Event[] = await fetchEvents()
    const images = items.flatMap((event) => event.imageUrls.slice(0, 2))
    const firstRow = images.slice(0, Math.ceil(images.length / 2))
    const secondRow = images.slice(Math.ceil(images.length / 2))

    return (
        <section className="flex min-h-screen flex-col items-center justify-center py-20 text-center">
            {/* Title */}
            <TextScramble
                duration={1}
                className="text-primary text-5xl font-extrabold tracking-tight md:text-7xl"
            >
                Gallery
            </TextScramble>

            {/* Description */}
            <TextEffect
                per="char"
                preset="blur"
                speedReveal={2}
                className="mt-6 max-w-2xl text-xl text-gray-400 md:text-2xl"
            >
                A glimpse into our past events — moments of learning,
                collaboration, and fun.
            </TextEffect>

            {/* Gallery */}
            <div className="relative mt-12 flex w-full flex-col items-center justify-center overflow-hidden rounded-lg py-10">
                <Marquee pauseOnHover className="gap-6 [--duration:20s]">
                    {firstRow.map((img: any, idx: number) => (
                        <ImageCard key={`${img}-${idx}`} img={img} />
                    ))}
                </Marquee>
                <Marquee
                    reverse
                    pauseOnHover
                    className="gap-6 [--duration:20s]"
                >
                    {secondRow.map((img: any, idx: number) => (
                        <ImageCard key={`${img}-${idx}`} img={img} />
                    ))}
                </Marquee>
            </div>

            {/* Button */}
            <div className="mt-12">
                <Link href={'/events'}>
                    <InteractiveHoverButton>
                        Relive the Moments
                    </InteractiveHoverButton>
                </Link>
            </div>
        </section>
    )
}

export default EventShowcase

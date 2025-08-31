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
                'relative h-48 w-48 cursor-pointer overflow-hidden rounded-xl border sm:h-72 sm:w-72 lg:h-80 lg:w-80'
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
        <section className="py-16 text-center">
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

            <div className="relative flex max-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg py-10">
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

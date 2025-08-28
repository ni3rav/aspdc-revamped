import { fetchEvents } from '@/db/queries'
import { Event } from '@/db/types'
import React from 'react'
import { ParallaxScrollSecond } from '../ui/parallax-scroll'
import { TextScramble } from '../motion-primitives/text-scramble'
import { TextEffect } from '../motion-primitives/text-effect'
import { InteractiveHoverButton } from '../magicui/interactive-hover-button'
import Link from 'next/link'

const EventShowcase = async () => {
    const items: Event[] = await fetchEvents()
    const images = items.flatMap((event) => event.imageUrls.slice(0, 2))
    return (
        <section className="mx-auto max-w-6xl px-6 py-16 text-center">
            <TextScramble
                duration={1}
                className="text-primary text-5xl font-extrabold tracking-tight md:text-5xl"
            >
                Event Gallery
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

            <ParallaxScrollSecond images={images} />

            <Link href={'/events'}>
                <InteractiveHoverButton>
                    Relive the Moments
                </InteractiveHoverButton>
            </Link>
        </section>
    )
}

export default EventShowcase

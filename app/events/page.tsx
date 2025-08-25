import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { fetchEvents } from '@/db/queries'
import { Event } from '@/db/types'
import React from 'react'

// const majorEvents = ["Hackspire"]

const Events = async () => {
    const items: Event[] = await fetchEvents()

    return (
        <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Happening @ ASPDC
            </TextScramble>
            <BentoGrid>
                {items.map((item) => (
                    <BentoGridItem
                        key={item.id}
                        title={item.name}
                        description={item.details}
                        icon={item.imageUrls[0]}
                        className=""
                    />
                ))}
            </BentoGrid>
        </main>
    )
}

export default Events

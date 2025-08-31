'use client'
import { TextScramble } from '../motion-primitives/text-scramble'

export default function AboutHorizontal() {
    return (
        <section className="relative flex h-screen w-full flex-col items-start justify-center overflow-hidden px-10">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                About Us
            </TextScramble>
        </section>
    )
}

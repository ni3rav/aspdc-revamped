'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextScramble } from '../motion-primitives/text-scramble'

gsap.registerPlugin(ScrollTrigger)

export default function AboutHorizontal() {
    const containerRef = useRef(null)
    const textRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        const textEl = textRef.current

        gsap.to(textEl, {
            xPercent: -100, // scrolls entire text
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 1,
                end: '+=2000', // adjust scroll distance
            },
        })
    }, [])

    return (
        <section
            ref={containerRef}
            className="relative flex h-screen w-full flex-col items-start justify-center overflow-hidden px-10"
        >
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                About Us
            </TextScramble>
            <div
                ref={textRef}
                className="text-4xl font-bold whitespace-nowrap text-white md:text-6xl"
            >
                We are a community of passionate learners, builders, and
                dreamers — constantly pushing boundaries, sharing knowledge, and
                creating impact together 🚀🔥💡
            </div>
        </section>
    )
}

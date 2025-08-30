'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Code2, Rocket, PartyPopper } from 'lucide-react'
import { TextScramble } from '../motion-primitives/text-scramble'
import { TextEffect } from '../motion-primitives/text-effect'

const cards = [
    {
        title: "What's ASPDC All About",
        body: `ASPDC is a squad of tech-loving students who geek out over code and love to share the knowledge. No gatekeeping here — just good vibes and great learning.`,
        icon: Code2,
    },
    {
        title: 'Our Vibe',
        body: `We're all about creating a chill space where you can level up your coding skills, whether you're a total newbie or already dreaming in Python.`,
        icon: PartyPopper,
    },
    {
        title: "What We've Got Going On",
        body: [
            '🔥 Lit workshops on everything from websites to AI',
            '🤝 Coding hangouts where we tackle projects together',
            '🏆 Flex your skills in coding competitions',
            '🚀 Network with industry pros (aka future bosses)',
            '🎯 A judgment-free zone to try, fail, and crush it',
        ],
        icon: Rocket,
    },
]

export default function AboutGrid() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    // Title disappears in the first quarter
    const xTitle = useTransform(scrollYProgress, [0, 0.25], ['0%', '-100%'])
    const opacityTitle = useTransform(scrollYProgress, [0, 0.25], [1, 0])

    // Cards slide in AFTER the title is gone
    const xCards = useTransform(
        scrollYProgress,
        [0.25, 1],
        ['100%', `-${(cards.length - 1) * 100}%`]
    )

    return (
        <section
            ref={containerRef}
            // dynamic height = (cards.length + 1) * 100vh
            className={`relative h-[${cards.length + 1}00vh]`}
        >
            {/* Sticky stage */}
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                {/* Title */}
                <motion.div
                    style={{ x: xTitle, opacity: opacityTitle }}
                    className="absolute left-0 flex w-screen flex-col items-center justify-center space-y-4 px-4 text-center"
                >
                    <TextScramble className="text-primary text-4xl font-extrabold sm:text-5xl md:text-6xl">
                        🚀 About Us
                    </TextScramble>
                    <TextEffect
                        per="word"
                        preset="blur"
                        className="max-w-xl text-base text-gray-400 sm:max-w-2xl sm:text-lg md:text-xl"
                    >
                        A sneak peek into the vibes, mission, and fun at ASPDC
                        ✨
                    </TextEffect>
                </motion.div>

                {/* Cards */}
                <motion.div style={{ x: xCards }} className="flex">
                    {cards.map((card, i) => {
                        const Icon = card.icon
                        return (
                            <motion.div
                                key={i}
                                className="flex w-screen items-center justify-center px-4"
                            >
                                <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border bg-neutral-900 p-6 shadow-xl sm:max-w-md sm:p-8 lg:max-w-2xl">
                                    {/* Title with icon */}
                                    <div className="flex items-center gap-3">
                                        <Icon className="text-primary h-6 w-6 shrink-0" />
                                        <TextScramble className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                                            {card.title}
                                        </TextScramble>
                                    </div>

                                    {/* Body */}
                                    {Array.isArray(card.body) ? (
                                        <ul className="list-inside list-disc space-y-2 pl-2 text-sm text-gray-300 sm:text-base">
                                            {card.body.map((item, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{
                                                        opacity: 0,
                                                        x: 40,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: 0.2 + idx * 0.1,
                                                    }}
                                                    viewport={{ once: true }}
                                                >
                                                    {item}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                                            {card.body}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}

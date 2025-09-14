'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { TextScramble } from '../motion-primitives/text-scramble'
import { TextEffect } from '../motion-primitives/text-effect'
import { motion } from 'framer-motion'

const Hero = () => {
    const [isTrigger, setIsTrigger] = useState(true)
    return (
        <main className="flex h-screen flex-col overflow-hidden text-white">
            {/* Main hero content */}
            <div className="flex flex-1 flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    <TextScramble
                        duration={1}
                        className="text-primary text-5xl font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl"
                        trigger={isTrigger}
                        onHoverStart={() => setIsTrigger(true)}
                        onScrambleComplete={() => setIsTrigger(false)}
                    >
                        ASPDC
                    </TextScramble>
                </motion.div>

                <TextEffect
                    per="word"
                    preset="blur"
                    className="mt-4 text-2xl text-gray-200 sm:text-3xl md:text-4xl"
                >
                    For the Students, By the Students
                </TextEffect>

                <TextEffect
                    per="word"
                    preset="blur"
                    speedReveal={2}
                    className="mt-6 max-w-3xl px-5 text-lg leading-relaxed text-gray-400 sm:text-xl md:px-0"
                >
                    Adani Students Programming and Developement Club (ASPDC) is
                    a welcoming space to learn, grow, and innovate across web
                    development, AI, and competitive programming at Adani
                    University.
                </TextEffect>
            </div>

            <motion.div
                initial={{ y: -20, filter: 'blur(12px)', opacity: 0 }}
                animate={{ y: 0, filter: 'blur(0)', opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-10 flex flex-col items-center justify-center gap-3 text-xl"
            >
                <p className="sr-only">Scroll down to explore</p>
                <motion.p
                    aria-hidden="true"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'mirror',
                    }}
                >
                    Scroll down to explore
                </motion.p>
                <ChevronDown aria-hidden="true" />
            </motion.div>
        </main>
    )
}

export default Hero

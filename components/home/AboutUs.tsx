/* eslint-disable react/no-unescaped-entities */
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAnimateOnView } from '../hooks/useAnimateOnView'
import { IconCloud } from '../ui/interactive-icon-cloud'
import FadeInWhenVisible from '../FadeInWhenVisible'
import OrbitingCirclesComp from '../OrbitingCircles'
import ScrambledText from '../bits/ScrambledText/ScrambledText'

export default function AboutUs() {
    const { ref, isInView } = useAnimateOnView(0.1)

    const textVariants = {
        hidden: { x: '-20px', opacity: 0, filter: 'blur(10px)' },
        visible: {
            x: 0,
            opacity: 1,
            filter: 'blur(0)',
            transition: { duration: 0.6 },
        },
    }

    const textVariantsBody = {
        hidden: { x: '-20px', opacity: 0, filter: 'blur(10px)' },
        visible: {
            x: 0,
            opacity: 0.85,
            filter: 'blur(0)',
            transition: { duration: 0.6, delay: 0.2 },
        },
    }

    return (
        <motion.section
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.25 } } }}
            className="relative mx-auto grid min-h-screen max-w-5xl gap-5 py-16 text-gray-200 lg:grid-cols-2"
        >
            {/* Left content */}
            <div className="space-y-12">
                <motion.div>
                    <motion.h1
                        className="text-primary text-3xl font-extrabold sm:text-4xl"
                        variants={textVariants}
                    >
                        What's ASPDC All About
                    </motion.h1>
                    <motion.p
                        className="mt-3 text-sm leading-relaxed sm:text-base"
                        variants={textVariantsBody}
                    >
                        ASPDC is a squad of tech-loving students who geek out
                        over code and love to share the knowledge. No
                        gatekeeping here — just good vibes and great learning.
                    </motion.p>
                </motion.div>

                <motion.div>
                    <motion.h1
                        className="text-primary text-3xl font-extrabold sm:text-4xl"
                        variants={textVariants}
                    >
                        Our Vibe
                    </motion.h1>
                    <motion.p
                        className="mt-3 text-sm leading-relaxed sm:text-base"
                        variants={textVariantsBody}
                    >
                        We're all about creating a chill space where you can
                        level up your coding skills, whether you're a total
                        newbie or already dreaming in Python. It's like a 24/7
                        hackathon — minus the stress and energy drinks.
                    </motion.p>
                </motion.div>

                <motion.div>
                    <motion.h1
                        className="from-primary bg-gradient-to-r to-emerald-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl"
                        variants={textVariants}
                    >
                        What We've Got Going On
                    </motion.h1>
                    <motion.ul
                        className="mt-4 list-inside list-disc space-y-2 text-sm sm:text-base"
                        variants={textVariantsBody}
                    >
                        <li>
                            Lit workshops on everything from building killer
                            websites to AI
                        </li>
                        <li>
                            Coding hangouts where we tackle projects together
                        </li>
                        <li>
                            Chances to flex your skills in coding competitions
                        </li>
                        <li>
                            Networking opps with tech industry pros (aka future
                            bosses)
                        </li>
                        <li>A judgment-free zone to try, fail, and crush it</li>
                    </motion.ul>
                </motion.div>
            </div>

            {/* Right visuals */}
            <motion.div
                className="relative flex h-full items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8 }}
            >
                <div className="relative flex h-full w-full items-center justify-center rounded-2xl">
                    {/* <FadeInWhenVisible> */}
                    <OrbitingCirclesComp />
                    {/* </FadeInWhenVisible> */}
                </div>
            </motion.div>
        </motion.section>
    )
}

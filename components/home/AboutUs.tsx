/* eslint-disable react/no-unescaped-entities */
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAnimateOnView } from '../hooks/useAnimateOnView'
import ReactionTest from '../ReactionTest'

export default function AboutUs() {
    const { ref, isInView } = useAnimateOnView(0.1)

    const fadeInLeft = (delay = 0) => ({
        hidden: { x: -20, opacity: 0, filter: 'blur(10px)' },
        visible: {
            x: 0,
            opacity: 1,
            filter: 'blur(0)',
            transition: { duration: 0.6, delay },
        },
    })

    return (
        <motion.section
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.25 } } }}
            className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 text-gray-200 lg:grid-cols-2"
        >
            {/* Left content */}
            <div className="space-y-14">
                {[
                    {
                        title: "What's ASPDC All About",
                        body: `ASPDC is a squad of tech-loving students who geek out
                        over code and love to share the knowledge. No
                        gatekeeping here — just good vibes and great learning.`,
                    },
                    {
                        title: 'Our Vibe',
                        body: `We're all about creating a chill space where you can
                        level up your coding skills, whether you're a total
                        newbie or already dreaming in Python. It's like a 24/7
                        hackathon — minus the stress and energy drinks.`,
                    },
                ].map((section, i) => (
                    <motion.div key={i}>
                        <motion.h2
                            className="text-primary text-3xl font-extrabold sm:text-4xl"
                            variants={fadeInLeft(0)}
                        >
                            {section.title}
                        </motion.h2>
                        <motion.p
                            className="mt-3 text-sm leading-relaxed sm:text-base"
                            variants={fadeInLeft(0.2)}
                        >
                            {section.body}
                        </motion.p>
                    </motion.div>
                ))}

                {/* Features */}
                <motion.div>
                    <motion.h2
                        className="text-primary text-3xl font-extrabold sm:text-4xl"
                        variants={fadeInLeft(0)}
                    >
                        What We've Got Going On
                    </motion.h2>
                    <motion.ul
                        className="mt-4 list-inside list-disc space-y-2 text-sm sm:text-base"
                        variants={fadeInLeft(0.2)}
                    >
                        {[
                            'Lit workshops on everything from building killer websites to AI',
                            'Coding hangouts where we tackle projects together',
                            'Chances to flex your skills in coding competitions',
                            'Networking opps with tech industry pros (aka future bosses)',
                            'A judgment-free zone to try, fail, and crush it',
                        ].map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </motion.ul>
                </motion.div>
            </div>

            {/* Reaction Test */}
            <motion.div
                className="relative flex h-full flex-col items-center justify-center gap-4 rounded-2xl bg-black text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-primary text-xl font-bold">
                    ⚡ Test Your Reflexes!
                </h2>
                <p className="max-w-sm text-sm text-gray-400">
                    Click as soon as the screen turns{' '}
                    <span className="text-primary">green</span>. Let's see how
                    fast you really are 👀
                </p>
                <ReactionTest />
            </motion.div>
        </motion.section>
    )
}

'use client'

import { motion, scale } from 'framer-motion'
import { Code2, Rocket, PartyPopper } from 'lucide-react'
import { MagicCard } from '../magicui/magic-card'

const values = [
    {
        title: "What's ASPDC All About",
        body: `ASPDC is a squad of tech-loving students who geek out
            over code and love to share the knowledge. No
            gatekeeping here — just good vibes and great learning.`,
        icon: Code2,
        gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    },
    {
        title: 'Our Vibe',
        body: `We're all about creating a chill space where you can
            level up your coding skills, whether you're a total
            newbie or already dreaming in Python. It's like a 24/7
            hackathon — minus the stress and energy drinks.`,
        icon: PartyPopper,
        gradient: 'from-blue-400 via-cyan-400 to-teal-400',
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
        gradient: 'from-yellow-400 via-orange-400 to-pink-500',
    },
]

export default function ValuesSection() {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 text-gray-200 sm:grid-cols-2 lg:grid-cols-3"
        >
            {values.map((val, i) => {
                const Icon = val.icon
                return (
                    <motion.div
                        key={i}
                        initial={{ y: 50, scale: 0.8, opacity: 0 }}
                        whileInView={{ y: 0, scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300"
                    >
                        <MagicCard className="relative z-10 flex h-full flex-col rounded-xl border border-green-900 bg-black/50 p-6 backdrop-blur-md">
                            {/* Title at the top */}
                            <h2 className="mb-4 text-xl font-extrabold tracking-wide text-green-400 sm:text-2xl">
                                {val.title}
                            </h2>

                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 * i, type: 'spring' }}
                                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-800/40 text-green-300 shadow-inner"
                            >
                                <Icon className="h-6 w-6" />
                            </motion.div>

                            {/* Body */}
                            {Array.isArray(val.body) ? (
                                <ul className="mt-2 list-inside space-y-2 text-sm text-gray-300 group-hover:text-gray-100 sm:text-base">
                                    {val.body.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-2 text-sm leading-relaxed text-gray-300 group-hover:text-gray-100 sm:text-base">
                                    {val.body}
                                </p>
                            )}
                        </MagicCard>
                    </motion.div>
                )
            })}
        </motion.section>
    )
}

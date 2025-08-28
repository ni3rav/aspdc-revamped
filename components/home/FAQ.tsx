'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { MagicCard } from '../magicui/magic-card'
import AccordionComp from '../Accordian'

export default function FAQ() {
    return (
        <div className="relative min-h-screen px-4 py-16 text-white sm:px-8 lg:px-16">
            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center text-3xl font-bold sm:text-4xl lg:text-left lg:text-5xl"
            >
                Got Questions?{' '}
                <span className="text-primary">We Got Answers</span>
            </motion.h1>

            <div className="flex flex-col gap-10 lg:flex-row">
                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full lg:w-2/3"
                >
                    <AccordionComp />
                </motion.div>

                {/* Side Card */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-6 w-full lg:mt-0 lg:w-1/3"
                >
                    <MagicCard className="border-primary/20 hover:shadow-primary/20 group h-fit rounded-2xl border bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-8 shadow-lg transition">
                        <h2 className="group-hover:text-primary mb-3 text-2xl font-semibold transition-colors">
                            Still got questions?
                        </h2>
                        <p className="mb-6 text-base leading-relaxed opacity-80">
                            We'd love to help you out. Reach us anytime.
                        </p>
                        <Link href="/contact">
                            <Button className="bg-primary w-full rounded-lg px-6 py-3 font-semibold text-black shadow-md transition-colors hover:bg-[#1ea64f] sm:w-auto">
                                Contact Us
                            </Button>
                        </Link>
                    </MagicCard>
                </motion.div>
            </div>
        </div>
    )
}

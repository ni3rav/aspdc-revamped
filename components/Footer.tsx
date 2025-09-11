'use client'

import React from 'react'
import { useInView, motion } from 'framer-motion'
import { FaDiscord, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5'
import EmojiConfetti from './EmojiConfetti'

function SocialIcon({
    link,
    Icon,
    name,
}: {
    link?: string
    Icon: typeof FaDiscord
    name: string
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group flex size-10 cursor-pointer items-center justify-center rounded-lg border border-stone-700 transition-colors hover:border-stone-100 sm:size-12 md:size-14"
            onClick={() => {
                if (link) {
                    window.open(link, '_blank', 'noopener,noreferrer')
                }
            }}
        >
            {Icon && (
                <Icon
                    className="opacity-70 transition-opacity group-hover:opacity-100"
                    size="60%"
                    aria-label={name}
                />
            )}
        </motion.div>
    )
}

export default function Footer() {
    const ref = React.useRef(null)
    const isInView = useInView(ref, {
        margin: '0px 100px -100px 0px',
        once: false,
    })
    const triggerConfetti = () => {
        ;({ particleCount: 150, spread: 50, origin: { y: 0.4 } })
    }

    return (
        <footer className="bg-background relative min-h-[45vh] overflow-hidden border-t-2 border-dashed">
            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-6 py-8 sm:px-8 md:flex-row md:px-12 lg:px-20">
                <div className="text-primary">
                    <h3 className="mb-4 text-2xl font-bold">ASPDC</h3>
                    <p className="max-w-xs text-sm text-gray-400">
                        Empowering students through code and creativity since
                        2023.
                    </p>
                </div>

                <div className="flex flex-col items-start">
                    <h4 className="text-primary mb-4 text-lg font-semibold">
                        Connect With Us
                    </h4>
                    <div className="relative flex flex-wrap gap-4">
                        <SocialIcon
                            Icon={IoLogoInstagram}
                            link="https://www.instagram.com/aspdc.tech/"
                            name="Instagram"
                        />
                        <SocialIcon
                            Icon={FaXTwitter}
                            link="https://x.com/aspdc_tech"
                            name="Twitter"
                        />
                        <SocialIcon
                            Icon={FaDiscord}
                            link="https://discord.com/invite/QbrJNMTzUj"
                            name="Discord"
                        />
                        <SocialIcon
                            Icon={IoLogoLinkedin}
                            link="https://www.linkedin.com/company/adani-student-programming-and-development-club/"
                            name="LinkedIn"
                        />
                        <SocialIcon
                            Icon={FaYoutube}
                            link="https://www.youtube.com/@clubaspd"
                            name="YouTube"
                        />
                        <div
                            className="cursor-target"
                            onClick={triggerConfetti}
                        >
                            <EmojiConfetti />
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                className="pointer-events-none absolute right-0 -bottom-[75%] left-0 text-center text-[20vh] font-extrabold text-gray-100/80 sm:text-[30vh] md:text-[40vh] lg:text-[50vh]"
                ref={ref}
                initial={{ y: '19%' }}
                animate={{ y: isInView ? '0%' : '19%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                ASPDC
            </motion.div>
        </footer>
    )
}

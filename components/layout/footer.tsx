'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaDiscord, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5'

const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Projects', href: '/projects' },
    { name: 'Team', href: '/team' },
]

function SocialIcon({
    link,
    Icon,
    name,
}: {
    link?: string
    Icon: React.ElementType
    name: string
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
            className="border-primary/20 group hover:border-primary bg-background/80 flex size-9 cursor-pointer items-center justify-center rounded-lg border shadow transition-colors sm:size-10"
            aria-label={name}
            onClick={() =>
                link && window.open(link, '_blank', 'noopener,noreferrer')
            }
        >
            <Icon
                className="text-primary opacity-70 transition-opacity group-hover:opacity-100"
                size={24}
            />
        </motion.button>
    )
}

export default function Footer() {
    return (
        <footer className="bg-background/80 border-primary/10 relative z-10 w-full border-t pt-8 pb-2 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-12">
                    <nav className="mb-4 flex gap-4 md:mb-0">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-primary/80 hover:text-primary rounded px-2 py-1 font-mono text-sm transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                    <div className="flex gap-3">
                        <SocialIcon
                            Icon={IoLogoInstagram}
                            link="https://www.instagram.com/aspd.club/"
                            name="Instagram"
                        />
                        <SocialIcon
                            Icon={FaXTwitter}
                            link="https://x.com/aspdc_club"
                            name="X (Twitter)"
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
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                        scale: 1.04,
                        color: '#22c55e',
                        textShadow: '0 0 32px #22c55e, 0 0 8px #22c55e',
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-primary/80 pointer-events-none mt-4 w-full text-center text-[8vw] font-extrabold select-none sm:text-[6vw] md:text-[5vw] lg:text-[4vw]"
                    style={{
                        background:
                            'linear-gradient(to bottom, #22c55e 80%, transparent 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    ASPDC
                </motion.div>
            </div>
        </footer>
    )
}

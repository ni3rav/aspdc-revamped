'use client'

import React from 'react'
import { motion, useInView } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { FaDiscord, FaYoutube } from 'react-icons/fa'
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6'
import { IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5'

interface SocialIconProps {
    link: string
    Icon: React.ComponentType<{ className?: string; 'aria-label'?: string }>
    name: string
}

function SocialIcon({ link, Icon, name }: SocialIconProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className="group flex size-12 cursor-pointer items-center justify-center rounded-xl border border-green-900 bg-black/80 shadow-lg transition-colors hover:border-green-400 sm:size-14 md:size-16"
            onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        >
            <Icon
                className="text-3xl text-green-400 opacity-80 drop-shadow-[0_2px_6px_rgba(34,197,94,0.25)] transition-opacity group-hover:opacity-100"
                aria-label={name}
            />
        </motion.div>
    )
}

const socialLinks = [
    {
        Icon: IoLogoInstagram,
        link: 'https://www.instagram.com/aspd.club/',
        name: 'Instagram',
    },
    { Icon: FaXTwitter, link: 'https://x.com/aspdc_club', name: 'Twitter' },
    {
        Icon: FaDiscord,
        link: 'https://discord.com/invite/QbrJNMTzUj',
        name: 'Discord',
    },
    {
        Icon: IoLogoLinkedin,
        link: 'https://www.linkedin.com/company/adani-student-programming-and-development-club/',
        name: 'LinkedIn',
    },
    {
        Icon: FaYoutube,
        link: 'https://www.youtube.com/@clubaspd',
        name: 'YouTube',
    },
    { Icon: FaWhatsapp, link: 'https://wa.me/919825123456', name: 'WhatsApp' },
]

export default function Footer() {
    const ref = React.useRef(null)
    const isInView = useInView(ref, {
        margin: '0px 100px -100px 0px',
        once: false,
    })
    const hackspire = usePathname().includes('hackspire')

    return (
        <footer className="relative min-h-[45vh] overflow-hidden border-t-2 border-dashed border-green-900 bg-black/90">
            {/* Grid overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(34,197,94,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(34,197,94,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-6 py-8 sm:px-8 md:flex-row md:px-12 lg:px-20">
                {/* Brand Section */}
                <div className="text-white">
                    <h3 className="mb-4 text-2xl font-bold text-green-400">
                        ASPDC
                    </h3>
                    <p className="max-w-xs text-sm text-gray-400">
                        {hackspire
                            ? 'Made with 😻 by ASPDC'
                            : 'Empowering students through code and creativity since 2023.'}
                    </p>
                </div>

                {/* Social Links Section */}
                <div className="flex flex-col items-start">
                    <h4 className="mb-4 text-lg font-semibold text-green-400">
                        Connect With Us
                    </h4>
                    <div className="flex flex-wrap gap-4">
                        {socialLinks.map((social) => (
                            <SocialIcon key={social.name} {...social} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Large Brand Text */}
            <motion.div
                className={`pointer-events-none absolute right-0 -bottom-[75%] left-0 text-center text-[20vh] font-extrabold select-none sm:text-[30vh] md:text-[40vh] lg:text-[50vh] ${
                    hackspire
                        ? 'text-stroke-2 text-stroke-black/40 -bottom-[75%] animate-[bgMove_10s_linear_infinite] bg-[linear-gradient(135deg,_#22C55E,_#0070F3,_#A855F7,_#22C55E)] bg-[length:200%_auto] bg-clip-text text-[#090909] lg:text-[40vh]'
                        : 'text-green-400/80'
                }`}
                ref={ref}
                initial={{ y: '19%' }}
                animate={{ y: isInView ? '0%' : '19%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                {hackspire ? 'Hack' : 'ASPDC'}
            </motion.div>
        </footer>
    )
}

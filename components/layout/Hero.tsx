/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import WrapButton from '../ui/wrap-button'
import { ChevronDown, Phone } from 'lucide-react'
import { TextScramble } from '../motion-primitives/text-scramble'
import { TextEffect } from '../motion-primitives/text-effect'
import { motion } from 'framer-motion'

const Hero = () => {
    return (
        <main className="main-option-2 relative flex h-screen w-full flex-col overflow-hidden text-white">
            {/* Navbar */}
            <motion.div className="z-10 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6 md:px-12 lg:px-15">
                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <Link href="/" className="bg-black">
                        <Image
                            src="/aspdc.png"
                            alt="ASPDC logo"
                            width={120}
                            height={40}
                            className="h-8 w-auto sm:h-10"
                            priority={true}
                            quality={90}
                        />
                    </Link>
                </motion.div>
                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <WrapButton href="/">
                        <Phone size={15} />
                        <span className="hidden sm:inline">Contact Us</span>
                        <span className="sm:hidden">Contact</span>
                    </WrapButton>
                </motion.div>
            </motion.div>

            {/* Main hero content */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-8 md:px-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="mb-4 sm:mb-6 md:mb-8"
                >
                    <TextScramble
                        duration={1}
                        className="text-primary text-4xl font-extrabold sm:text-6xl md:text-7xl lg:text-8xl"
                    >
                        ASPDC
                    </TextScramble>
                </motion.div>

                <TextEffect
                    per="word"
                    preset="blur"
                    className="mb-4 max-w-2xl text-sm text-gray-300 sm:mb-6 sm:text-lg md:text-xl"
                >
                    Adani Students Programming and Development Club
                </TextEffect>

                <TextEffect
                    per="word"
                    preset="blur"
                    className="max-w-lg text-xs text-gray-400 sm:text-sm md:text-base lg:text-xl"
                >
                    For The Students, By The Students
                </TextEffect>
            </div>

            <motion.div
                initial={{ y: -20, filter: 'blur(12px)', opacity: 0 }}
                animate={{ y: 0, filter: 'blur(0)', opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-6 flex flex-col items-center justify-center gap-2 text-sm sm:mb-10 sm:gap-3 sm:text-xl"
            >
                <p className="text-center">Scroll down to explore</p>
                <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.div>
        </main>
    )
}

export default Hero

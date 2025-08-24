'use client'
import Link from 'next/link'
import React from 'react'
import WrapButton from '../ui/wrap-button'
import { ChevronDown, Phone } from 'lucide-react'
import { TextScramble } from '../motion-primitives/text-scramble'
import { TextEffect } from '../motion-primitives/text-effect'
import { motion } from 'framer-motion'

const Hero = () => {
    return (
        <main className="h-screen flex flex-col text-white overflow-hidden">
            {/* Navbar */}
            <motion.div
                className="flex items-center justify-between py-6 px-15 z-10"
            >
                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Link href="/" className="bg-black">
                        <img src="/aspdc.png" alt="ASPDC logo" className="h-10" />
                    </Link>
                </motion.div>
                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <WrapButton href="/">
                        <Phone size={15} />
                        Contact Us
                    </WrapButton>
                </motion.div>
            </motion.div>

            {/* Main hero content */}
            <div className="flex flex-1 flex-col justify-center items-center text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <TextScramble duration={1} className="text-8xl font-extrabold text-primary">
                        ASPDC
                    </TextScramble>
                </motion.div>

                <TextEffect per="word" preset="blur" className="text-lg sm:text-xl text-gray-300">
                    Adani Students Programming and Development Club
                </TextEffect>

                <TextEffect per="word" preset="blur" className="text-sm sm:text-4xl text-gray-400 mt-6">
                    For The Students, By The Students
                </TextEffect>
            </div>

            <motion.div initial={{ y: -20, filter: 'blur(12px)', opacity: 0 }} animate={{ y: 0, filter: 'blur(0)', opacity: 1 }} transition={{ duration: 1, delay: .5 }} className='flex flex-col gap-3 justify-center items-center mb-10 text-xl'>
                <p>Scroll down to explore</p>
                <ChevronDown />
            </motion.div>
        </main>
    )
}

export default Hero
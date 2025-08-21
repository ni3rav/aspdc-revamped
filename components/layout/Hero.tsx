import Link from 'next/link'
import React from 'react'
import WrapButton from '../ui/wrap-button'
import { ArrowDown, ChevronDown, Phone } from 'lucide-react'
import { TextScramble } from '../motion-primitives/text-scramble'

const Hero = () => {
    return (
            <main className="h-screen flex flex-col text-white">
                {/* Navbar */}
                <div className="flex items-center justify-between py-6 px-15 z-10">
                    <Link href="/" className="bg-black">
                        <img src="/aspdc.png" alt="ASPDC logo" className="h-13" />
                    </Link>
                    <WrapButton href="/">
                        <Phone size={18} />
                        Contact Us
                    </WrapButton>
                </div>

                {/* Main hero content */}
                <div className="flex flex-1 flex-col justify-center items-center text-center">
                    <TextScramble className="text-9xl font-extrabold text-primary ">
                        ASPDC
                    </TextScramble>
                    <TextScramble className="text-xl sm:text-2xl text-gray-300">
                        Adani Students Programming and Development Club
                    </TextScramble>
                    <p className="text-base sm:text-5xl text-gray-400 italic mt-14">
                        For The Students, By The Students
                    </p>
                </div>

                <div className='flex flex-col gap-5 justify-center items-center mb-10 text-xl secnone'>
                    <p>Scroll down to explore</p>
                    <ChevronDown />
                </div>
            </main>
    )
}

export default Hero
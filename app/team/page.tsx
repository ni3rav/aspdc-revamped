'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import Image from 'next/image'
import { Instagram, Linkedin, Twitter } from 'lucide-react'

// Framer Motion variants
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export default function Page() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const everything = [
        {
            domainName: 'Faculty Mentor',
            members: [
                {
                    id: 1,
                    name: 'Dr. Nikita Joshi',
                    role: 'Faculty Mentor',
                    avatar: '/team/nikitamam.jpeg',
                    blur: '/team/tiny/nikitamam.jpeg',
                },
            ],
        },
        {
            domainName: 'Leadership',
            members: [
                {
                    id: 2,
                    name: 'Nirav Maheta',
                    role: 'President',
                    avatar: '/team/nirav.jpg',
                    blur: '/team/tiny/nirav.jpeg',
                },
                {
                    id: 3,
                    name: 'Sahil Patel',
                    role: 'Vice President',
                    avatar: '/team/sahil.jpg',
                    blur: '/team/tiny/sahil.jpeg',
                },
            ],
        },
        {
            domainName: 'WebDev',
            members: [
                {
                    id: 4,
                    name: 'Harshil Upadhyay',
                    role: 'Lead',
                    avatar: '/team/harshil.jpg',
                    blur: '/team/tiny/harshil.jpeg',
                },
                {
                    id: 5,
                    name: 'Rudra Patel',
                    role: 'Member',
                    avatar: '/team/rudra.jpeg',
                    blur: '/team/tiny/rudra.jpeg',
                },
                {
                    id: 6,
                    name: 'Dwij Gosai',
                    role: 'Member',
                    avatar: '/team/dwij.jpg',
                    blur: '/team/tiny/dwij.jpeg',
                },
                {
                    id: 7,
                    name: 'Tirth Choksi',
                    role: 'Member',
                    avatar: '/team/tirthc.jpg',
                    blur: '/team/tiny/tirthc.jpeg',
                },
                {
                    id: 8,
                    name: 'Sharanya',
                    role: 'Member',
                    avatar: '/team/sharanya.jpg',
                    blur: '/team/tiny/sharanya.jpeg',
                },
            ],
        },
        {
            domainName: 'DSA',
            members: [
                {
                    id: 9,
                    name: 'Pratham Gavadia',
                    role: 'Lead',
                    avatar: '/team/prathams.jpg',
                    blur: '/team/tiny/prathams.jpeg',
                },
                {
                    id: 10,
                    name: 'Pruthvi Navadiya',
                    role: 'Member',
                    avatar: '/team/pruthvi.jpeg',
                    blur: '/team/tiny/pruthvi.jpeg',
                },
                {
                    id: 11,
                    name: 'Harry Panchal',
                    role: 'Member',
                    avatar: '/team/harry.jpg',
                    blur: '/team/tiny/harry.jpeg',
                },
                {
                    id: 12,
                    name: 'Jhanvi Patel',
                    role: 'Member',
                    avatar: '/team/jhanvi.jpg',
                    blur: '/team/tiny/jhanvi.jpeg',
                },
                {
                    id: 13,
                    name: 'Tirth Jain',
                    role: 'Member',
                    avatar: '/team/tirthj.jpg',
                    blur: '/team/tiny/tirth.jpeg',
                },
            ],
        },
        {
            domainName: 'Machine Learning',
            members: [
                {
                    id: 14,
                    name: 'Vrajesh Sharma',
                    role: 'Lead',
                    avatar: '/team/vrajesh.jpg',
                    blur: '/team/tiny/vrajesh.jpeg',
                },
                {
                    id: 27,
                    name: 'Mohit Manglani',
                    role: 'Member',
                    avatar: '/team/mohit.jpeg',
                    blur: '/team/tiny/mohit.jpeg',
                },
                {
                    id: 15,
                    name: 'Saurabh Singh',
                    role: 'Member',
                    avatar: '/team/saurabh.jpg',
                    blur: '/team/tiny/saurabh.jpeg',
                },
                {
                    id: 16,
                    name: 'Sharv Mehta',
                    role: 'Member',
                    avatar: '/team/sharv.jpg',
                    blur: '/team/tiny/sharv.jpeg',
                },
                {
                    id: 17,
                    name: 'Samarth Shrivastava',
                    role: 'Member',
                    avatar: '/team/samarth.jpeg',
                    blur: '/team/tiny/samarth.jpeg',
                },
                {
                    id: 18,
                    name: 'Dhruval Patel',
                    role: 'Member',
                    avatar: '/team/dhruval.jpg',
                    blur: '/team/tiny/dhruval.jpeg',
                },
            ],
        },
        {
            domainName: 'Design',
            members: [
                {
                    id: 19,
                    name: 'Yaksh Vadaliya',
                    role: 'Lead',
                    avatar: '/team/yaksh2.jpg',
                    blur: '/team/tiny/yaksh2.jpeg',
                },
                {
                    id: 20,
                    name: 'Ved Parmar',
                    role: 'Lead',
                    avatar: '/team/ved.jpg',
                    blur: '/team/tiny/ved.jpeg',
                },
            ],
        },
        {
            domainName: 'Public Relations',
            members: [
                {
                    id: 21,
                    name: 'Deep Adatiya',
                    role: 'Lead',
                    avatar: '/team/deep2.jpg',
                    blur: '/team/tiny/deep2.jpeg',
                },
                {
                    id: 22,
                    name: 'Malhar Patel',
                    role: 'Member',
                    avatar: '/team/malhar.jpeg',
                    blur: '/team/tiny/malhar.jpeg',
                },
                {
                    id: 23,
                    name: 'Darshi Prajapati',
                    role: 'Member',
                    avatar: '/team/darshi.jpg',
                    blur: '/team/tiny/darshi.jpeg',
                },
                {
                    id: 24,
                    name: 'Avyay Kachhia',
                    role: 'Member',
                    avatar: '/team/avyay.jpg',
                    blur: '/team/tiny/avyay.jpeg',
                },
                {
                    id: 25,
                    name: 'Heer Rana',
                    role: 'Member',
                    avatar: '/team/heer.jpg',
                    blur: '/team/tiny/heer.jpeg',
                },
            ],
        },
        {
            domainName: 'Social Media',
            members: [
                {
                    id: 26,
                    name: 'Pratham Patel',
                    role: 'Lead',
                    avatar: '/team/pratham-patel.jpg',
                    blur: '/team/tiny/pratham-patel.jpeg',
                },
            ],
        },
    ]

    return (
        <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                The Faces Behind ASPDC
            </TextScramble>

            {everything.map((d, idx) => (
                <section key={idx}>
                    <TextEffect
                        per="char"
                        preset="blur"
                        speedReveal={0.6}
                        className="text-primary mb-3 text-xl font-medium"
                    >
                        {d.domainName}
                    </TextEffect>

                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="h-px bg-white"
                    />

                    <motion.div
                        className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {d.members.map((member) => (
                            <motion.div
                                key={member.id}
                                initial={{ y: 40, opacity: 0, scale: 0.8 }}
                                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <motion.div
                                    onHoverStart={() =>
                                        setHoveredIndex(member.id)
                                    }
                                    onHoverEnd={() => setHoveredIndex(null)}
                                    className="group relative h-[260px] w-full overflow-hidden rounded-2xl md:h-[320px]"
                                >
                                    {/* Background image */}
                                    <Image
                                        className="h-full w-full object-cover"
                                        blurDataURL={member.blur}
                                        src={member.avatar}
                                        alt={member.name}
                                        fill // ensures it fills the card
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                    {/* Description */}
                                    <div className="absolute bottom-2 left-3 rounded-lg bg-black/20 px-4 py-3 transition-all duration-300 group-hover:bottom-3">
                                        {/* Name + role */}
                                        <div className="">
                                            <p className="font-semibold">
                                                {member.name}
                                            </p>
                                            <p className="text-sm opacity-80">
                                                {member.role}
                                            </p>
                                        </div>

                                        {/* Hover icons */}
                                        <div className="mt-2 flex gap-2 lg:hidden">
                                            <Instagram size={20} />
                                            <Twitter size={20} />
                                            <Linkedin size={20} />
                                        </div>
                                        <AnimatePresence>
                                            {hoveredIndex === member.id && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                        scale: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    className="mt-2 hidden gap-2 lg:flex"
                                                >
                                                    <Instagram className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                    <Twitter className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                    <Linkedin className="hover:text-primary cursor-pointer transition-all duration-150 hover:-translate-y-1" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            ))}
        </main>
    )
}

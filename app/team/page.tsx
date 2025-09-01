/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import Image from 'next/image'
import { FaInstagram, FaXTwitter } from 'react-icons/fa6'
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

const page = () => {
    const everything = [
        {
            domainName: 'Faculty Mentor',
            members: [
                {
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
                    name: 'Nirav Maheta',
                    role: 'President',
                    avatar: '/team/nirav.jpg',
                    blur: '/team/tiny/nirav.jpeg',
                },
                {
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
                    name: 'Harshil Upadhyay',
                    role: 'Lead',
                    avatar: '/team/harshil.jpg',
                    blur: '/team/tiny/harshil.jpeg',
                },
                {
                    name: 'Rudra Patel',
                    role: 'Member',
                    avatar: '/team/rudra.jpeg',
                    blur: '/team/tiny/rudra.jpeg',
                },
                {
                    name: 'Dwij Gosai',
                    role: 'Member',
                    avatar: '/team/dwij.jpg',
                    blur: '/team/tiny/dwij.jpeg',
                },
                {
                    name: 'Tirth Choksi',
                    role: 'Member',
                    avatar: '/team/tirthc.jpg',
                    blur: '/team/tiny/tirthc.jpeg',
                },
                {
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
                    name: 'Pratham Gavadia',
                    role: 'Lead',
                    avatar: '/team/prathams.jpg',
                    blur: '/team/tiny/prathams.jpeg',
                },
                {
                    name: 'Pruthvi Navadiya',
                    role: 'Member',
                    avatar: '/team/pruthvi.jpeg',
                    blur: '/team/tiny/pruthvi.jpeg',
                },
                {
                    name: 'Harry Panchal',
                    role: 'Member',
                    avatar: '/team/harry.jpg',
                    blur: '/team/tiny/harry.jpeg',
                },
                {
                    name: 'Jhanvi Patel',
                    role: 'Member',
                    avatar: '/team/jhanvi.jpg',
                    blur: '/team/tiny/jhanvi.jpeg',
                },
                {
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
                    name: 'Vrajesh Sharma',
                    role: 'Lead',
                    avatar: '/team/vrajesh.jpg',
                    blur: '/team/tiny/vrajesh.jpeg',
                },
                {
                    name: 'Saurabh Singh',
                    role: 'Member',
                    avatar: '/team/saurabh.jpg',
                    blur: '/team/tiny/saurabh.jpeg',
                },
                {
                    name: 'Sharv Mehta',
                    role: 'Member',
                    avatar: '/team/sharv.jpg',
                    blur: '/team/tiny/sharv.jpeg',
                },
                {
                    name: 'Samarth Shrivastava',
                    role: 'Member',
                    avatar: '/team/samarth.jpeg',
                    blur: '/team/tiny/samarth.jpeg',
                },
                {
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
                    name: 'Yaksh Vadaliya',
                    role: 'Lead',
                    avatar: '/team/yaksh2.jpg',
                    blur: '/team/tiny/yaksh2.jpeg',
                },
                {
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
                    name: 'Deep Adatiya',
                    role: 'Lead',
                    avatar: '/team/deep2.jpg',
                    blur: '/team/tiny/deep2.jpeg',
                },
                {
                    name: 'Malhar Patel',
                    role: 'Member',
                    avatar: '/team/malhar.jpeg',
                    blur: '/team/tiny/malhar.jpeg',
                },
                {
                    name: 'Darshi Prajapati',
                    role: 'Member',
                    avatar: '/team/darshi.jpg',
                    blur: '/team/tiny/darshi.jpeg',
                },
                {
                    name: 'Avyay Kachhia',
                    role: 'Member',
                    avatar: '/team/avyay.jpg',
                    blur: '/team/tiny/avyay.jpeg',
                },
                {
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
                    name: 'Pratham Patel',
                    role: 'Lead',
                    avatar: '/team/prathama.jpg',
                    blur: '/team/tiny/pratham.jpeg',
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
                        {d.members.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 40, opacity: 0, scale: 0.8 }}
                                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <div className="group relative h-[320px] w-full overflow-hidden rounded-2xl">
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
                                    <div className="absolute -bottom-3 left-3 rounded-lg bg-black/20 px-4 py-3 transition-all duration-300 group-hover:bottom-3">
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
                                        <div className="mt-2 flex gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                            <Instagram />
                                            <Twitter />
                                            <Linkedin />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            ))}
        </main>
    )
}

export default page

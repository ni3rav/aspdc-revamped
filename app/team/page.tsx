'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { TextScramble } from '@/components/motion-primitives/text-scramble'

const page = () => {
    const everything = [
        {
            domainName: "Faculty Mentor",
            members: [
                {
                    name: "Dr. Nikita Joshi",
                    role: "",
                    avatar: "/team/nikitamam.jpeg"
                }
            ]
        },
        {
            domainName: "Leadership",
            members: [
                {
                    name: "Nirav Maheta",
                    role: "President",
                    avatar: "/team/nirav.jpg"
                },
                {
                    name: "Sahil Patel",
                    role: "Vice President",
                    avatar: "/team/sahil.jpg"
                }
            ]
        },
        {
            domainName: "WebDev",
            members: [
                {
                    name: "Harshil Upadhyay",
                    role: "Lead",
                    avatar: "/team/harshil.jpg"
                },
                {
                    name: "Rudra Patel",
                    role: "Member",
                    avatar: "/team/rudra.jpeg"
                },
                {
                    name: "Dwij Gosai",
                    role: "Member",
                    avatar: "/team/dwij.jpg"
                },
                {
                    name: "Tirth Choksi",
                    role: "Member",
                    avatar: "/team/tirthc.jpg"
                },
                {
                    name: "Sharanya",
                    role: "Member",
                    avatar: "/team/saranya.jpg"
                }
            ]
        },
        {
            domainName: "DSA",
            members: [
                {
                    name: "Pratham Gavadia",
                    role: "Lead",
                    avatar: "/team/prathams.jpg"
                },
                {
                    name: "Pruthvi Navadiya",
                    role: "Member",
                    avatar: "/team/pruthvi.jpg"
                },
                {
                    name: "Harry Panchal",
                    role: "Member",
                    avatar: "/team/harry.jpg"
                },
                {
                    name: "Jhanvi Patel",
                    role: "Member",
                    avatar: "/team/jhanvi.jpg"
                },
                {
                    name: "Tirth Jain",
                    role: "Member",
                    avatar: "/team/tirthj.jpg"
                }
            ]
        },
        {
            domainName: "Machine Learning",
            members: [
                {
                    name: "Vrajesh Sharma",
                    role: "Lead",
                    avatar: "/team/vrajesh.jpg"
                },
                {
                    name: "Saurabh Singh",
                    role: "Member",
                    avatar: "/team/saurabh.jpg"
                },
                {
                    name: "Sharv Mehta",
                    role: "Member",
                    avatar: "/team/sharv.jpg"
                },
                {
                    name: "Samarth Shrivastava",
                    role: "Member",
                    avatar: "/team/samarth.jpg"
                },
                {
                    name: "Dhruval Patel",
                    role: "Member",
                    avatar: "/team/dhruval.jpg"
                }
            ]
        },
        {
            domainName: "Design",
            members: [
                {
                    name: "Yaksh Vadaliya",
                    role: "Lead",
                    avatar: "/team/yaksh2.jpg"
                },
                {
                    name: "Ved Parmar",
                    role: "Lead",
                    avatar: "/team/ved.jpg"
                }
            ]
        },
        {
            domainName: "Public Relations",
            members: [
                {
                    name: "Deep Adatiya",
                    role: "Lead",
                    avatar: "/team/deep.jpg"
                },
                {
                    name: "Malhar Patel",
                    role: "Member",
                    avatar: "/team/malhar.jpg"
                },
                {
                    name: "Darshi Prajapati",
                    role: "Member",
                    avatar: "/team/darshi.jpg"
                },
                {
                    name: "Avyay Kachhia",
                    role: "Member",
                    avatar: "/team/avyay.jpg"
                },
                {
                    name: "Heer Rana",
                    role: "Member",
                    avatar: "/team/heer.jpg"
                }
            ]
        },
        {
            domainName: "Social Media",
            members: [
                {
                    name: "Pratham Patel",
                    role: "Lead",
                    avatar: "/team/prathama.jpg"
                }
            ]
        }
    ]

    return (
        <section className="py-12 md:py-32">
            <div className="mx-auto max-w-5xl px-8 lg:px-0">
                <TextScramble className="mb-8 text-primary uppercase text-4xl font-bold md:mb-16 lg:text-5xl">The Faces Behind ASPDC</TextScramble>
                {
                    everything.map((d, idx) => (
                        <div key={idx}>
                            <TextEffect per='char' preset='blur' speedReveal={.6} className="mb-3 text-2xl font-medium text-primary">{d.domainName}</TextEffect>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                className="h-px bg-white"
                            />

                            <motion.div
                                transition={{ duration: 1 }}
                                className="grid grid-cols-2 gap-4 py-5 md:grid-cols-4"
                            >
                                {d.members.map((member, index) => (
                                    <motion.div
                                        initial={{ y: 40, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }} // stagger effect
                                        viewport={{ once: true }}
                                        key={index}
                                    >
                                        <div
                                            className={`size-50 rounded-2xl border p-0.5 shadow shadow-zinc-950/5 ${member.role == "Member" ? "bg-white" : "bg-primary"
                                                }`}
                                        >
                                            <img
                                                className="aspect-square rounded-xl object-cover"
                                                src={member.avatar}
                                                alt={member.name}
                                                height="460"
                                                width="460"
                                                loading="lazy"
                                            />
                                        </div>
                                        <span className="mt-2 block text-base">{member.name}</span>
                                        <span className="text-muted-foreground block text-sm">
                                            {member.role}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    ))

                }
            </div>
        </section>
    )
}

export default page
'use client'

import { motion } from 'framer-motion'
import { Achievement } from '@/db/types'
import { Calendar } from 'lucide-react'
import { useState } from 'react'

export default function AchievementsMasonry({ ach }: { ach: Achievement[] }) {
    const [hoverState, setHoverState] = useState(-1)
    return (
        <div className="mx-auto max-w-7xl scroll-smooth px-4 py-16 sm:px-8">
            {/* Masonry grid */}
            <motion.div
                className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.15 } },
                }}
            >
                {ach.map((item, i) => (
                    <motion.div
                        onHoverStart={() => setHoverState(i)}
                        onHoverEnd={() => setHoverState(-1)}
                        key={item.title}
                        className="group relative break-inside-avoid overflow-hidden rounded-2xl bg-black/40 shadow-lg"
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        whileHover={{ scaleX: 1.05 }}
                    >
                        {/* Image */}
                        <motion.img
                            src={item.imageUrl || '/placeholder.svg'}
                            alt={item.title}
                            initial={false}
                            animate={
                                hoverState === i
                                    ? { height: 320 }
                                    : { height: 'auto' }
                            }
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={`h-auto w-full transform object-cover transition-transform duration-500 group-hover:scale-105`}
                            loading="lazy"
                        />

                        {/* Content */}
                        <motion.div
                            initial={false}
                            animate={
                                hoverState === i
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: -10 }
                            }
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="absolute bottom-0 left-0 w-full rounded-lg bg-black/60 p-5 text-white"
                        >
                            <h3 className="text-primary text-xl font-bold">
                                {item.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-200">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(item.date).toLocaleDateString(
                                        'en-US',
                                        {
                                            month: 'short',
                                            year: 'numeric',
                                        }
                                    )}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-100">
                                {item.description}
                            </p>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

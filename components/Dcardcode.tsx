'use client'

import React from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { Github } from 'lucide-react'
import { motion } from 'framer-motion'

export function Dcardcode({
    author,
    title,
    description,
    imgUrl,
    liveUrl,
    github_url,
}: {
    author?: string
    title?: string
    description?: string
    imgUrl?: string
    liveUrl?: string
    github_url?: string
}) {
    return (
        <CardContainer className="inter-var w-full">
            {/* <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        whileTap={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
      > */}
            <CardBody className="group/card relative min-h-[26rem] w-full rounded-xl border border-white/[0.2] bg-black p-4 hover:shadow-2xl hover:shadow-emerald-500/[0.1] sm:p-6">
                <CardItem
                    translateZ="30"
                    className="text-lg font-bold text-white sm:text-xl"
                >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-2">
                        <span className="truncate">{title}</span>
                        <span className="text-sm text-gray-400">
                            by {author}
                        </span>
                    </div>
                </CardItem>

                <CardItem
                    as="p"
                    translateZ="40"
                    className="mt-2 line-clamp-3 text-sm text-neutral-200"
                >
                    {description}
                </CardItem>

                <CardItem translateZ="50" className="mt-4 w-full">
                    <img
                        src={imgUrl}
                        height="500"
                        width="500"
                        className="h-40 w-full rounded-xl object-cover group-hover/card:shadow-xl sm:h-48"
                        alt="thumbnail"
                    />
                </CardItem>

                <div className="mt-4 flex items-center justify-between sm:mt-8">
                    <CardItem
                        translateZ={15}
                        as="a"
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:text-md hover:text-primary flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium sm:px-4"
                    >
                        <Github size={18} />
                        Github
                    </CardItem>

                    <CardItem
                        translateZ={15}
                        as="a"
                        href={github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:text-md hover:text-primary rounded-xl bg-gradient-to-r from-white to-gray-200 px-3 py-2 text-sm font-semibold text-black shadow-md sm:px-4"
                    >
                        Live Demo →
                    </CardItem>
                </div>
            </CardBody>
            {/* </motion.div> */}
        </CardContainer>
    )
}

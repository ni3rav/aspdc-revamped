'use client'

import { motion, MotionValue, useScroll, useTransform } from 'motion/react'
import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextRevealProps extends ComponentPropsWithoutRef<'div'> {
    children: string
}

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
    const targetRef = useRef<HTMLDivElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start 90%', 'end 60%'], // animate when text enters/leaves viewport
    })

    if (typeof children !== 'string') {
        throw new Error('TextReveal: children must be a string')
    }

    const words = children.split(' ')

    return (
        <div ref={targetRef} className={cn('inline-block', className)}>
            <span className="flex flex-wrap text-white/20">
                {words.map((word, i) => {
                    const start = i / words.length
                    const end = start + 1 / words.length
                    return (
                        <Word
                            key={i}
                            progress={scrollYProgress}
                            range={[start, end]}
                        >
                            {word}
                        </Word>
                    )
                })}
            </span>
        </div>
    )
}

interface WordProps {
    children: ReactNode
    progress: MotionValue<number>
    range: [number, number]
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1])

    return (
        <span className="relative mx-1">
            <span className="absolute opacity-30">{children}</span>
            <motion.span style={{ opacity }} className="text-white">
                {children}
            </motion.span>
        </span>
    )
}

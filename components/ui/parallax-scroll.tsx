'use client'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

export const ParallaxScrollSecond = ({
    images,
    className,
}: {
    images: string[]
    className?: string
}) => {
    const sectionRef = useRef<HTMLDivElement>(null)

    // observe section scroll relative to viewport
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
        // "start end" = section top hits bottom of viewport
        // "end start" = section bottom hits top of viewport
    })

    const translateYFirst = useTransform(scrollYProgress, [0, 1], [0, -200])
    const translateXFirst = useTransform(scrollYProgress, [0, 1], [0, -200])
    const rotateXFirst = useTransform(scrollYProgress, [0, 1], [0, -20])

    const translateYThird = useTransform(scrollYProgress, [0, 1], [0, -200])
    const translateXThird = useTransform(scrollYProgress, [0, 1], [0, 200])
    const rotateXThird = useTransform(scrollYProgress, [0, 1], [0, 20])

    const third = Math.ceil(images.length / 3)
    const firstPart = images.slice(0, third)
    const secondPart = images.slice(third, 2 * third)
    const thirdPart = images.slice(2 * third)

    return (
        <section
            ref={sectionRef}
            className={cn('relative w-full p-30', className)}
        >
            <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 px-10 md:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-10">
                    {firstPart.map((el, idx) => (
                        <motion.div
                            style={{
                                y: translateYFirst,
                                x: translateXFirst,
                                rotateZ: rotateXFirst,
                            }}
                            key={'grid-1' + idx}
                        >
                            <img
                                src={el}
                                className="h-80 w-full rounded-lg object-cover"
                                alt="thumbnail"
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-10">
                    {secondPart.map((el, idx) => (
                        <motion.div key={'grid-2' + idx}>
                            <img
                                src={el}
                                className="h-80 w-full rounded-lg object-cover"
                                alt="thumbnail"
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-10">
                    {thirdPart.map((el, idx) => (
                        <motion.div
                            style={{
                                y: translateYThird,
                                x: translateXThird,
                                rotateZ: rotateXThird,
                            }}
                            key={'grid-3' + idx}
                        >
                            <img
                                src={el}
                                className="h-80 w-full rounded-lg object-cover"
                                alt="thumbnail"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

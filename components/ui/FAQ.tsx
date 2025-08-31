'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
    question: string
    answer: string
}

// Pixel animation class for the contact card effect
class Pixel {
    private width: number
    private height: number
    private ctx: CanvasRenderingContext2D
    private x: number
    private y: number
    private color: string
    private speed: number
    private size: number
    private sizeStep: number
    private minSize: number
    private maxSizeInteger: number
    private maxSize: number
    private delay: number
    private counter: number
    private counterStep: number
    public isIdle: boolean
    private isReverse: boolean
    private isShimmer: boolean

    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        color: string,
        speed: number,
        delay: number
    ) {
        this.width = canvas.width
        this.height = canvas.height
        this.ctx = context
        this.x = x
        this.y = y
        this.color = color
        this.speed = Math.random() * 0.8 * speed
        this.size = 0
        this.sizeStep = Math.random() * 0.4
        this.minSize = 0.5
        this.maxSizeInteger = 2
        this.maxSize =
            Math.random() * (this.maxSizeInteger - this.minSize) + this.minSize
        this.delay = delay
        this.counter = 0
        this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
        this.isIdle = false
        this.isReverse = false
        this.isShimmer = false
    }

    private draw(): void {
        const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(
            this.x + centerOffset,
            this.y + centerOffset,
            this.size,
            this.size
        )
    }

    public appear(): void {
        this.isIdle = false
        if (this.counter <= this.delay) {
            this.counter += this.counterStep
            return
        }
        if (this.size >= this.maxSize) {
            this.isShimmer = true
        }
        if (this.isShimmer) {
            this.shimmer()
        } else {
            this.size += this.sizeStep
        }
        this.draw()
    }

    public disappear(): void {
        this.isShimmer = false
        this.counter = 0
        if (this.size <= 0) {
            this.isIdle = true
            return
        } else {
            this.size -= 0.1
        }
        this.draw()
    }

    private shimmer(): void {
        if (this.size >= this.maxSize) {
            this.isReverse = true
        } else if (this.size <= this.minSize) {
            this.isReverse = false
        }
        if (this.isReverse) {
            this.size -= this.speed
        } else {
            this.size += this.speed
        }
    }
}

const faqData: FAQItem[] = [
    {
        question: 'What is ASPDC?',
        answer: 'ASPDC (Adani Student Programming and Development Club) is a student-led community focused on programming, development, and technology innovation at Adani University.',
    },
    {
        question: 'How can I join ASPDC?',
        answer: 'You can join ASPDC by attending our events, joining our Discord server, or participating in our workshops and hackathons. Follow us on social media for updates on recruitment drives.',
    },
    {
        question: 'What events does ASPDC organize?',
        answer: 'We organize coding competitions like Code Charades, hackathons like Hackspire, workshops on various technologies, and networking events to connect students with industry professionals.',
    },
    {
        question: 'Do I need prior programming experience?',
        answer: 'Not at all! ASPDC welcomes students of all skill levels. We provide beginner-friendly workshops and mentorship programs to help you get started with programming.',
    },
    {
        question: 'What technologies do you focus on?',
        answer: 'We cover a wide range of technologies including web development, mobile app development, AI/ML, blockchain, game development, and emerging tech trends.',
    },
]

function AccordionItem({
    item,
    isOpen,
    onToggle,
}: {
    item: FAQItem
    isOpen: boolean
    onToggle: () => void
}) {
    return (
        <motion.div
            layout
            className="bg-background/50 mb-3 rounded-lg border border-gray-200/40 backdrop-blur sm:mb-4"
            whileHover={{
                y: -2,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                mass: 0.5,
            }}
        >
            <button
                onClick={onToggle}
                className="hover:bg-primary/5 flex w-full items-center justify-between gap-2 rounded-lg p-3 text-left transition-colors sm:p-4"
            >
                <span className="text-foreground pr-2 text-sm leading-tight font-medium sm:pr-4 sm:text-base">
                    {item.question}
                </span>
                <motion.div
                    animate={{
                        rotate: isOpen ? 180 : 0,
                        y: isOpen ? -2 : 0,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 12,
                        mass: 0.6,
                        bounce: 0.5,
                    }}
                    className="flex-shrink-0"
                >
                    <ChevronDown className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
            </button>
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                            y: -15,
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                            y: -10,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                            mass: 1,
                            bounce: 0.3,
                            velocity: 2,
                        }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{
                                y: -20,
                                opacity: 0,
                                rotateX: -10,
                            }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                rotateX: 0,
                            }}
                            exit={{
                                y: -15,
                                opacity: 0,
                                rotateX: -5,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 250,
                                damping: 18,
                                mass: 0.8,
                                bounce: 0.4,
                                delay: 0.08,
                            }}
                            className="text-muted-foreground p-3 pt-0 text-sm leading-relaxed sm:p-4 sm:text-base"
                            style={{ transformPerspective: 1000 }}
                        >
                            {item.answer}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function MagicCard({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pixelsRef = useRef<Pixel[]>([])
    const animationRef = useRef<number | null>(null)
    const timePreviousRef = useRef(performance.now())

    const reducedMotion = useRef(
        typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ).current

    // Responsive pixel configuration
    const getResponsiveConfig = () => {
        if (typeof window === 'undefined') return { gap: 10, speed: 30 }

        const width = window.innerWidth
        if (width < 640) {
            // mobile
            return { gap: 10, speed: 20 }
        } else if (width < 1024) {
            // tablet
            return { gap: 8, speed: 25 }
        } else {
            // desktop
            return { gap: 6, speed: 30 }
        }
    }

    const { gap, speed } = getResponsiveConfig()
    const colors = '#3b82f6,#93c5fd,#1e40af' // Blue theme for contact card

    const getEffectiveSpeed = (
        value: number,
        reducedMotion: boolean
    ): number => {
        const min = 0
        const max = 100
        const throttle = 0.001

        if (value <= min || reducedMotion) {
            return min
        } else if (value >= max) {
            return max * throttle
        } else {
            return value * throttle
        }
    }

    const initPixels = (): void => {
        if (!containerRef.current || !canvasRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const width = Math.floor(rect.width)
        const height = Math.floor(rect.height)
        const ctx = canvasRef.current.getContext('2d')

        if (!ctx) return

        // Use device pixel ratio for sharp rendering on high-DPI displays
        const devicePixelRatio = window.devicePixelRatio || 1

        canvasRef.current.width = width * devicePixelRatio
        canvasRef.current.height = height * devicePixelRatio
        canvasRef.current.style.width = `${width}px`
        canvasRef.current.style.height = `${height}px`

        ctx.scale(devicePixelRatio, devicePixelRatio)

        const colorsArray = colors.split(',')
        const pixels: Pixel[] = []

        // Create pixels with proper scaling
        for (let x = 0; x < width; x += gap) {
            for (let y = 0; y < height; y += gap) {
                const color =
                    colorsArray[Math.floor(Math.random() * colorsArray.length)]
                const dx = x - width / 2
                const dy = y - height / 2
                const distance = Math.sqrt(dx * dx + dy * dy)
                const delay = reducedMotion ? 0 : distance * 0.5 // Reduced delay for faster animation

                // Create a temporary canvas for pixel calculation
                const tempCanvas = document.createElement('canvas')
                tempCanvas.width = width
                tempCanvas.height = height
                const tempCtx = tempCanvas.getContext('2d')

                if (tempCtx) {
                    pixels.push(
                        new Pixel(
                            tempCanvas, // Use temp canvas for size calculations
                            ctx, // Use main context for drawing
                            x,
                            y,
                            color,
                            getEffectiveSpeed(speed, reducedMotion),
                            delay
                        )
                    )
                }
            }
        }
        pixelsRef.current = pixels
    }

    const doAnimate = (fnName: keyof Pixel): void => {
        animationRef.current = requestAnimationFrame(() => doAnimate(fnName))

        const timeNow = performance.now()
        const timePassed = timeNow - timePreviousRef.current
        const timeInterval = 1000 / 60

        if (timePassed < timeInterval) return

        timePreviousRef.current = timeNow - (timePassed % timeInterval)
        const ctx = canvasRef.current?.getContext('2d')

        if (!ctx || !canvasRef.current) return

        // Clear with proper device pixel ratio scaling
        const devicePixelRatio = window.devicePixelRatio || 1
        ctx.clearRect(
            0,
            0,
            canvasRef.current.width / devicePixelRatio,
            canvasRef.current.height / devicePixelRatio
        )

        let allIdle = true

        for (let i = 0; i < pixelsRef.current.length; i++) {
            const pixel = pixelsRef.current[i]
            ;(pixel[fnName] as () => void)()

            if (!pixel.isIdle) {
                allIdle = false
            }
        }

        if (allIdle && animationRef.current) {
            cancelAnimationFrame(animationRef.current)
        }
    }

    const handleAnimation = (animationType: keyof Pixel): void => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
        }
        animationRef.current = requestAnimationFrame(() =>
            doAnimate(animationType)
        )
    }

    const onMouseEnter = (): void => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
        }
        handleAnimation('appear')
    }

    const onMouseLeave = (): void => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
        }
        handleAnimation('disappear')
    }

    useEffect(() => {
        const initializeAnimation = () => {
            initPixels()
            // Don't start animation by default - only on hover
        }

        initializeAnimation()

        const observer = new ResizeObserver(() => {
            initializeAnimation()
        })

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => {
            observer.disconnect()
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className={`border-primary/20 from-background/80 to-background/60 relative overflow-hidden rounded-lg border bg-gradient-to-br shadow-lg backdrop-blur ${className}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
            />
            <div className="from-primary/10 to-primary/10 absolute inset-0 rounded-lg bg-gradient-to-r via-transparent opacity-50" />
            <div className="relative z-10">{children}</div>
        </div>
    )
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="bg-background/80 min-h-[60vh] w-full px-4 py-6 pt-12 sm:min-h-[70vh] sm:px-6 sm:py-8 sm:pt-16 md:px-8 lg:min-h-[80vh] lg:px-16 lg:pt-20">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-foreground mb-4 text-center text-xl font-semibold sm:mb-6 sm:text-left sm:text-2xl md:text-3xl lg:mb-8 lg:text-4xl"
            >
                Got Questions? We Got Answers
            </motion.h1>
            <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8 lg:flex-row">
                <div className="w-full lg:w-2/3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {faqData.map((item, index) => (
                            <AccordionItem
                                key={index}
                                item={item}
                                isOpen={openIndex === index}
                                onToggle={() => toggleAccordion(index)}
                            />
                        ))}
                    </motion.div>
                </div>
                <div className="mt-4 w-full lg:mt-4 lg:w-1/3">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <MagicCard className="h-fit p-4 sm:p-6 lg:p-8">
                            <h2 className="text-foreground mb-2 text-lg font-semibold sm:text-xl lg:text-2xl">
                                Still got questions for us?
                            </h2>
                            <p className="text-muted-foreground mb-4 text-xs opacity-75 sm:text-sm lg:text-base">
                                We would love to help you out
                            </p>
                            <Link href="mailto:aspdc@adaniuni.ac.in">
                                <button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:w-auto sm:px-6 sm:text-base">
                                    Contact Us
                                </button>
                            </Link>
                        </MagicCard>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

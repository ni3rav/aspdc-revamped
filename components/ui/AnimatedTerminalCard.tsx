import React, { useRef, useEffect } from 'react'
import './AnimatedTerminalCard.css'

/**
 * Pixel animation logic for terminal card background effect
 * Creates animated pixel dots with green theme
 */
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

    /**
     * Draws the pixel on canvas
     */
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

    /**
     * Handles pixel appearance animation
     */
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

    /**
     * Handles pixel disappearance animation
     */
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

    /**
     * Creates shimmer effect by oscillating pixel size
     */
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

/**
 * Calculates effective animation speed based on user preferences
 */
function getEffectiveSpeed(value: number, reducedMotion: boolean): number {
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

/**
 * Green variant configuration for terminal theme
 */
const GREEN_VARIANT = {
    activeColor: '#22c55e',
    gap: 6,
    speed: 35,
    colors: '#22c55e,#bbf7d0,#166534',
    noFocus: false,
} as const

/**
 * Props interface for AnimatedTerminalCard component
 */
export interface AnimatedTerminalCardProps {
    className?: string
    history: string[]
    inputValue: string
    onInputChange: (value: string) => void
    onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

/**
 * AnimatedTerminalCard Component
 *
 * Interactive terminal card with animated pixel background effect.
 * Features:
 * - Animated pixel grid background
 * - Terminal-like interface with command history
 * - Responsive design with accessibility support
 * - Performance optimized with reduced motion support
 */
export default function AnimatedTerminalCard({
    className = '',
    history,
    inputValue,
    onInputChange,
    onInputKeyDown,
}: AnimatedTerminalCardProps) {
    // DOM element references
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Animation state references
    const pixelsRef = useRef<Pixel[]>([])
    const animationRef = useRef<number | null>(null)
    const timePreviousRef = useRef(performance.now())

    // Check for reduced motion preference
    const reducedMotion = useRef(
        typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ).current

    const { gap, speed, colors } = GREEN_VARIANT

    /**
     * Initializes pixel grid for animation
     * Creates pixel instances based on container dimensions
     */
    const initPixels = (): void => {
        if (!containerRef.current || !canvasRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const width = Math.floor(rect.width)
        const height = Math.floor(rect.height)
        const ctx = canvasRef.current.getContext('2d')

        if (!ctx) return

        // Set canvas dimensions
        canvasRef.current.width = width
        canvasRef.current.height = height
        canvasRef.current.style.width = `${width}px`
        canvasRef.current.style.height = `${height}px`

        const colorsArray = colors.split(',')
        const pixels: Pixel[] = []

        // Create pixel grid
        for (let x = 0; x < width; x += gap) {
            for (let y = 0; y < height; y += gap) {
                const color =
                    colorsArray[Math.floor(Math.random() * colorsArray.length)]
                const dx = x - width / 2
                const dy = y - height / 2
                const distance = Math.sqrt(dx * dx + dy * dy)
                const delay = reducedMotion ? 0 : distance

                pixels.push(
                    new Pixel(
                        canvasRef.current,
                        ctx,
                        x,
                        y,
                        color,
                        getEffectiveSpeed(speed, reducedMotion),
                        delay
                    )
                )
            }
        }
        pixelsRef.current = pixels
    }

    /**
     * Animation loop handler
     * Manages frame rate and pixel animation states
     */
    const doAnimate = (fnName: keyof Pixel): void => {
        animationRef.current = requestAnimationFrame(() => doAnimate(fnName))

        const timeNow = performance.now()
        const timePassed = timeNow - timePreviousRef.current
        const timeInterval = 1000 / 60 // 60fps

        if (timePassed < timeInterval) return

        timePreviousRef.current = timeNow - (timePassed % timeInterval)
        const ctx = canvasRef.current?.getContext('2d')

        if (!ctx || !canvasRef.current) return

        // Clear canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        let allIdle = true

        // Animate all pixels
        for (let i = 0; i < pixelsRef.current.length; i++) {
            const pixel = pixelsRef.current[i]
            ;(pixel[fnName] as () => void)()

            if (!pixel.isIdle) {
                allIdle = false
            }
        }

        // Stop animation when all pixels are idle
        if (allIdle && animationRef.current) {
            cancelAnimationFrame(animationRef.current)
        }
    }

    /**
     * Handles animation state changes
     * Manages animation frame requests and cancellation
     */
    const handleAnimation = (animationType: keyof Pixel): void => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
        }
        animationRef.current = requestAnimationFrame(() =>
            doAnimate(animationType)
        )
    }

    // Event handlers for interactive states
    const onMouseEnter = (): void => handleAnimation('appear')
    const onMouseLeave = (): void => handleAnimation('disappear')

    const onFocus: React.FocusEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return
        handleAnimation('appear')
    }

    const onBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return
        handleAnimation('disappear')
    }

    /**
     * Effect hook for initialization and cleanup
     * Sets up ResizeObserver and initial animation
     */
    useEffect(() => {
        const initPixelsWrapper = (): void => {
            initPixels()
        }

        const handleAnimationWrapper = (animationType: keyof Pixel): void => {
            handleAnimation(animationType)
        }

        initPixelsWrapper()

        const observer = new ResizeObserver(() => {
            initPixelsWrapper()
        })

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        handleAnimationWrapper('appear')

        return () => {
            observer.disconnect()
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, []) // Empty dependency array to run only on mount/unmount

    return (
        <div
            ref={containerRef}
            className={`animated-terminal-card ${className}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
            onBlur={onBlur}
            tabIndex={0}
            role="region"
            aria-label="Interactive terminal"
        >
            {/* Animated pixel canvas background */}
            <canvas
                className="pixel-canvas"
                ref={canvasRef}
                aria-hidden="true"
            />

            {/* Terminal content */}
            <div className="terminal-content">
                <h2 className="mb-2 block text-center text-2xl font-bold text-green-400 lg:text-4xl">
                    Terminal Easter Egg
                </h2>

                {/* Command history display */}
                <div
                    className="h-64 w-full overflow-y-auto rounded-lg border border-green-700 bg-black/80 p-4 font-mono text-sm text-green-300 shadow-lg"
                    role="log"
                    aria-label="Command history"
                >
                    {history.map((line, idx) => (
                        <div key={idx} className="whitespace-pre-wrap">
                            {line}
                        </div>
                    ))}
                </div>

                {/* Command input */}
                <input
                    type="text"
                    className="mt-2 w-full rounded-lg border border-green-700 bg-black/90 p-2 font-mono text-green-300 transition-all focus:ring-2 focus:ring-green-400 focus:outline-none"
                    placeholder="Enter command..."
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    autoFocus
                    aria-label="Terminal command input"
                />
            </div>
        </div>
    )
}

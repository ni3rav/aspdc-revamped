import React, { useRef, useEffect, useState } from 'react'
import './AnimatedTerminalCard.css'

// Pixel animation logic (green theme)
class Pixel {
    width: number
    height: number
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    color: string
    speed: number
    size: number
    sizeStep: number
    minSize: number
    maxSizeInteger: number
    maxSize: number
    delay: number
    counter: number
    counterStep: number
    isIdle: boolean
    isReverse: boolean
    isShimmer: boolean

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

    draw() {
        const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(
            this.x + centerOffset,
            this.y + centerOffset,
            this.size,
            this.size
        )
    }

    appear() {
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

    disappear() {
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

    shimmer() {
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

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
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

const GREEN_VARIANT = {
    activeColor: '#22c55e',
    gap: 6,
    speed: 35,
    colors: '#22c55e,#bbf7d0,#166534',
    noFocus: false,
}

export interface AnimatedTerminalCardProps {
    className?: string
    children?: React.ReactNode
    history: string[]
    inputValue: string
    onInputChange: (v: string) => void
    onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function AnimatedTerminalCard({
    className = '',
    children,
    history,
    inputValue,
    onInputChange,
    onInputKeyDown,
}: AnimatedTerminalCardProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pixelsRef = useRef<Pixel[]>([])
    const animationRef = useRef<number | null>(null)
    const timePreviousRef = useRef(performance.now())
    const reducedMotion = useRef(
        typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ).current

    const { gap, speed, colors } = GREEN_VARIANT

    const initPixels = () => {
        if (!containerRef.current || !canvasRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const width = Math.floor(rect.width)
        const height = Math.floor(rect.height)
        const ctx = canvasRef.current.getContext('2d')
        canvasRef.current.width = width
        canvasRef.current.height = height
        canvasRef.current.style.width = `${width}px`
        canvasRef.current.style.height = `${height}px`
        const colorsArray = colors.split(',')
        const pxs = []
        for (let x = 0; x < width; x += gap) {
            for (let y = 0; y < height; y += gap) {
                const color =
                    colorsArray[Math.floor(Math.random() * colorsArray.length)]
                const dx = x - width / 2
                const dy = y - height / 2
                const distance = Math.sqrt(dx * dx + dy * dy)
                const delay = reducedMotion ? 0 : distance
                if (!ctx) return
                pxs.push(
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
        pixelsRef.current = pxs
    }

    const doAnimate = (fnName: keyof Pixel) => {
        animationRef.current = requestAnimationFrame(() => doAnimate(fnName))
        const timeNow = performance.now()
        const timePassed = timeNow - timePreviousRef.current
        const timeInterval = 1000 / 60
        if (timePassed < timeInterval) return
        timePreviousRef.current = timeNow - (timePassed % timeInterval)
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx || !canvasRef.current) return
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        let allIdle = true
        for (let i = 0; i < pixelsRef.current.length; i++) {
            const pixel = pixelsRef.current[i]
            // @ts-ignore
            pixel[fnName]()
            if (!pixel.isIdle) {
                allIdle = false
            }
        }
        if (allIdle) {
            cancelAnimationFrame(animationRef.current!)
        }
    }

    const handleAnimation = (name: keyof Pixel) => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
        }
        animationRef.current = requestAnimationFrame(() => doAnimate(name))
    }

    // Fade in on mouse enter/focus, fade out on mouse leave/blur
    const onMouseEnter = () => handleAnimation('appear')
    const onMouseLeave = () => handleAnimation('disappear')
    const onFocus: React.FocusEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return
        handleAnimation('appear')
    }
    const onBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return
        handleAnimation('disappear')
    }

    useEffect(() => {
        initPixels()
        const observer = new ResizeObserver(() => {
            initPixels()
        })
        if (containerRef.current) {
            observer.observe(containerRef.current)
        }
        handleAnimation('appear')
        return () => {
            observer.disconnect()
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gap, speed, colors])

    return (
        <div
            ref={containerRef}
            className={`animated-terminal-card ${className}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
            onBlur={onBlur}
            tabIndex={0}
        >
            <canvas className="pixel-canvas" ref={canvasRef} />
            <div className="terminal-content">
                <span className="mb-2 block text-center text-2xl font-bold text-green-400 lg:text-4xl">
                    Terminal Easter Egg
                </span>
                <div className="h-64 w-full overflow-y-auto rounded-lg border border-green-700 bg-black/80 p-4 font-mono text-sm text-green-300 shadow-lg">
                    {history.map((line, idx) => (
                        <div key={idx} className="whitespace-pre-wrap">
                            {line}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    className="mt-2 w-full rounded-lg border border-green-700 bg-black/90 p-2 font-mono text-green-300 transition-all focus:ring-2 focus:ring-green-400 focus:outline-none"
                    placeholder="Enter command..."
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    autoFocus
                />
            </div>
        </div>
    )
}

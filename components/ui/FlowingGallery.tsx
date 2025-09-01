'use client'
import React, {
    useRef,
    useLayoutEffect,
    useMemo,
    FC,
    MouseEvent,
    useState,
    useCallback,
} from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import VariableProximity from '@/components/bits/VariableProximity/VariableProximity'

/**
 * Interface for individual gallery item properties
 */
interface GalleryItemProps {
    text: string
    image: string
    setActive: () => void
}

/**
 * Interface for main gallery component props
 */
interface FlowingGalleryProps {
    items: Omit<GalleryItemProps, 'setActive'>[]
}

/**
 * FlowingGallery Component
 *
 * Interactive gallery with floating image preview and marquee animations.
 * Features:
 * - Proximity-based text effects in header
 * - Mouse-following image preview on hover
 * - Marquee text animation on gallery items
 * - Optimized performance with memoization and callbacks
 */
const FlowingGallery: FC<FlowingGalleryProps> = ({ items = [] }) => {
    // State for active image and mouse position tracking
    const [activeImage, setActiveImage] = useState<string | null>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // DOM element references
    const imageRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    /**
     * Optimized mouse move handler
     * Updates mouse position for floating image animation
     */
    const handleMouseMove = useCallback((e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
    }, [])

    /**
     * Mouse leave handler
     * Hides the floating image when mouse leaves gallery area
     */
    const handleMouseLeave = useCallback(() => {
        setActiveImage(null)
    }, [])

    /**
     * Floating image position animation
     * Smoothly follows mouse cursor with GSAP animation
     */
    useLayoutEffect(() => {
        if (!imageRef.current) return

        gsap.to(imageRef.current, {
            x: mousePosition.x,
            y: mousePosition.y,
            duration: 0.9,
            ease: 'power3.out',
        })
    }, [mousePosition])

    /**
     * Floating image visibility animation
     * Handles opacity and scale transitions when image changes
     */
    useLayoutEffect(() => {
        if (!imageRef.current) return

        gsap.to(imageRef.current, {
            opacity: activeImage ? 1 : 0,
            scale: activeImage ? 1 : 0.5,
            duration: 0.4,
            ease: 'power3.out',
        })
    }, [activeImage])

    return (
        <div className="w-full bg-black/90" ref={containerRef}>
            {/* Interactive Header Section */}
            <header className="group bg-gradient-to-b from-black/90 to-black/80 py-20 text-center">
                <div className="cursor-pointer">
                    <VariableProximity
                        label="MEMORIES"
                        fromFontVariationSettings="'wght' 300, 'slnt' 0"
                        toFontVariationSettings="'wght' 700, 'slnt' -10"
                        containerRef={containerRef}
                        className="text-5xl font-light tracking-[0.3em] text-gray-300 opacity-80 transition-all duration-700 ease-out group-hover:tracking-[0.4em] group-hover:text-gray-100 group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(156,163,175,0.3)] md:text-7xl"
                        radius={120}
                    />
                    {/* Decorative underline */}
                    <div className="mx-auto mt-6 h-px w-24 bg-gray-500 opacity-40 transition-all duration-500 group-hover:w-32 group-hover:bg-gray-400 group-hover:opacity-60" />
                </div>
            </header>

            {/* Main Gallery Container */}
            <div
                className="relative h-[600px] w-full cursor-none bg-black/80 md:h-screen"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                role="region"
                aria-label="Interactive memory gallery"
            >
                {/* Gallery Items Navigation */}
                <nav
                    className="flex h-full flex-col"
                    aria-label="Gallery items"
                >
                    {items.map((item) => (
                        <GalleryItem
                            key={item.text}
                            {...item}
                            setActive={() => setActiveImage(item.image)}
                        />
                    ))}
                </nav>

                {/* Floating Image Preview (Desktop Only) */}
                <div
                    ref={imageRef}
                    className="pointer-events-none fixed top-0 left-0 z-50 hidden overflow-hidden rounded-xl opacity-0 md:block"
                    style={{ transform: 'translate(-50%, -50%)' }}
                    aria-hidden="true"
                >
                    <div className="relative aspect-[3/4] w-64 bg-gray-800 shadow-2xl md:w-72 lg:w-80">
                        {activeImage && (
                            <Image
                                src={activeImage}
                                alt="Gallery preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                                priority
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * GalleryItem Component
 *
 * Individual gallery item with marquee animation and hover effects.
 * Features:
 * - Marquee text animation on hover
 * - Edge-based animation direction detection
 * - Optimized event handlers with memoization
 */
const GalleryItem: FC<GalleryItemProps> = ({ text, setActive }) => {
    // DOM element references
    const itemRef = useRef<HTMLDivElement>(null)
    const marqueeRef = useRef<HTMLDivElement>(null)
    const marqueeInnerRef = useRef<HTMLDivElement>(null)

    /**
     * Marquee animation setup
     * Creates infinite horizontal scrolling animation for text
     */
    useLayoutEffect(() => {
        if (!marqueeInnerRef.current) return

        const tween = gsap.to(marqueeInnerRef.current, {
            xPercent: -50,
            duration: 40,
            ease: 'none',
            repeat: -1,
        })

        return () => {
            tween.kill()
        }
    }, [])

    /**
     * Memoized animation configuration
     * Reused across multiple animations for consistency
     */
    const animationDefaults = useMemo(
        () => ({
            duration: 0.6,
            ease: 'expo',
        }),
        []
    )

    /**
     * Utility function to determine closest edge for animation direction
     * Calculates which edge (top/bottom) is closest to mouse position
     */
    const findClosestEdge = useCallback(
        (
            mouseX: number,
            mouseY: number,
            width: number,
            height: number
        ): 'top' | 'bottom' => {
            const topDist = Math.hypot(mouseX - width / 2, mouseY)
            const bottomDist = Math.hypot(mouseX - width / 2, mouseY - height)
            return topDist < bottomDist ? 'top' : 'bottom'
        },
        []
    )

    /**
     * Mouse enter handler
     * Triggers marquee animation and activates image preview
     */
    const handleMouseEnter = useCallback(
        (ev: MouseEvent<HTMLDivElement>) => {
            setActive()

            if (!itemRef.current || !marqueeRef.current) return

            const rect = itemRef.current.getBoundingClientRect()
            const edge = findClosestEdge(
                ev.clientX - rect.left,
                ev.clientY - rect.top,
                rect.width,
                rect.height
            )

            gsap.timeline({ defaults: animationDefaults })
                .set(marqueeRef.current, {
                    y: edge === 'top' ? '-101%' : '101%',
                })
                .to(marqueeRef.current, { y: '0%' })
        },
        [setActive, findClosestEdge, animationDefaults]
    )

    /**
     * Mouse leave handler
     * Reverses marquee animation based on exit direction
     */
    const handleMouseLeave = useCallback(
        (ev: MouseEvent<HTMLDivElement>) => {
            if (!itemRef.current || !marqueeRef.current) return

            const rect = itemRef.current.getBoundingClientRect()
            const edge = findClosestEdge(
                ev.clientX - rect.left,
                ev.clientY - rect.top,
                rect.width,
                rect.height
            )

            gsap.timeline({ defaults: animationDefaults }).to(
                marqueeRef.current,
                { y: edge === 'top' ? '-101%' : '101%' }
            )
        },
        [findClosestEdge, animationDefaults]
    )

    /**
     * Memoized marquee content
     * Prevents unnecessary re-renders of repeated text elements
     */
    const marqueeContent = useMemo(
        () =>
            Array.from({ length: 15 }, (_, idx) => (
                <span
                    key={idx}
                    className="px-[1vw] text-3xl leading-[1.2] font-bold text-[#060010] uppercase md:text-[4vh]"
                >
                    {text}
                </span>
            )),
        [text]
    )

    return (
        <div
            className="relative flex h-full flex-1 items-center justify-center overflow-hidden border-t border-t-white/20 text-center text-[4vh] font-semibold text-white transition-colors duration-500 first:border-t-0 hover:text-transparent focus:text-transparent"
            ref={itemRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label={`View ${text} gallery`}
        >
            <span>{text}</span>

            {/* Marquee Overlay Animation */}
            <div
                className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden bg-white"
                style={{ transform: 'translateY(101%)' }}
                ref={marqueeRef}
                aria-hidden="true"
            >
                <div
                    className="absolute top-0 left-0 flex h-full w-max items-center"
                    ref={marqueeInnerRef}
                >
                    {marqueeContent}
                </div>
            </div>
        </div>
    )
}

export { FlowingGallery }

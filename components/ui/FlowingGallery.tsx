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
    onTouchStart?: () => void
    onTouchEnd?: () => void
    isMobile?: boolean
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
 * - Mouse-following image preview on hover (desktop) / touch-responsive (mobile)
 * - Marquee text animation on gallery items
 * - Optimized performance with memoization and callbacks
 * - Responsive design for all devices
 */
const FlowingGallery: FC<FlowingGalleryProps> = ({ items = [] }) => {
    // State for active image and mouse position tracking
    const [activeImage, setActiveImage] = useState<string | null>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isMobile, setIsMobile] = useState(false)
    const [touchedItem, setTouchedItem] = useState<string | null>(null)

    // DOM element references
    const imageRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Detect mobile device
    useLayoutEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    /**
     * Optimized mouse move handler for desktop
     * Updates mouse position for floating image animation
     */
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isMobile) return // Skip on mobile devices
            setMousePosition({ x: e.clientX, y: e.clientY })
        },
        [isMobile]
    )

    /**
     * Mouse leave handler
     * Hides the floating image when mouse leaves gallery area
     */
    const handleMouseLeave = useCallback(() => {
        if (!isMobile) {
            setActiveImage(null)
        }
    }, [isMobile])

    /**
     * Touch handlers for mobile devices
     */
    const handleTouchStart = useCallback(
        (imageSrc: string) => {
            if (isMobile) {
                setTouchedItem(imageSrc)
                setActiveImage(imageSrc)
            }
        },
        [isMobile]
    )

    const handleTouchEnd = useCallback(() => {
        if (isMobile) {
            setTimeout(() => {
                setTouchedItem(null)
                setActiveImage(null)
            }, 2000) // Show image for 2 seconds on mobile
        }
    }, [isMobile])

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
        <div className="w-full bg-[#060010]" ref={containerRef}>
            {/* Interactive Header Section */}
            <header className="group bg-gradient-to-b from-[#060010] to-[#0a0018] px-4 py-12 text-center sm:py-16 md:py-20">
                <div className="cursor-pointer">
                    <VariableProximity
                        label="MEMORIES"
                        fromFontVariationSettings="'wght' 300, 'slnt' 0"
                        toFontVariationSettings="'wght' 700, 'slnt' -10"
                        containerRef={containerRef}
                        className="text-3xl font-light tracking-[0.2em] text-gray-300 opacity-80 transition-all duration-700 ease-out group-hover:tracking-[0.25em] group-hover:text-gray-100 group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(156,163,175,0.3)] sm:text-4xl sm:tracking-[0.3em] sm:group-hover:tracking-[0.4em] md:text-5xl lg:text-6xl xl:text-7xl"
                        radius={isMobile ? 80 : 120}
                    />
                    {/* Decorative underline */}
                    <div className="mx-auto mt-4 h-px w-16 bg-gray-500 opacity-40 transition-all duration-500 group-hover:w-20 group-hover:bg-gray-400 group-hover:opacity-60 sm:mt-6 sm:w-20 sm:group-hover:w-24 md:w-24 md:group-hover:w-32" />
                </div>
            </header>

            {/* Main Gallery Container */}
            <div
                className="relative min-h-[400px] w-full bg-transparent sm:min-h-[500px] md:min-h-[600px] lg:h-screen"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                role="region"
                aria-label="Interactive memory gallery"
                style={{ cursor: isMobile ? 'default' : 'none' }}
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
                            onTouchStart={() => handleTouchStart(item.image)}
                            onTouchEnd={handleTouchEnd}
                            isMobile={isMobile}
                        />
                    ))}
                </nav>

                {/* Floating Image Preview - Desktop and Mobile */}
                <div
                    ref={imageRef}
                    className={`pointer-events-none fixed z-50 overflow-hidden rounded-xl transition-opacity duration-300 ${
                        isMobile
                            ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0'
                            : 'top-0 left-0 hidden opacity-0 md:block'
                    }`}
                    style={{
                        transform: isMobile
                            ? 'translate(-50%, -50%)'
                            : 'translate(-50%, -50%)',
                        opacity: activeImage ? 1 : 0,
                    }}
                    aria-hidden="true"
                >
                    <div className="relative aspect-[3/4] w-48 bg-gray-800 shadow-2xl sm:w-56 md:w-64 lg:w-72 xl:w-80">
                        {activeImage && (
                            <Image
                                src={activeImage}
                                alt="Gallery preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, (max-width: 1280px) 288px, 320px"
                                priority={false}
                                loading="lazy"
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
const GalleryItem: FC<GalleryItemProps> = ({
    text,
    setActive,
    onTouchStart,
    onTouchEnd,
    isMobile = false,
}) => {
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
     * Responsive text sizing based on device type
     */
    const marqueeContent = useMemo(
        () =>
            Array.from({ length: 15 }, (_, idx) => (
                <span
                    key={idx}
                    className="font-bold text-[#060010] uppercase"
                    style={{
                        paddingLeft: isMobile ? '4vw' : '1vw',
                        paddingRight: isMobile ? '4vw' : '1vw',
                        fontSize: isMobile
                            ? 'clamp(1.2rem, 3vw, 2rem)'
                            : 'clamp(1.5rem, 4vh, 3rem)',
                        lineHeight: 1.2,
                    }}
                >
                    {text}
                </span>
            )),
        [text, isMobile]
    )

    return (
        <div
            className="relative flex h-full flex-1 items-center justify-center overflow-hidden border-t border-t-white/20 px-4 py-8 text-center font-semibold text-white transition-colors duration-500 first:border-t-0 hover:text-transparent focus:text-transparent md:py-0"
            style={{
                fontSize: isMobile
                    ? 'clamp(1.5rem, 4vw, 2.5rem)'
                    : 'clamp(2rem, 4vh, 4rem)',
                minHeight: isMobile ? '80px' : 'auto',
            }}
            ref={itemRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            role="button"
            tabIndex={0}
            aria-label={`View ${text} gallery`}
        >
            <span className="relative z-10">{text}</span>

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

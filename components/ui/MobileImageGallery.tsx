'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
    useAnimationFrame,
    useMotionValue,
} from 'framer-motion'

interface GalleryItem {
    image: string
    alt: string
}

interface MobileImageGalleryProps {
    items: GalleryItem[]
    baseVelocity?: number
    className?: string
    numCopies?: number
}

/**
 * VelocityImages Component
 *
 * Creates a horizontal scrolling animation of images that responds to scroll velocity.
 * Optimized for mobile with large images that cover almost full width.
 * Ensures seamless infinite loop showing all photos.
 */
function VelocityImages({
    items,
    baseVelocity = 15,
    className = '',
    numCopies = 4, // Enough copies for smooth infinite loop
}: MobileImageGalleryProps) {
    const baseX = useMotionValue(0)
    const { scrollY } = useScroll()
    const scrollVelocity = useVelocity(scrollY)
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    })
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 3], {
        clamp: false,
    })

    const directionFactor = useRef<number>(1)

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

        // Change direction based on scroll velocity
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1
        }

        // Add scroll velocity influence
        moveBy += directionFactor.current * moveBy * velocityFactor.get()

        baseX.set(baseX.get() + moveBy)
    })

    // Create repeated items for infinite loop
    const repeatedItems = Array.from({ length: numCopies }, () => items).flat()

    // Transform with proper wrapping for seamless infinite loop
    const x = useTransform(baseX, (value) => {
        // Calculate the width of one complete set of images
        const oneSetWidth = items.length * 92 // Each image is ~90vw + margin
        const wrappedValue = ((value % oneSetWidth) + oneSetWidth) % oneSetWidth
        return `-${wrappedValue}vw`
    })

    return (
        <div className={`overflow-hidden ${className}`}>
            <motion.div className="flex will-change-transform" style={{ x }}>
                {repeatedItems.map((item, index) => (
                    <div
                        key={`${item.image}-${index}`}
                        className="relative mr-2 flex-shrink-0 overflow-hidden rounded-lg"
                        style={{
                            width: 'calc(90vw)', // Large width covering most of screen
                            height: '220px', // Taller for better mobile viewing
                        }}
                    >
                        <Image
                            src={item.image}
                            alt={item.alt}
                            fill
                            className="object-cover"
                            sizes="90vw"
                            quality={85}
                            loading="lazy"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

/**
 * Wrap utility function for infinite scrolling
 */
const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

/**
 * MobileImageGallery Component
 *
 * Mobile-optimized horizontal scrolling image gallery.
 * Shows large images in a scroll-velocity responsive animation.
 * Images cover most of the screen width with small parts of adjacent images visible.
 */
const MobileImageGallery: React.FC<MobileImageGalleryProps> = ({
    items,
    baseVelocity = 15,
    className = '',
    numCopies = 4,
}) => {
    return (
        <section
            className={`py-8 ${className}`}
            aria-label="Mobile Image Gallery"
        >
            {/* Gallery Title */}
            <div className="mb-6 text-center">
                <h2 className="text-primary text-3xl font-bold">Gallery</h2>
            </div>

            {/* Large Image Gallery with infinite loop */}
            <VelocityImages
                items={items}
                baseVelocity={baseVelocity}
                numCopies={numCopies}
                className="py-4"
            />
        </section>
    )
}

export default MobileImageGallery

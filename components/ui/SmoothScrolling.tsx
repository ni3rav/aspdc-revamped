'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScrolling Component
 *
 * Provides buttery smooth scrolling experience using Lenis
 * Features:
 * - Hardware accelerated smooth scrolling
 * - Optimized for performance
 * - Works with all scroll-triggered animations
 * - Responsive and touch-friendly
 */
export default function SmoothScrolling() {
    useEffect(() => {
        // Ensure we start at the top before initializing Lenis
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0

        // Small delay to ensure scroll position is set before Lenis takes over
        const initializeLenis = () => {
            // Initialize Lenis smooth scrolling with minimal configuration
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                // Ensure Lenis respects initial scroll position
                autoRaf: false,
            })

            // Explicitly set scroll position to 0 after Lenis initialization
            lenis.scrollTo(0, { immediate: true })

            // Animation frame loop for Lenis
            function raf(time: number) {
                lenis.raf(time)
                requestAnimationFrame(raf)
            }

            requestAnimationFrame(raf)

            // Return cleanup function
            return () => {
                lenis.destroy()
            }
        }

        // Initialize with a small delay to prevent interference
        const timeoutId = setTimeout(initializeLenis, 100)

        // Cleanup function
        return () => {
            clearTimeout(timeoutId)
        }
    }, [])

    return null // This component doesn't render anything
}

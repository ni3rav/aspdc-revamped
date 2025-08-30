'use client'
import { useEffect } from 'react'

/**
 * ScrollTo Component
 *
 * Client component that ensures the page loads from the top (Hero section)
 * Works by scrolling to top on mount and handling browser navigation
 */
const ScrollTo = () => {
    useEffect(() => {
        // Immediate scroll to top
        window.scrollTo(0, 0)

        // Additional scroll after a brief delay to handle any layout shifts
        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0)
        }, 100)

        // Handle browser back/forward navigation
        const handlePopState = () => {
            window.scrollTo(0, 0)
        }

        window.addEventListener('popstate', handlePopState)

        // Cleanup
        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    // This component renders nothing visible
    return null
}

export default ScrollTo

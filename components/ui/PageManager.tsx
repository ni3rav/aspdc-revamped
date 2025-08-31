'use client'

import { useLayoutEffect, useEffect, useState } from 'react'

/**
 * PageManager Component
 *
 * Handles page initialization and prevents AboutSection flash
 * Uses both useLayoutEffect and useEffect for maximum coverage
 * This is a client component that manages page state
 */
const PageManager = ({ children }: { children: React.ReactNode }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    // useLayoutEffect runs before browser paint - critical for preventing flash
    useLayoutEffect(() => {
        const forceScrollTop = () => {
            // Multiple methods to ensure it works
            if (typeof window !== 'undefined') {
                window.scrollTo(0, 0)
                document.documentElement.scrollTop = 0
                document.body.scrollTop = 0
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
            }
        }

        // Execute immediately
        forceScrollTop()

        // Force disable smooth scrolling temporarily
        const originalScrollBehavior =
            document.documentElement.style.scrollBehavior
        document.documentElement.style.scrollBehavior = 'auto'

        // Add class to enable overflow after positioning
        document.documentElement.classList.add('js-loaded')

        // Restore after ensuring position
        setTimeout(() => {
            forceScrollTop()
            document.documentElement.style.scrollBehavior =
                originalScrollBehavior
            setIsLoaded(true)
        }, 50)
    }, [])

    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo(0, 0)
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        }

        // Execute immediately
        scrollToTop()

        // Execute multiple times with increasing delays to handle any interference
        const timeouts = [
            setTimeout(scrollToTop, 0),
            setTimeout(scrollToTop, 10),
            setTimeout(scrollToTop, 50),
            setTimeout(scrollToTop, 100),
        ]

        // Handle browser back/forward navigation
        const handlePopState = () => {
            scrollToTop()
        }

        // Handle page visibility change
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                scrollToTop()
            }
        }

        window.addEventListener('popstate', handlePopState)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // Cleanup
        return () => {
            timeouts.forEach(clearTimeout)
            window.removeEventListener('popstate', handlePopState)
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
        }
    }, [])

    return (
        <div
            className={`page-container flex min-h-screen w-full flex-col overflow-x-hidden ${isLoaded ? 'loaded' : ''}`}
        >
            {children}
        </div>
    )
}

export default PageManager

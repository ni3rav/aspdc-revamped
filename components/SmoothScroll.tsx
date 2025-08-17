// components/SmoothScroll.tsx
'use client'
import { useEffect, ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'

interface SmoothScrollProps {
    children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number): number =>
                Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            wheelMultiplier: 1,
            touchMultiplier: 2,
        })

        function raf(time: number): void {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return (): void => {
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}

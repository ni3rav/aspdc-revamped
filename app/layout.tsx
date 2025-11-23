import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import Navbar from '@/components/Navbar'
import DotGrid from '@/components/bits/DotGrid/DotGrid'
import Footer from '@/components/Footer'

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'ASPDC',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${spaceGrotesk.className} overflow-x-hidden antialiased select-none`}
            >
                <Toaster richColors position="top-right" />
                <div className="relative w-screen">
                    <div className="fixed inset-0 -z-10">
                        <DotGrid
                            dotSize={10}
                            baseColor="#111111"
                            activeColor="#23C55E"
                            className="h-full w-full"
                        />
                    </div>
                    <Suspense fallback={null}>
                        <Navbar />
                    </Suspense>
                </div>
                <div className="mt-9 sm:mt-0">{children}</div>
                <Footer />
            </body>
        </html>
    )
}

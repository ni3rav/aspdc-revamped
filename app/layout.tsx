import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import QueryProvider from '@/lib/query-provider'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/layout/Navbar'
import DotGrid from '@/components/bits/DotGrid/DotGrid'

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'ASPDC',
    icons: '/aspdcom.png',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider
            appearance={{
                elements: {
                    footer: 'hidden',
                },
            }}
        >
            <html lang="en">
                <body
                    className={`${spaceGrotesk.className} secnone antialiased`}
                >
                    <Toaster richColors position="top-right" />
                    <QueryProvider>
                        <div className="relative w-screen">
                            <div className="fixed inset-0 -z-10">
                                <DotGrid
                                    dotSize={10}
                                    baseColor="#111111"
                                    activeColor="#23C55E"
                                    className="h-full w-full"
                                />
                            </div>
                            <Navbar />
                        </div>
                        {children}
                    </QueryProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}

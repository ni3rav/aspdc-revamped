import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import QueryProvider from '@/lib/query-provider'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/layout/Navbar'
import DotGrid from '@/components/bits/DotGrid/DotGrid'
import Footer from '@/components/layout/footer'

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'ASPDC - Adani Student Programing and Development Club',
    description:
        'Join ASPDC, the premier community for software professionals and developers in Ahmedabad. Learn, grow, and connect through innovative coding events, workshops, and networking opportunities.',
    icons: '/aspdcom.png',
    keywords: [
        'ASPDC',
        'Ahmedabad',
        'Software',
        'Developers',
        'Programming',
        'Community',
        'Events',
        'Coding',
        'Technology',
    ],
    authors: [{ name: 'ASPDC Team' }],
    openGraph: {
        title: 'ASPDC - Adani Student Programing and Development Club',
        description:
            'Join ASPDC for innovative coding events, workshops, and networking opportunities in Ahmedabad.',
        url: 'https://aspdc.vercel.app',
        siteName: 'ASPDC',
        images: [
            {
                url: '/aspdc.png',
                width: 1200,
                height: 630,
                alt: 'ASPDC Community Logo',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ASPDC - Adani Student Programing and Development Club',
        description:
            'Join ASPDC for innovative coding events, workshops, and networking opportunities.',
        images: ['/aspdc.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code', // Replace with actual verification code
    },
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
                    className={`${spaceGrotesk.className} secnone bg-black antialiased`}
                >
                    <Toaster richColors position="top-center" />
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
                        <Footer />
                    </QueryProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}

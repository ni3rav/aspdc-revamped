import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import QueryProvider from '@/lib/query-provider'
import Navbar from '@/components/layout/Navbar'
import DotGrid from '@/components/bits/DotGrid/DotGrid'

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'ASPDC',
    icons: '/aspdcom.png'
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.className} antialiased secnone`}>
                <Toaster richColors position="top-center" />
                <QueryProvider>
                    <div className='w-screen relative'>
                        <div className="fixed inset-0 -z-10">
                            <DotGrid dotSize={10} baseColor='#111111' activeColor='#23C55E' className='h-full w-full' />
                        </div>
                        <Navbar />
                    </div>
                    {children}

                </QueryProvider>
            </body>
        </html>
    )
}

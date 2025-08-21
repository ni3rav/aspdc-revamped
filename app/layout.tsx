import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import QueryProvider from '@/lib/query-provider'
import Navbar from '@/components/layout/Navbar'

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
            <body className={`${spaceGrotesk.className} antialiased`}>
                <Toaster richColors position="top-center" />
                <QueryProvider>
                    <div className='absolute'>
                        {/* <div className="fixed top-0 left-0"> */}
                        {/* </div> */}
                        {children}
                    </div>

                </QueryProvider>
            </body>
        </html>
    )
}

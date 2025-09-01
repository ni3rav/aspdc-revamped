import type React from 'react'
import { FloatingNavbar } from '@/components/admin/floating-navbar'
import { ClerkProvider } from '@clerk/nextjs'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider
            appearance={{
                elements: {
                    footer: 'hidden',
                },
            }}
        >
            <div className="bg-background flex min-h-screen min-w-screen items-center justify-center">
                <FloatingNavbar basePath="/admin" />
                <main className="max-h-10/12 w-3/4 overflow-x-hidden overflow-y-scroll px-4 pt-20 pb-8">
                    {children}
                </main>
            </div>
        </ClerkProvider>
    )
}

'use client'

import type React from 'react'

import { usePathname } from 'next/navigation'

const pageConfigs = {
    '/events': {
        title: 'events',
        subtitle:
            'dive into our tech-tastic lineup of workshops, talks, and coding challenges!',
    },
    '/projects': {
        title: 'projects',
        subtitle: 'witness some of the best projects created by our students',
    },
    '/achievements': {
        title: 'achievements',
        subtitle:
            "cherishing our members' victories in hackathons, competitions, and tech challenges!",
    },
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const config = pageConfigs[pathname as keyof typeof pageConfigs] || {
        title: 'Dashboard',
        subtitle: 'Welcome to your dashboard',
    }

    return (
        <div className="min-h-screen">
            <header className="border-b shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold">{config.title}</h1>
                        <p className="mt-2">{config.subtitle}</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}

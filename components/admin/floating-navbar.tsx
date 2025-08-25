'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SignedIn, SignOutButton } from '@clerk/nextjs'
import {
    CalendarClock,
    Code,
    FileText,
    Home,
    Images,
    Trophy,
    LogOut,
} from 'lucide-react'

interface FloatingNavbarProps {
    basePath?: string
}

export function FloatingNavbar({ basePath = '' }: FloatingNavbarProps) {
    const pathname = usePathname()
    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/achievements', label: 'Achievements', icon: Trophy },
        { href: '/blogs', label: 'Blogs', icon: FileText },
        { href: '/events', label: 'Events', icon: Images },
        { href: '/projects', label: 'Projects', icon: Code },
        { href: '/upcoming', label: 'Upcoming', icon: CalendarClock },
    ]

    return (
        <div className="fixed top-1/2 left-4 z-50 -translate-y-1/2">
            <nav className="bg-background/80 border-border/40 flex flex-col items-stretch gap-2 rounded-2xl border px-2 py-3 shadow-lg shadow-black/5 backdrop-blur-md">
                {navItems.map((item) => {
                    const fullPath = `${basePath}${item.href}`
                    const isActive =
                        pathname === fullPath ||
                        (item.href !== '/' &&
                            pathname.startsWith(fullPath + '/')) ||
                        (item.href === '/' && pathname === basePath)

                    const IconComponent = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={fullPath}
                            className={cn(
                                'relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                                'hover:scale-105 active:scale-95',
                                'flex items-center gap-3',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                            )}
                        >
                            <IconComponent className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}

                <SignedIn>
                    <div className="border-border/40 mt-2 flex items-center border-t pt-2">
                        <SignOutButton>
                            <button className="text-muted-foreground hover:text-foreground hover:bg-accent/60 flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95">
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </SignOutButton>
                    </div>
                </SignedIn>
            </nav>
        </div>
    )
}

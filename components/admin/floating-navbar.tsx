'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    CalendarClock,
    Code,
    FileText,
    Home,
    Images,
    Trophy,
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
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
            <nav className="bg-background/80 border-border/40 flex items-center gap-4 rounded-full border px-2 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md">
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
                                'relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                                'hover:scale-105 active:scale-95',
                                'flex items-center gap-2',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                            )}
                        >
                            <IconComponent className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
    name: string
    url: string
}

interface NavBarProps {
    items: NavItem[]
    className?: string
}

export function NavBarLg({ items, className }: NavBarProps) {
    const pathname = usePathname()
    const [hidden, setHidden] = useState(false)

    // Track scroll direction
    useEffect(() => {
        let lastScrollY = window.scrollY

        const updateScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setHidden(true) // scrolling down
            } else {
                setHidden(false) // scrolling up
            }
            lastScrollY = currentScrollY
        }

        window.addEventListener('scroll', updateScroll)
        return () => window.removeEventListener('scroll', updateScroll)
    }, [])

    const isPathActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname === href || pathname.startsWith(href + '/')
    }
    return (
        <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: hidden ? -100 : 0, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
            }}
            className={cn(
                'fixed top-4 left-1/2 z-50 -translate-x-1/2 sm:mt-2',
                className
            )}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="bg-background/5 border-border flex items-center gap-2 rounded-full border px-1 py-1 shadow-lg backdrop-blur-lg"
            >
                {items.map((item, i) => {
                    const isActive = isPathActive(item.url)

                    return (
                        <Link href={item.url} key={item.name}>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.2 + i * 0.1,
                                    duration: 0.4,
                                }}
                                className={cn(
                                    'relative cursor-pointer rounded-full px-5 py-1 text-lg font-semibold transition-colors',
                                    'text-foreground/80 hover:text-primary',
                                    isActive && 'bg-muted text-primary'
                                )}
                            >
                                <span className="inline">{item.name}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="lamp"
                                        className="bg-primary/5 absolute inset-0 -z-10 w-full rounded-full"
                                        initial={false}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -2, 0] }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 2,
                                            }}
                                            className="bg-primary absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full"
                                        >
                                            <div className="bg-primary/20 absolute -top-2 -left-2 h-6 w-12 rounded-full blur-md" />
                                            <div className="bg-primary/20 absolute -top-1 h-6 w-8 rounded-full blur-md" />
                                            <div className="bg-primary/20 absolute top-0 left-2 h-4 w-4 rounded-full blur-sm" />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </motion.div>
        </motion.div>
    )
}

export function NavBarMd({ items, className }: NavBarProps) {
    const pathname = usePathname()
    const [hidden, setHidden] = useState(false)

    // Track scroll direction
    useEffect(() => {
        let lastScrollY = window.scrollY

        const updateScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setHidden(true) // scrolling down
            } else {
                setHidden(false) // scrolling up
            }
            lastScrollY = currentScrollY
        }

        window.addEventListener('scroll', updateScroll)
        return () => window.removeEventListener('scroll', updateScroll)
    }, [])

    const isPathActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname === href || pathname.startsWith(href + '/')
    }

    const [isOpen, setIsOpen] = useState(false)

    const menuItems = [
        { name: 'Leaderboard', url: '/leaderboard' },
        { name: 'Projects', url: '/projects' },
        { name: 'Blogs', url: '/blogs' },
        { name: 'Digest', url: '/digest' },
    ]

    return (
        <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: hidden ? -100 : 0, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 25,
            }}
            className={cn(
                'fixed top-4 left-1/2 z-50 -translate-x-1/2 sm:mt-2',
                className
            )}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="bg-background/5 border-border flex items-center gap-2 rounded-full border px-1 py-1 shadow-lg backdrop-blur-lg"
            >
                {items.map((item, i) => {
                    const isActive = isPathActive(item.url)

                    return (
                        <Link href={item.url} key={item.name}>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.2 + i * 0.1,
                                    duration: 0.4,
                                }}
                                className={cn(
                                    'relative cursor-pointer rounded-full px-5 py-1 text-lg font-semibold transition-colors',
                                    'text-foreground/80 hover:text-primary',
                                    isActive && 'bg-muted text-primary'
                                )}
                            >
                                <span className="inline">{item.name}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="lamp"
                                        className="bg-primary/5 absolute inset-0 -z-10 w-full rounded-full"
                                        initial={false}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -2, 0] }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 2,
                                            }}
                                            className="bg-primary absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full"
                                        >
                                            <div className="bg-primary/20 absolute -top-2 -left-2 h-6 w-12 rounded-full blur-md" />
                                            <div className="bg-primary/20 absolute -top-1 h-6 w-8 rounded-full blur-md" />
                                            <div className="bg-primary/20 absolute top-0 left-2 h-4 w-4 rounded-full blur-sm" />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
                <div
                    className="relative inline-block"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {/* Trigger Button */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + 5 * 0.1, duration: 0.4 }}
                        className={cn(
                            'relative cursor-pointer rounded-full px-5 py-1 text-lg font-semibold transition-colors',
                            'text-foreground/80 hover:text-primary'
                        )}
                    >
                        d<span className="inline">Others</span>
                    </motion.div>

                    {/* Dropdown */}
                    {isOpen && (
                        <div className="absolute top-full left-1/2 w-40 -translate-x-1/2 pt-2">
                            <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-xl bg-black shadow-lg ring-1 ring-white/10"
                            >
                                {menuItems.map((item, i) => (
                                    <motion.li
                                        key={item.name}
                                        className="text-foreground/80 hover:text-primary cursor-pointer rounded-lg px-4 py-2 font-semibold"
                                    >
                                        <a href={item.url}>{item.name}</a>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

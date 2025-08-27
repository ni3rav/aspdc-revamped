'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/Image'
import { FiMenu, FiX } from 'react-icons/fi'

interface NavItem {
    name: string
    url: string
}

interface NavBarProps {
    items: NavItem[]
}

const MobileNavbar = ({ items }: NavBarProps) => {
    const navItems = items

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div>
            <>
                <div className="bg-background fixed top-0 right-0 left-0 z-[5001] flex items-center justify-between border-b border-white/10 p-2 px-4">
                    <Link href={'/'}>
                        <div className="flex items-center">
                            <Image
                                src="/aspdc.png"
                                alt="ASPDC Logo"
                                width={70}
                                height={70}
                            />
                        </div>
                    </Link>
                    <button
                        onClick={toggleMobileMenu}
                        className="rounded-full p-2"
                    >
                        {isMobileMenuOpen ? (
                            <FiX size={24} />
                        ) : (
                            <FiMenu size={24} />
                        )}
                    </button>
                </div>
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-[4999] bg-black/50 backdrop-blur-sm"
                        onClick={toggleMobileMenu}
                    />
                )}
                <div
                    className={cn(
                        'bg-background fixed top-0 right-0 z-[5000] flex h-full w-64 flex-col p-4 shadow-lg dark:bg-[#0f0f0f]',
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    )}
                >
                    <div className="mt-16 flex flex-col space-y-4">
                        {navItems.map((navItem: any, idx: number) => (
                            <Link
                                key={`mobile-link=${idx}`}
                                href={navItem.url}
                                className={cn(
                                    'relative flex items-center space-x-2 text-neutral-600 hover:text-green-400 dark:text-neutral-50 dark:hover:text-green-400'
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {navItem.icon && <span>{navItem.icon}</span>}
                                <span className="text-sm">{navItem.name}</span>
                            </Link>
                        ))}
                        <button
                            onClick={() =>
                                window.open(
                                    'https://72buefq3vo3.typeform.com/to/GfY7emQ2'
                                )
                            }
                            className="hover:animate-hover-pulse relative rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black dark:border-white/[0.2] dark:text-white"
                        >
                            Join Club
                            <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
                        </button>
                    </div>
                </div>
            </>
        </div>
    )
}

export default MobileNavbar

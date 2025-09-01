'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FiMenu, FiX, FiChevronRight } from 'react-icons/fi'

interface NavItem {
    name: string
    url: string
    icon?: React.ReactNode
}

interface NavBarProps {
    items: NavItem[]
}

const MobileNavbar = ({ items }: NavBarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div>
            {/* Top Bar */}
            <div className="fixed top-0 right-0 left-0 z-[5001] flex items-center justify-between border-b border-white/20 bg-black/20 p-2 px-4 shadow-2xl backdrop-blur-2xl">
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
                <button onClick={toggleMobileMenu} className="rounded-full p-2">
                    {isMobileMenuOpen ? (
                        <FiX size={28} />
                    ) : (
                        <FiMenu size={28} />
                    )}
                </button>
            </div>

            {/* Full-screen Overlay Menu */}
            <div
                className={cn(
                    'fixed inset-0 z-[5000] flex transform flex-col bg-black/70 backdrop-blur-xl transition-transform duration-500 ease-in-out',
                    isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
                )}
            >
                {/* Menu Links */}
                <div className="mt-24 flex flex-col divide-y divide-white/20 px-6">
                    {items.map((navItem, idx) => (
                        <Link
                            key={`mobile-link-${idx}`}
                            href={navItem.url}
                            className="flex items-center justify-between py-4 text-xl font-medium text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="flex items-center gap-2">
                                {navItem.icon && <span>{navItem.icon}</span>}
                                {navItem.name}
                            </span>
                            <FiChevronRight
                                className="text-primary"
                                size={22}
                            />
                        </Link>
                    ))}

                    {/* Contact Us CTA */}
                    {/* <div className="pt-6">
                        <Link
                            href={'/contact'}
                            className="block"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <NeonGradientCard
                                role="button"
                                className="mt-8 text-center text-lg font-semibold text-white"
                            >
                                Contact Us
                            </NeonGradientCard>
                        </Link>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default MobileNavbar

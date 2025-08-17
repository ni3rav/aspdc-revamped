'use client'
import React from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import './navbar.css'
import Link from 'next/link'

const Navbar = () => {
    useGSAP(() => {
        // ===================================
        // ENHANCED NAVBAR ANIMATION SYSTEM
        // ===================================

        // Set initial state for navbar with enhanced effects
        gsap.set('.navbar', {
            y: -150,
            opacity: 0,
            scale: 0.9,
            rotationX: -15,
        })

        // Enhanced navbar entrance animation
        gsap.to('.navbar', {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.3,
            force3D: true,
        })

        // Staggered nav items animation with enhanced effects
        gsap.set('.nav-item', {
            y: -30,
            opacity: 0,
            scale: 0.8,
        })

        gsap.to('.nav-item', {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.5)',
            stagger: 0.1,
            delay: 0.8,
            force3D: true,
        })

        // ===================================
        // ENHANCED BORDER & GLOW ANIMATIONS
        // ===================================

        // Initialize border and glow effects
        gsap.set(['.navbar-border-animation', '.navbar-glow'], {
            opacity: 0,
            scale: 1.2,
        })

        // Animate border and glow in with stagger
        gsap.to('.navbar-border-animation', {
            opacity: 0.8,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            delay: 1.5,
        })

        gsap.to('.navbar-glow', {
            opacity: 0.6,
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: 1.7,
        })

        // ===================================
        // ADVANCED INTERACTIVE EFFECTS
        // ===================================

        const navbar = document.querySelector('.navbar')
        const navLinks = document.querySelectorAll('.nav-link')
        const logoContainer = document.querySelector('.logo-container')
        const mobileBtn = document.querySelector('.mobile-menu-btn')

        // Enhanced navbar hover effects
        if (navbar) {
            navbar.addEventListener('mouseenter', () => {
                gsap.to('.navbar', {
                    scale: 1.02,
                    y: -2,
                    duration: 0.4,
                    ease: 'power2.out',
                })

                gsap.to('.navbar-border-animation', {
                    scale: 1.05,
                    opacity: 1,
                    duration: 0.3,
                })

                gsap.to('.navbar-glow', {
                    scale: 1.1,
                    opacity: 1,
                    duration: 0.4,
                })
            })

            navbar.addEventListener('mouseleave', () => {
                gsap.to('.navbar', {
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                })

                gsap.to('.navbar-border-animation', {
                    scale: 1,
                    opacity: 0.8,
                    duration: 0.4,
                })

                gsap.to('.navbar-glow', {
                    scale: 1,
                    opacity: 0.6,
                    duration: 0.5,
                })
            })
        }

        // Enhanced nav link hover effects
        navLinks.forEach((link) => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    scale: 1.05,
                    y: -3,
                    duration: 0.3,
                    ease: 'back.out(1.5)',
                })
            })

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    scale: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                })
            })
        })

        // Enhanced logo hover effects with image + text
        if (logoContainer) {
            logoContainer.addEventListener('mouseenter', () => {
                gsap.to(logoContainer, {
                    scale: 1.05,
                    y: -2,
                    duration: 0.4,
                    ease: 'back.out(1.5)',
                })

                // Animate logo image separately
                gsap.to(logoContainer.querySelector('img'), {
                    rotation: 6,
                    scale: 1.1,
                    duration: 0.4,
                    ease: 'back.out(1.5)',
                })
            })

            logoContainer.addEventListener('mouseleave', () => {
                gsap.to(logoContainer, {
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                })

                // Reset logo image
                gsap.to(logoContainer.querySelector('img'), {
                    rotation: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                })
            })
        }

        // Enhanced mobile button effects
        if (mobileBtn) {
            mobileBtn.addEventListener('mouseenter', () => {
                gsap.to(mobileBtn, {
                    scale: 1.15,
                    rotation: 90,
                    duration: 0.4,
                    ease: 'back.out(1.5)',
                })
            })

            mobileBtn.addEventListener('mouseleave', () => {
                gsap.to(mobileBtn, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                })
            })
        }
    })

    return (
        <nav className="navbar fixed top-6 right-0 left-0 z-50 mx-auto w-[68%] overflow-hidden rounded-3xl border border-white/20 bg-black/20 shadow-2xl backdrop-blur-2xl">
            {/* Enhanced Animated Green Border */}
            <div className="absolute inset-0 rounded-3xl">
                <div className="navbar-border-animation absolute inset-0 rounded-3xl"></div>
                <div className="navbar-glow absolute inset-0 rounded-3xl"></div>
            </div>

            {/* Content Container with thin profile */}
            <div className="relative z-10 px-6 py-2">
                <div className="flex items-center justify-between">
                    {/* Enhanced Logo with compact image and text animation */}
                    <div className="nav-item logo-container group flex cursor-pointer items-center gap-3">
                        <div className="relative">
                            <Image
                                src="/aspdc compact.png"
                                alt="ASPDC Logo"
                                width={32}
                                height={32}
                                className="transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                            />
                        </div>
                        <div className="relative">
                            <span className="text-xl font-bold text-white transition-all duration-500 group-hover:scale-105 group-hover:text-green-400">
                                <span className="text-green-500 transition-colors duration-500 group-hover:text-green-300">
                                    a
                                </span>
                                spdc
                            </span>
                        </div>
                    </div>

                    {/* Enhanced Navigation Links with better spacing */}
                    <div className="hidden items-center space-x-6 md:flex">
                        {[
                            'Home',
                            'Team',
                            'Events',
                            'Gallery',
                            'Projects',
                            'LeaderBoard',
                            'Blog',
                            'Contact',
                        ].map((item, index) => (
                            <Link
                                key={item}
                                href={`${item}`}
                                className="nav-item nav-link group relative rounded-full px-3 py-1.5 text-sm font-medium text-white/90 transition-all duration-500 hover:bg-white/10 hover:text-green-400"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <span className="relative z-10">{item}</span>
                                <div className="absolute inset-0 scale-75 rounded-full bg-gradient-to-r from-green-400/20 to-green-500/20 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"></div>
                                <span className="absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 transform bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 group-hover:w-3/4"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Enhanced Mobile Menu Button */}
                    <button className="nav-item mobile-menu-btn group rounded-full p-2 text-white/90 transition-all duration-500 hover:scale-110 hover:rotate-90 hover:bg-white/10 hover:text-green-400 md:hidden">
                        <div className="relative">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="transition-transform duration-500 group-hover:scale-110"
                            >
                                <path
                                    d="M3 12H21M3 6H21M3 18H21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-500"
                                />
                            </svg>
                            <div className="absolute inset-0 scale-0 rounded-full bg-gradient-to-r from-green-400/30 to-green-500/30 opacity-0 blur-sm transition-all duration-500 group-hover:scale-150 group-hover:opacity-100"></div>
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

'use client'
import React from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import SmoothScroll from '@/components/SmoothScroll'
import Navbar from '@/components/ui/Navbar'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function page() {
    useGSAP(() => {
        // Consolidated animation setup
        const initializeAnimations = () => {
            // Set initial states
            gsap.set('.mainLogo', {
                scale: 0,
                opacity: 0,
                rotationY: 180,
                transformOrigin: 'center center',
            })

            gsap.set('.word-animate', {
                y: 20,
                opacity: 0,
                rotationX: -30,
                transformOrigin: '50% 100%',
            })

            // Performance optimizations
            gsap.set(['.word-animate', '.mainLogo', '.navbar', '.nav-item'], {
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                perspective: 1000,
            })
        }

        // Create main timeline
        const createMainTimeline = () => {
            const tl = gsap.timeline()

            // Logo animation
            tl.to('.mainLogo', {
                scale: 1.2,
                opacity: 1,
                rotationY: 0,
                duration: 1.2,
                ease: 'power3.out',
                force3D: true,
            })
                .to('.mainLogo', {
                    scale: 1.25,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.4)',
                    force3D: true,
                })
                .to(
                    '.mainLogo',
                    {
                        rotationZ: 3,
                        duration: 0.4,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: 1,
                        force3D: true,
                    },
                    '-=0.3'
                )
                // Word animation - starts earlier with logo animation
                .to(
                    '.word-animate',
                    {
                        y: 0,
                        opacity: 1,
                        rotationX: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        stagger: {
                            amount: 0.8,
                            from: 'start',
                            ease: 'sine.out',
                        },
                        force3D: true,
                    },
                    '-=1.2'
                )
                .to(
                    '.word-animate',
                    {
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'sine.out',
                        stagger: { amount: 0.6, from: 'start' },
                        force3D: true,
                    },
                    '-=0.6'
                )
                .to(
                    '.word-animate',
                    {
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        stagger: { amount: 0.6, from: 'start' },
                        force3D: true,
                    },
                    '-=0.4'
                )

            return tl
        }

        // Optimized binary numbers system
        const initializeBinaryNumbers = () => {
            const main = document.querySelector('.main')
            const binaryContainer = document.querySelector(
                '.main > div:first-child'
            )
            if (!binaryContainer) return

            const binaryNumbers: Array<{
                element: HTMLElement
                centerX: number
                centerY: number
                isActive: boolean
            }> = []

            let rafId: number
            let lastMouseX = 0
            let lastMouseY = 0
            let isAnimating = false

            // Constants
            const PROXIMITY_RADIUS = 100
            const PROXIMITY_RADIUS_SQUARED = PROXIMITY_RADIUS * PROXIMITY_RADIUS
            const MAX_ACTIVE_ELEMENTS = 50
            const ROWS = 16
            const COLS = 80

            // Create binary numbers efficiently
            const createBinaryNumbers = () => {
                const fragment = document.createDocumentFragment()
                for (let i = 0; i < ROWS; i++) {
                    const container = document.createElement('div')
                    container.className =
                        'flex gap-2 w-full overflow-hidden my-4'
                    for (let j = 0; j < COLS; j++) {
                        const span = document.createElement('span')
                        span.textContent = Math.random() > 0.5 ? '1' : '0'
                        span.className =
                            'mx-2 scale-75 text-black z-10 binary-number'
                        container.appendChild(span)
                    }
                    fragment.appendChild(container)
                }
                binaryContainer.appendChild(fragment)
            }

            // Cache positions after DOM is ready
            const cacheBinaryPositions = () => {
                const elements = binaryContainer.querySelectorAll(
                    '.binary-number'
                ) as NodeListOf<HTMLElement>
                elements.forEach((element) => {
                    const rect = element.getBoundingClientRect()
                    binaryNumbers.push({
                        element,
                        centerX: rect.left + rect.width / 2 + window.scrollX,
                        centerY: rect.top + rect.height / 2 + window.scrollY,
                        isActive: false,
                    })
                })
            }

            // Optimized update function with batching
            const updateBinaryNumbers = () => {
                const toActivate: HTMLElement[] = []
                const toDeactivate: HTMLElement[] = []
                let activeCount = 0

                binaryNumbers.forEach((numberData) => {
                    const { element, centerX, centerY, isActive } = numberData

                    if (activeCount >= MAX_ACTIVE_ELEMENTS && !isActive) return

                    const deltaX = lastMouseX - centerX
                    const deltaY = lastMouseY - centerY
                    const distanceSquared = deltaX * deltaX + deltaY * deltaY

                    const shouldBeActive =
                        distanceSquared < PROXIMITY_RADIUS_SQUARED

                    if (shouldBeActive !== isActive) {
                        numberData.isActive = shouldBeActive
                        if (
                            shouldBeActive &&
                            activeCount < MAX_ACTIVE_ELEMENTS
                        ) {
                            toActivate.push(element)
                            activeCount++
                        } else if (!shouldBeActive) {
                            toDeactivate.push(element)
                        }
                    } else if (isActive) {
                        activeCount++
                    }
                })

                // Batch GSAP animations for performance
                if (toActivate.length) {
                    gsap.set(toActivate, {
                        color: 'rgba(28, 145, 72, 0.8)',
                        textShadow: '0 0 10px rgba(28, 145, 72, 0.8)',
                        scale: 1,
                        force3D: true,
                    })
                }

                if (toDeactivate.length) {
                    gsap.set(toDeactivate, {
                        color: '#000000',
                        textShadow: 'none',
                        scale: 0.75,
                        force3D: true,
                    })
                }
            }

            // Throttled mouse handler
            const handleMouseMove = (e: Event) => {
                const mouseEvent = e as MouseEvent
                lastMouseX = mouseEvent.clientX
                lastMouseY = mouseEvent.clientY

                if (isAnimating) return
                isAnimating = true
                rafId = requestAnimationFrame(() => {
                    updateBinaryNumbers()
                    isAnimating = false
                })
            }

            // Setup
            createBinaryNumbers()
            setTimeout(cacheBinaryPositions, 100)

            main?.addEventListener('mousemove', handleMouseMove, {
                passive: true,
            })

            // Cleanup function
            return () => {
                if (rafId) cancelAnimationFrame(rafId)
                main?.removeEventListener('mousemove', handleMouseMove)
            }
        }

        // Optimized ScrollTrigger animations
        const initializeScrollAnimations = () => {
            // Consolidated initial states
            const initStates = {
                aboutElements: [
                    '.about-title',
                    '.about-subtitle',
                    '.about-card',
                    '.activity-item',
                    '.about-bg-element',
                    '.cta-section',
                ],
                galleryElements: [
                    '.gallery-title',
                    '.gallery-subtitle',
                    '.gallery-item',
                    '.gallery-bg-element',
                    '.gallery-cta',
                ],
            }

            // Set initial states efficiently
            gsap.set(initStates.aboutElements, { opacity: 0 })
            gsap.set('.about-title', { y: 100, scale: 0.8 })
            gsap.set('.about-subtitle', { y: 80 })
            gsap.set('.about-card', { y: 120, scale: 0.9, rotationX: 15 })
            gsap.set('.activity-item', { x: -50 })
            gsap.set('.about-bg-element', { scale: 0, rotation: 0 })

            gsap.set(initStates.galleryElements, { opacity: 0 })
            gsap.set('.gallery-title', { y: 80, scale: 0.9 })
            gsap.set('.gallery-subtitle', { y: 60 })
            gsap.set('.gallery-item', { y: 100, scale: 0.95, rotationY: 15 })
            gsap.set('.gallery-bg-element', { scale: 0, rotation: 0 })
            gsap.set('.gallery-cta', { y: 40, scale: 0.9 })

            // Consolidated ScrollTrigger configurations
            const scrollTriggerConfigs = [
                {
                    trigger: '.secondPage',
                    start: 'top 90%',
                    end: 'top 20%',
                    scrub: 0.3,
                    animation: gsap
                        .timeline()
                        .to('.about-title', {
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            duration: 1,
                            ease: 'none',
                        })
                        .to(
                            '.about-subtitle',
                            { y: 0, opacity: 1, duration: 1, ease: 'none' },
                            0.2
                        )
                        .to(
                            '.about-bg-element',
                            {
                                scale: 1,
                                opacity: 1,
                                rotation: 180,
                                duration: 2,
                                ease: 'none',
                                stagger: 0.1,
                            },
                            0.3
                        ),
                },
                {
                    trigger: '.about-card',
                    start: 'top 95%',
                    end: 'top 30%',
                    scrub: 0.5,
                    animation: gsap.to('.about-card', {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        rotationX: 0,
                        duration: 1,
                        ease: 'none',
                        stagger: 0.1,
                    }),
                },
                {
                    trigger: '.activity-item',
                    start: 'top 95%',
                    end: 'top 40%',
                    scrub: 0.8,
                    animation: gsap.to('.activity-item', {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'none',
                        stagger: 0.05,
                    }),
                },
                {
                    trigger: '.transition-section',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    animation: gsap.fromTo(
                        '.scroll-text',
                        { x: '-50%' },
                        { x: '50%', ease: 'none' }
                    ),
                },
                {
                    trigger: '.about-title',
                    start: 'top 90%',
                    end: 'top 20%',
                    scrub: 0.8,
                    animation: gsap.fromTo(
                        '.about-title span',
                        { y: 30, opacity: 0, rotationX: 30 },
                        {
                            y: 0,
                            opacity: 1,
                            rotationX: 0,
                            duration: 1,
                            ease: 'none',
                            stagger: 0.05,
                        }
                    ),
                },
                {
                    trigger: '.galleryPage',
                    start: 'top 85%',
                    end: 'top 20%',
                    scrub: 0.3,
                    animation: gsap
                        .timeline()
                        .to('.gallery-bg-element', {
                            scale: 1,
                            opacity: 1,
                            rotation: 180,
                            duration: 2,
                            ease: 'none',
                            stagger: 0.2,
                        })
                        .to(
                            '.gallery-title',
                            {
                                y: 0,
                                opacity: 1,
                                scale: 1,
                                duration: 1,
                                ease: 'none',
                            },
                            0.5
                        )
                        .to(
                            '.gallery-subtitle',
                            { y: 0, opacity: 1, duration: 1, ease: 'none' },
                            0.7
                        ),
                },
                {
                    trigger: '.gallery-grid',
                    start: 'top 90%',
                    end: 'top 30%',
                    scrub: 0.5,
                    animation: gsap.to('.gallery-item', {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        rotationY: 0,
                        duration: 1,
                        ease: 'none',
                        stagger: { amount: 0.8, from: 'start' },
                    }),
                },
                {
                    trigger: '.gallery-cta',
                    start: 'top 95%',
                    end: 'top 70%',
                    scrub: 0.3,
                    animation: gsap.to('.gallery-cta', {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: 'none',
                    }),
                },
            ]

            // Create all ScrollTriggers efficiently
            scrollTriggerConfigs.forEach((config) =>
                ScrollTrigger.create(config)
            )
        }

        // Initialize gallery interaction system
        const initializeGalleryInteraction = () => {
            setTimeout(() => {
                const showcaseContainer =
                    document.getElementById('showcaseContainer')
                const mainImage = document.getElementById(
                    'mainImage'
                ) as HTMLImageElement
                const nextImage = document.getElementById(
                    'nextImage'
                ) as HTMLImageElement
                const nextImageSection =
                    document.getElementById('nextImageSection')
                const leftInfo = document.getElementById('leftInfo')
                const rightInfo = document.getElementById('rightInfo')

                if (
                    !showcaseContainer ||
                    !mainImage ||
                    !nextImage ||
                    !nextImageSection
                )
                    return

                const images = [
                    '/main1.jpg',
                    '/main2.jpg',
                    '/main3.jpg',
                    '/main4.jpg',
                ]
                let currentIndex = 0
                let nextIndex = 1
                let containerRect: DOMRect
                let isTransitioning = false

                const updateDimensions = () => {
                    containerRect = showcaseContainer.getBoundingClientRect()
                }

                const handleMouseMove = (e: MouseEvent) => {
                    if (isTransitioning) return
                    const x = e.clientX - containerRect.left
                    const revealPercent = Math.max(
                        0,
                        Math.min(100, (x / containerRect.width) * 100)
                    )

                    gsap.to(nextImageSection, {
                        duration: 0.3,
                        ease: 'power2.out',
                        onUpdate: () => {
                            if (nextImageSection) {
                                nextImageSection.style.clipPath = `polygon(${revealPercent}% 0%, 100% 0%, 100% 100%, ${revealPercent}% 100%)`
                            }
                        },
                    })

                    if (leftInfo)
                        gsap.set(leftInfo, {
                            opacity: revealPercent < 50 ? 1 : 0.3,
                        })
                    if (rightInfo)
                        gsap.set(rightInfo, {
                            opacity: revealPercent > 50 ? 1 : 0,
                        })
                }

                const handleMouseEnter = () => {
                    updateDimensions()
                    if (rightInfo) gsap.set(rightInfo, { opacity: 0 })
                }

                const handleMouseLeave = () => {
                    gsap.to(nextImageSection, {
                        duration: 0.4,
                        ease: 'power2.out',
                        onUpdate: () => {
                            if (nextImageSection) {
                                nextImageSection.style.clipPath =
                                    'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
                            }
                        },
                    })

                    gsap.to(rightInfo, { opacity: 0, duration: 0.3 })
                    if (leftInfo)
                        gsap.to(leftInfo, { opacity: 1, duration: 0.3 })
                }

                const handleClick = () => {
                    if (isTransitioning) return
                    isTransitioning = true

                    gsap.timeline()
                        .to(nextImageSection, {
                            duration: 0.5,
                            ease: 'power2.inOut',
                            onUpdate: () => {
                                if (nextImageSection) {
                                    nextImageSection.style.clipPath =
                                        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                                }
                            },
                        })
                        .call(
                            () => {
                                currentIndex = nextIndex
                                nextIndex = (nextIndex + 1) % images.length
                                mainImage.src = images[currentIndex]
                                nextImage.src = images[nextIndex]
                                if (nextImageSection)
                                    nextImageSection.style.clipPath =
                                        'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
                                if (rightInfo)
                                    gsap.set(rightInfo, { opacity: 0 })
                                if (leftInfo) gsap.set(leftInfo, { opacity: 1 })
                                isTransitioning = false
                            },
                            [],
                            0.5
                        )
                }

                // Setup event listeners
                showcaseContainer.addEventListener('mousemove', handleMouseMove)
                showcaseContainer.addEventListener(
                    'mouseenter',
                    handleMouseEnter
                )
                showcaseContainer.addEventListener(
                    'mouseleave',
                    handleMouseLeave
                )
                showcaseContainer.addEventListener('click', handleClick)
                window.addEventListener('resize', updateDimensions)

                // Initialize
                updateDimensions()
                mainImage.src = images[currentIndex]
                nextImage.src = images[nextIndex]
            }, 500)
        }

        // Initialize interactive elements
        const initializeInteractiveElements = () => {
            // Card hover animations
            document.querySelectorAll('.about-card').forEach((card) => {
                card.addEventListener('mouseenter', () =>
                    gsap.to(card, {
                        scale: 1.02,
                        y: -5,
                        duration: 0.3,
                        ease: 'power2.out',
                    })
                )
                card.addEventListener('mouseleave', () =>
                    gsap.to(card, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out',
                    })
                )
            })

            // Social links hover animations
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    document
                        .querySelectorAll('.social-link')
                        .forEach((link) => {
                            link.addEventListener('mouseenter', () => {
                                gsap.to(link, {
                                    scale: 1.15,
                                    rotation: 5,
                                    duration: 0.3,
                                    ease: 'power2.out',
                                })
                                const ping = link.querySelector('.animate-ping')
                                if (ping) {
                                    gsap.fromTo(
                                        ping,
                                        { scale: 0, opacity: 1 },
                                        {
                                            scale: 1.5,
                                            opacity: 0,
                                            duration: 0.6,
                                            ease: 'power2.out',
                                        }
                                    )
                                }
                            })
                            link.addEventListener('mouseleave', () => {
                                gsap.to(link, {
                                    scale: 1,
                                    rotation: 0,
                                    duration: 0.3,
                                    ease: 'power2.out',
                                })
                            })
                        })
                }, 100)
            })
        }

        // Initialize last page scroll animations
        const initializeLastPageAnimations = () => {
            // Social elements initial states
            gsap.set(
                [
                    '.social-title',
                    '.social-subtitle',
                    '.social-link',
                    '.social-particle',
                ],
                { opacity: 0 }
            )
            gsap.set('.scrollText span', { height: 0 })
            gsap.set('.social-title', { y: 30 })
            gsap.set('.social-subtitle', { y: 20 })
            gsap.set('.social-link', { y: 40, scale: 0.8 })
            gsap.set('.social-particle', { scale: 0 })

            // Last page timeline
            const lastPageTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.lastPage',
                    start: 'top top',
                    end: '150% top',
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            })

            lastPageTimeline
                .to('.scrollText span', {
                    height: 'auto',
                    duration: 1,
                    ease: 'power2.out',
                    stagger: 0.1,
                })
                .to('.scrollText span', {
                    color: 'transparent',
                    webkitTextStroke: '2px #075d27',
                    duration: 0.1,
                })
                .to('.scrollText span', {
                    backgroundSize: '100% 100%',
                    duration: 1,
                    stagger: 0.1,
                })

            // Social elements animation
            ScrollTrigger.create({
                trigger: '.lastPage',
                start: 'top 90%',
                animation: gsap
                    .timeline()
                    .to('.social-particle', {
                        scale: 1,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        stagger: 0.1,
                    })
                    .to(
                        '.social-title',
                        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
                        '-=0.4'
                    )
                    .to(
                        '.social-subtitle',
                        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
                        '-=0.3'
                    )
                    .to(
                        '.social-link',
                        {
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            duration: 0.5,
                            ease: 'back.out(1.7)',
                            stagger: 0.1,
                        },
                        '-=0.2'
                    ),
            })
        }

        // Initialize all systems
        initializeAnimations()
        const mainTimeline = createMainTimeline()
        const binaryCleanup = initializeBinaryNumbers()
        initializeScrollAnimations()
        initializeGalleryInteraction()
        initializeInteractiveElements()
        initializeLastPageAnimations()

        // Cleanup function
        return () => {
            if (binaryCleanup) binaryCleanup()
        }
    })

    return (
        <SmoothScroll>
            <Navbar />

            <div className="main main-option-2 relative h-screen w-full cursor-none overflow-hidden">
                {/* Binary numbers container - positioned to be below navbar */}
                <div className="pointer-events-none absolute inset-0 top-20 z-10">
                    {/* Binary numbers will be injected here by GSAP */}
                </div>

                <div className="absolute z-20 flex h-full w-full items-center justify-center">
                    <div className="flex max-w-4xl flex-col items-center px-8 text-center">
                        <Image
                            className="mainLogo mb-16 scale-125"
                            src="/logo-bgless.png"
                            alt="ASPDC"
                            width={300}
                            height={300}
                            priority={true}
                            quality={90}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli1b4AZzSFBBk3zNg=="
                        />

                        <div className="space-y-6 text-white">
                            <h1 className="text-4xl font-bold md:text-5xl">
                                <span className="word-animate inline-block">
                                    For
                                </span>{' '}
                                <span className="word-animate inline-block text-green-500">
                                    Students
                                </span>
                                ,{' '}
                                <span className="word-animate inline-block">
                                    By
                                </span>{' '}
                                <span className="word-animate inline-block text-green-500">
                                    Students
                                </span>
                            </h1>

                            <p className="max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
                                <span className="word-animate inline-block">
                                    Dive into the world of coding with
                                    <span className="inline-block font-semibold text-green-500">
                                        ASPDC
                                    </span>
                                    - Where every student rega rdless of
                                </span>{' '}
                                <span className="word-animate inline-block">
                                    experience, finds a safe space to learn,
                                    grow, and innovate. Join us in exploring
                                </span>{' '}
                                <span className="word-animate inline-block">
                                    web development, AI, competitive
                                    programming, and more!
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-10 z-20 w-full bg-transparent text-center text-xl">
                    <div className="flex flex-col items-center gap-2">
                        <div>
                            <span className="word-animate inline-block">
                                Scroll to Explore
                            </span>
                        </div>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6 9L12 15L18 9"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Simple Transition Section */}
            <div className="transition-section relative h-20 w-full overflow-hidden bg-black">
                {/* Simple ASPDC scrolling text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="scroll-text pointer-events-none text-4xl font-bold whitespace-nowrap text-green-500/20 select-none md:text-6xl lg:text-8xl">
                        ASPDC ASPDC ASPDC ASPDC ASPDC ASPDC ASPDC ASPDC ASPDC
                    </div>
                </div>
            </div>

            {/* Second Page - About ASPDC */}
            <div className="secondPage relative min-h-screen w-full overflow-x-hidden bg-black">
                {/* Enhanced Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Floating geometric shapes */}
                    <div className="about-bg-element absolute top-20 left-10 h-24 w-24 animate-pulse rounded-full border border-green-500/20"></div>
                    <div className="about-bg-element absolute right-20 bottom-20 h-20 w-20 rotate-45 rounded-lg border border-green-400/15"></div>
                    <div className="about-bg-element absolute top-1/2 left-1/4 h-16 w-16 rounded-full bg-green-500/5"></div>
                    <div className="about-bg-element absolute right-1/3 bottom-1/3 h-18 w-18 rounded-full border border-green-300/10"></div>

                    {/* Grid pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.3) 1px, transparent 0)',
                            backgroundSize: '50px 50px',
                        }}
                    ></div>

                    {/* Subtle gradient orbs */}
                    <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-green-500/5 blur-3xl"></div>
                    <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-green-400/3 blur-3xl"></div>

                    {/* Optimized binary code rain effect */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden font-mono text-sm text-green-500/40 opacity-20">
                        <div className="absolute top-0 left-0 flex h-full w-full justify-between px-4">
                            {[
                                [
                                    '01001000',
                                    '01100101',
                                    '01101100',
                                    '01101100',
                                    '01101111',
                                ],
                                [
                                    '01010111',
                                    '01100101',
                                    '01100010',
                                    '01000100',
                                    '01100101',
                                ],
                                [
                                    '01000001',
                                    '01010011',
                                    '01010000',
                                    '01000100',
                                    '01000011',
                                ],
                                [
                                    '01001001',
                                    '01101110',
                                    '01101110',
                                    '01101111',
                                    '01110110',
                                ],
                                [
                                    '01010100',
                                    '01100101',
                                    '01100011',
                                    '01101000',
                                    '01001100',
                                ],
                            ].map((column, index) => (
                                <div
                                    key={index}
                                    className={`flex animate-pulse flex-col space-y-4 delay-${index * 100}`}
                                >
                                    {column.map((binary, bIndex) => (
                                        <span
                                            key={bIndex}
                                            className="drop-shadow-sm"
                                        >
                                            {binary}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                    {/* Main Heading */}
                    <div className="mb-12 text-center lg:mb-16">
                        <h1 className="about-title mb-4 text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                            <span className="text-green-500">What's</span>{' '}
                            <span className="text-white">ASPDC</span>{' '}
                            <span className="text-green-400">All</span>{' '}
                            <span className="text-white">About</span>
                        </h1>
                        <div className="about-subtitle mx-auto max-w-4xl px-4 text-lg leading-relaxed text-gray-300 sm:text-xl lg:text-2xl">
                            ASPDC is a squad of tech-loving students who geek
                            out over code and love to share the knowledge. No
                            gatekeeping here - just good vibes and great
                            learning.
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Our Vibe Section */}
                        <div className="about-card rounded-2xl border border-green-500/30 bg-gray-900/60 p-6 shadow-lg shadow-green-500/10 backdrop-blur-xl transition-all duration-500 hover:border-green-400/50 hover:bg-gray-900/80 lg:rounded-3xl lg:p-8">
                            <div className="mb-4 flex items-center lg:mb-6">
                                <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-400 shadow-lg shadow-green-500/25 lg:mr-4 lg:h-12 lg:w-12">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="lg:h-6 lg:w-6"
                                    >
                                        <path
                                            d="M19 14C19 18.4183 15.4183 22 11 22C6.58172 22 3 18.4183 3 14C3 9.58172 6.58172 6 11 6C15.4183 6 19 9.58172 19 14Z"
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d="M9 11L12 14L22 4"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-green-400 lg:text-3xl">
                                    Our Vibe
                                </h2>
                            </div>
                            <p className="text-base leading-relaxed text-gray-200 lg:text-lg">
                                We're all about creating a chill space where you
                                can level up your coding skills, whether you're
                                a total newbie or already dreaming in Python.
                                It's like a 24/7 hackathon, minus the stress and
                                energy drinks.
                            </p>
                        </div>

                        {/* What We've Got Going On Section */}
                        <div className="about-card rounded-2xl border border-green-500/30 bg-gray-900/60 p-6 shadow-lg shadow-green-500/10 backdrop-blur-xl transition-all duration-500 hover:border-green-400/50 hover:bg-gray-900/80 lg:rounded-3xl lg:p-8">
                            <div className="mb-4 flex items-center lg:mb-6">
                                <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-400 shadow-lg shadow-green-500/25 lg:mr-4 lg:h-12 lg:w-12">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="lg:h-6 lg:w-6"
                                    >
                                        <path
                                            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-green-400 lg:text-3xl">
                                    What We've Got Going On
                                </h2>
                            </div>
                            <ul className="space-y-3 text-gray-200 lg:space-y-4">
                                <li className="activity-item flex items-start">
                                    <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                                    <span className="text-base leading-relaxed lg:text-lg">
                                        Lit workshops on everything from
                                        building killer websites to training AIs
                                    </span>
                                </li>
                                <li className="activity-item flex items-start">
                                    <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                                    <span className="text-base leading-relaxed lg:text-lg">
                                        Coding hangouts where we tackle projects
                                        together
                                    </span>
                                </li>
                                <li className="activity-item flex items-start">
                                    <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                                    <span className="text-base leading-relaxed lg:text-lg">
                                        Chances to flex your skills in coding
                                        competitions
                                    </span>
                                </li>
                                <li className="activity-item flex items-start">
                                    <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                                    <span className="text-base leading-relaxed lg:text-lg">
                                        Networking opps with tech industry pros
                                        (aka future bosses)
                                    </span>
                                </li>
                                <li className="activity-item flex items-start">
                                    <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                                    <span className="text-base leading-relaxed lg:text-lg">
                                        A judgment-free zone to try, fail, and
                                        crush it
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Third Page - Epic Moments Gallery */}
            <div className="galleryPage relative min-h-screen w-full overflow-hidden bg-black">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Animated gradient mesh */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="gallery-bg-element absolute top-10 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-green-500/20 to-transparent blur-xl"></div>
                        <div className="gallery-bg-element absolute right-10 bottom-10 h-40 w-40 rounded-full bg-gradient-to-bl from-green-400/15 to-transparent blur-xl"></div>
                        <div className="gallery-bg-element absolute top-1/2 left-1/3 h-24 w-24 rounded-full bg-gradient-to-r from-green-500/10 to-transparent blur-lg"></div>
                    </div>
                </div>

                <div className="relative z-10 container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                    {/* Gallery Header */}
                    <div className="mb-12 text-center lg:mb-16">
                        <h1 className="gallery-title mb-4 text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                            <span className="text-green-500">Epic</span>{' '}
                            <span className="text-white">Moments</span>{' '}
                            <span className="text-green-400">&</span>{' '}
                            <span className="text-white">Memories</span>
                        </h1>
                        <div className="gallery-subtitle mx-auto max-w-4xl px-4 text-lg leading-relaxed text-gray-300 sm:text-xl lg:text-2xl">
                            Capturing the journey, celebrating the wins, and
                            sharing the code-fueled adventures that make ASPDC
                            legendary.
                        </div>
                    </div>

                    {/* Interactive Photo Gallery */}
                    <div className="gallery-container mx-auto max-w-6xl">
                        {/* Creative Split-Screen Showcase */}
                        <div className="main-showcase relative mb-12 lg:mb-16">
                            <div
                                className="showcase-container relative h-[60vh] w-full cursor-pointer overflow-hidden rounded-3xl border border-green-500/30 bg-gray-900/40 backdrop-blur-sm lg:h-[70vh]"
                                id="showcaseContainer"
                            >
                                {/* Current Image (Left Side) */}
                                <div
                                    id="currentImageSection"
                                    className="absolute inset-0 overflow-hidden"
                                >
                                    <img
                                        id="mainImage"
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop&crop=faces"
                                        alt="Current ASPDC Moment"
                                        className="h-full w-full object-cover transition-all duration-700 ease-out"
                                    />

                                    {/* Current Image Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                                </div>

                                {/* Next Image (Right Side - Revealed on Hover) */}
                                <div
                                    id="nextImageSection"
                                    className="absolute inset-0 overflow-hidden transition-all duration-500 ease-out"
                                    style={{
                                        clipPath:
                                            'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
                                    }}
                                >
                                    <img
                                        id="nextImage"
                                        src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&h=800&fit=crop&crop=center"
                                        alt="Next ASPDC Moment"
                                        className="h-full w-full object-cover"
                                    />

                                    {/* Next Image Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10"></div>
                                </div>

                                {/* Interactive Overlay */}
                                <div className="absolute inset-0 z-20">
                                    {/* Left Info */}
                                    <div
                                        className="absolute bottom-6 left-6 text-white transition-all duration-300"
                                        id="leftInfo"
                                    >
                                        <p className="mb-1 text-xs tracking-wide uppercase opacity-60">
                                            Current
                                        </p>
                                        <h4 className="text-lg font-bold">
                                            ASPDC Moments
                                        </h4>
                                    </div>

                                    {/* Right Info */}
                                    <div
                                        className="absolute right-6 bottom-6 text-white opacity-0 transition-all duration-300"
                                        id="rightInfo"
                                    >
                                        <p className="mb-1 text-xs tracking-wide uppercase opacity-60">
                                            Next
                                        </p>
                                        <h4 className="text-lg font-bold">
                                            Coming Up
                                        </h4>
                                    </div>
                                </div>

                                {/* Instruction Text */}
                                <div className="absolute top-6 left-1/2 z-30 -translate-x-1/2 transform text-sm text-white/60">
                                    <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 backdrop-blur-sm">
                                        Move cursor left/right to reveal • Click
                                        to switch
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-12 text-center lg:mt-16">
                        <div className="gallery-cta inline-flex items-center rounded-2xl border border-green-500/30 bg-gray-900/60 px-8 py-4 backdrop-blur-sm transition-all duration-300 hover:border-green-400/50 hover:bg-gray-900/80">
                            <span className="mr-2 font-semibold text-green-400">
                                Want to be part of these epic moments?
                            </span>
                            <svg
                                className="h-5 w-5 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lastPage relative h-screen w-full overflow-hidden bg-black">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Animated grid pattern */}
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.4) 2px, transparent 0)',
                            backgroundSize: '100px 100px',
                        }}
                    ></div>

                    {/* Floating particles */}
                    <div className="absolute inset-0">
                        <div className="social-particle absolute top-1/4 left-1/4 h-3 w-3 animate-pulse rounded-full bg-green-500/20"></div>
                        <div className="social-particle absolute top-3/4 right-1/4 h-2 w-2 animate-pulse rounded-full bg-green-400/30 delay-100"></div>
                        <div className="social-particle absolute bottom-1/3 left-1/2 h-4 w-4 animate-pulse rounded-full bg-green-500/15 delay-200"></div>
                        <div className="social-particle absolute top-1/2 right-1/3 h-3 w-3 animate-pulse rounded-full bg-green-400/25 delay-300"></div>
                    </div>

                    {/* Gradient orbs */}
                    <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-green-500/10 blur-3xl"></div>
                    <div className="absolute right-1/4 bottom-1/3 h-80 w-80 animate-pulse rounded-full bg-green-400/8 blur-3xl delay-1000"></div>
                </div>

                {/* Main ASPDC Text */}
                <div className="scrollText relative z-10 flex h-[80%] w-full items-center justify-center text-[20vw] font-extrabold">
                    <span className="inline-block overflow-hidden"> A</span>
                    <span className="inline-block overflow-hidden"> S</span>
                    <span className="inline-block overflow-hidden"> P</span>
                    <span className="inline-block overflow-hidden"> D</span>
                    <span className="inline-block overflow-hidden"> C</span>
                </div>

                {/* Social Links Container */}
                <div className="absolute right-0 bottom-0 left-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-8">
                    <div className="mx-auto max-w-4xl">
                        {/* Connect with us text */}
                        <div className="mb-8 text-center">
                            <h3 className="social-title mb-2 text-2xl font-bold text-white md:text-3xl">
                                Connect with{' '}
                                <span className="text-green-500">ASPDC</span>
                            </h3>
                            <p className="social-subtitle text-sm text-gray-400 md:text-base">
                                Join our community across all platforms
                            </p>
                        </div>

                        {/* Social Links Grid */}
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                            {/* WhatsApp */}
                            <a
                                href="#"
                                className="social-link group relative rounded-2xl border border-green-500/30 bg-gray-900/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:border-green-400/60 hover:bg-gray-900/80"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-green-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <svg
                                    className="relative z-10 h-8 w-8 text-green-500 transition-colors duration-300 group-hover:text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.687" />
                                </svg>
                                <div className="absolute -top-2 -right-2 h-4 w-4 animate-ping rounded-full bg-green-500 opacity-0 group-hover:opacity-100"></div>
                            </a>

                            {/* Instagram */}
                            <a
                                href="#"
                                className="social-link group relative rounded-2xl border border-green-500/30 bg-gray-900/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:border-green-400/60 hover:bg-gray-900/80"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <svg
                                    className="relative z-10 h-8 w-8 text-green-500 transition-colors duration-300 group-hover:text-pink-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <div className="absolute -top-2 -right-2 h-4 w-4 animate-ping rounded-full bg-pink-500 opacity-0 group-hover:opacity-100"></div>
                            </a>

                            {/* X (Twitter) */}
                            <a
                                href="#"
                                className="social-link group relative rounded-2xl border border-green-500/30 bg-gray-900/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:border-green-400/60 hover:bg-gray-900/80"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <svg
                                    className="relative z-10 h-8 w-8 text-green-500 transition-colors duration-300 group-hover:text-blue-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <div className="absolute -top-2 -right-2 h-4 w-4 animate-ping rounded-full bg-blue-500 opacity-0 group-hover:opacity-100"></div>
                            </a>

                            {/* Discord */}
                            <a
                                href="#"
                                className="social-link group relative rounded-2xl border border-green-500/30 bg-gray-900/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:border-green-400/60 hover:bg-gray-900/80"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <svg
                                    className="relative z-10 h-8 w-8 text-green-500 transition-colors duration-300 group-hover:text-indigo-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                                </svg>
                                <div className="absolute -top-2 -right-2 h-4 w-4 animate-ping rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100"></div>
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="#"
                                className="social-link group relative rounded-2xl border border-green-500/30 bg-gray-900/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:border-green-400/60 hover:bg-gray-900/80"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <svg
                                    className="relative z-10 h-8 w-8 text-green-500 transition-colors duration-300 group-hover:text-blue-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                <div className="absolute -top-2 -right-2 h-4 w-4 animate-ping rounded-full bg-blue-500 opacity-0 group-hover:opacity-100"></div>
                            </a>

                            {/* YouTube */}
                            <a
                                href="#"
                                className="social-link group relative rounded-2xl border border-green-500/30 bg-gray-900/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:border-green-400/60 hover:bg-gray-900/80"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <svg
                                    className="relative z-10 h-8 w-8 text-green-500 transition-colors duration-300 group-hover:text-red-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <div className="absolute -top-2 -right-2 h-4 w-4 animate-ping rounded-full bg-red-500 opacity-0 group-hover:opacity-100"></div>
                            </a>
                        </div>

                        {/* Additional decorative elements */}
                        <div className="mt-6 flex justify-center">
                            <div className="h-px w-32 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </SmoothScroll>
    )
}

export default page

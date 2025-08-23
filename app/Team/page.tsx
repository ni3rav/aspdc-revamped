'use client'
import React, { useState, useEffect } from 'react'
import Navbar from "@/components/ui/Navbar";
import Image from 'next/image'
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import '@/styles/team.css';

gsap.registerPlugin(TextPlugin);

const TeamPage = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState('');
    const [index, setIndex] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    
    const images = [
        { src: '/teams/Harshil-removebg-preview.png', name: "Harshil Upadhyay", role: "Web Dev Head" }, 
        { src: '/teams/Deep_Adatiya-removebg-preview.png', name: "Deep Adatiya", role: "Public Relation Head" }, 
        { src: '/teams/Nirav_Maheta-removebg-preview.png', name: "Nirav Maheta", role: "President" }, 
        { src: '/teams/Pratham_Patel-removebg-preview.png', name: "Pratham Patel", role: "Social Media Head" }, 
        { src: '/teams/Sahil_Patel-removebg-preview.png', name: "Sahil Patel", role: "Vice President" }, 
        { src: '/teams/Ved_Parmar-removebg-preview.png', name: "Ved Parmar", role: "Design Head" }, 
        { src: '/teams/Vrajesh_Sharma-removebg-preview.png', name: "Vrajesh Sharma", role: "Machine Learning Head" }, 
        { src: '/teams/Yaksh_Vadaliya-removebg-preview.png', name: "Yaksh Vadaliya", role: "Design Head"}
    ];

    // Intro Animation
    useEffect(() => {
        if (!isInitialized) {
            // Split initial text into letters
            setTimeout(() => {
                splitText('.person-name');
                splitText('.person-role');
                splitText('.explore-title');
                splitText('.team-category');
            }, 100);

            const introTl = gsap.timeline({
                onComplete: () => setIsInitialized(true)
            });

            // Set initial states for spectacular entrance
            gsap.set('.team-main', {
                background: 'linear-gradient(to bottom, rgba(8, 101, 76, 0) 0%, rgba(0, 0, 0, 1) 100%)'
            });

            gsap.set(['.person-name .letter'], {
                y: 150,
                opacity: 0,
                skewY: 45,
                rotation: 45,
                scale: 0.5
            });

            gsap.set(['.person-role .letter'], {
                y: 100,
                opacity: 0,
                skewY: 30,
                rotation: 30,
                scale: 0.7
            });

            gsap.set(['.explore-title .letter'], {
                y: 150,
                opacity: 0,
                skewY: -45,
                rotation: -45,
                scale: 0.5
            });

            gsap.set(['.team-category .letter'], {
                y: 100,
                opacity: 0,
                skewY: -30,
                rotation: -30,
                scale: 0.7
            });

            gsap.set(['.person-index', '.scroll-hint', '.stat-item'], {
                y: 80,
                opacity: 0,
                skewY: 20,
                scale: 0.8
            });

            gsap.set('.mainImage', {
                scale: 0.3,
                opacity: 0,
                rotation: 45,
                y: 200,
                filter: 'blur(20px)'
            });

            gsap.set(['.nav-button'], {
                scale: 0,
                opacity: 0,
                rotation: 180
            });

            // Spectacular intro animation sequence
            introTl
                // Background fade in
                .to('.team-main', {
                    background: 'linear-gradient(to bottom, rgba(8, 101, 76, 0.495) 0%, rgba(0, 0, 0, 1) 100%)',
                    duration: 1.5,
                    ease: "power2.out"
                })
                // Image dramatic entrance
                .to('.mainImage', {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1.8,
                    ease: "back.out(1.7)"
                }, "-=0.8")
                // Person name letters cascade
                .to('.person-name .letter', {
                    y: 0,
                    opacity: 1,
                    skewY: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(2.5)",
                    stagger: 0.05
                }, "-=1.2")
                // Person role letters follow
                .to('.person-role .letter', {
                    y: 0,
                    opacity: 1,
                    skewY: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(2.0)",
                    stagger: 0.03
                }, "-=0.6")
                // Right side title letters
                .to('.explore-title .letter', {
                    y: 0,
                    opacity: 1,
                    skewY: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(2.5)",
                    stagger: 0.05
                }, "-=1.0")
                // Right side category letters
                .to('.team-category .letter', {
                    y: 0,
                    opacity: 1,
                    skewY: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(2.0)",
                    stagger: 0.03
                }, "-=0.6")
                // Other elements smooth entrance
                .to(['.person-index', '.scroll-hint', '.stat-item'], {
                    y: 0,
                    opacity: 1,
                    skewY: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "back.out(1.7)",
                    stagger: 0.1
                }, "-=0.4")
                // Navigation buttons spin in
                .to(['.nav-button'], {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: "back.out(2.0)",
                    stagger: 0.15
                }, "-=0.3");
        }
    }, [isInitialized]);

    // Text transition animations with letter-by-letter effects
    const splitText = (selector: string) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            const text = element.textContent || '';
            element.innerHTML = text.split('').map((char, index) => 
                char === ' ' ? ' ' : `<span class="letter" style="display: inline-block">${char}</span>`
            ).join('');
        });
    };

    const animateTextOut = (direction: 'next' | 'prev') => {
        const tl = gsap.timeline();
        const skewDirection = direction === 'next' ? -25 : 25;
        
        // Animate letters out with stagger
        tl.to('.person-name .letter', {
            y: -60,
            opacity: 0,
            skewY: skewDirection,
            rotation: skewDirection * 0.5,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.02
        })
        .to('.person-role .letter', {
            y: -40,
            opacity: 0,
            skewY: skewDirection,
            rotation: skewDirection * 0.3,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.015
        }, "-=0.3")
        .to('.explore-title .letter', {
            y: -60,
            opacity: 0,
            skewY: -skewDirection,
            rotation: -skewDirection * 0.5,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.02
        }, "-=0.6")
        .to('.team-category .letter', {
            y: -40,
            opacity: 0,
            skewY: -skewDirection,
            rotation: -skewDirection * 0.3,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.015
        }, "-=0.3")
        .to(['.person-index', '.scroll-hint', '.stat-item'], {
            y: -30,
            opacity: 0,
            skewY: skewDirection * 0.5,
            duration: 0.3,
            ease: "power2.in",
            stagger: 0.05
        }, "-=0.4");
        
        return tl;
    };

    const animateTextIn = (direction: 'next' | 'prev') => {
        const tl = gsap.timeline();
        const skewDirection = direction === 'next' ? 25 : -25;
        
        // Split text into letters for new content
        setTimeout(() => {
            splitText('.person-name');
            splitText('.person-role');
            splitText('.explore-title');
            splitText('.team-category');
        }, 50);
        
        // Set initial positions for letters
        tl.set('.person-name .letter', {
            y: 60,
            opacity: 0,
            skewY: skewDirection,
            rotation: skewDirection * 0.5
        })
        .set('.person-role .letter', {
            y: 40,
            opacity: 0,
            skewY: skewDirection,
            rotation: skewDirection * 0.3
        })
        .set('.explore-title .letter', {
            y: 60,
            opacity: 0,
            skewY: -skewDirection,
            rotation: -skewDirection * 0.5
        })
        .set('.team-category .letter', {
            y: 40,
            opacity: 0,
            skewY: -skewDirection,
            rotation: -skewDirection * 0.3
        })
        .set(['.person-index', '.scroll-hint', '.stat-item'], {
            y: 30,
            opacity: 0,
            skewY: skewDirection * 0.5
        });
        
        // Animate letters in with elastic effect
        tl.to('.person-name .letter', {
            y: 0,
            opacity: 1,
            skewY: 0,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.03
        }, "+=0.1")
        .to('.person-role .letter', {
            y: 0,
            opacity: 1,
            skewY: 0,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(1.4)",
            stagger: 0.02
        }, "-=0.4")
        .to('.explore-title .letter', {
            y: 0,
            opacity: 1,
            skewY: 0,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.03
        }, "-=0.8")
        .to('.team-category .letter', {
            y: 0,
            opacity: 1,
            skewY: 0,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(1.4)",
            stagger: 0.02
        }, "-=0.4")
        .to(['.person-index', '.scroll-hint', '.stat-item'], {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 0.5,
            ease: "back.out(1.2)",
            stagger: 0.05
        }, "-=0.3");
        
        return tl;
    };

    const handleNext = () => {
        if (isAnimating || !isInitialized) return;
        setIsAnimating(true);
        setDirection('next');
        
        const masterTl = gsap.timeline({
            onComplete: () => {
                setIsAnimating(false);
                setDirection('');
            }
        });

        // Amazing exit animations
        const textOutTl = animateTextOut('next');
        
        // Image spectacular exit
        const imageOutTl = gsap.timeline();
        imageOutTl.to('.mainImage', {
            x: 150,
            opacity: 0,
            rotation: 25,
            scale: 0.7,
            filter: 'blur(10px)',
            duration: 0.6,
            ease: "power4.in"
        });

        // Combine exit animations
        masterTl.add(textOutTl, 0)
                .add(imageOutTl, 0.1)
                .call(() => {
                    setIndex(prevIndex => prevIndex === 7 ? 0 : prevIndex + 1);
                })
                // Image spectacular entrance
                .set('.mainImage', {
                    x: -150,
                    rotation: -25,
                    scale: 1.3,
                    filter: 'blur(15px)'
                })
                .to('.mainImage', {
                    x: 0,
                    opacity: 1,
                    rotation: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: "back.out(1.7)"
                })
                .add(animateTextIn('next'), "-=0.5");
    };

    const handlePrev = () => {
        if (isAnimating || !isInitialized) return;
        setIsAnimating(true);
        setDirection('prev');
        
        const masterTl = gsap.timeline({
            onComplete: () => {
                setIsAnimating(false);
                setDirection('');
            }
        });

        // Amazing exit animations  
        const textOutTl = animateTextOut('prev');
        
        // Image spectacular exit
        const imageOutTl = gsap.timeline();
        imageOutTl.to('.mainImage', {
            x: -150,
            opacity: 0,
            rotation: -25,
            scale: 0.7,
            filter: 'blur(10px)',
            duration: 0.6,
            ease: "power4.in"
        });

        // Combine exit animations
        masterTl.add(textOutTl, 0)
                .add(imageOutTl, 0.1)
                .call(() => {
                    setIndex(prevIndex => prevIndex === 0 ? 7 : prevIndex - 1);
                })
                // Image spectacular entrance
                .set('.mainImage', {
                    x: 150,
                    rotation: 25,
                    scale: 1.3,
                    filter: 'blur(15px)'
                })
                .to('.mainImage', {
                    x: 0,
                    opacity: 1,
                    rotation: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: "back.out(1.7)"
                })
                .add(animateTextIn('prev'), "-=0.5");
    };

    return (
        <>
            <Navbar />

            <main className="team-main min-h-screen w-full relative overflow-hidden">
                <div className='absolute h-full w-full overflow-hidden'>
                    {/* Previous Button - Left Side */}
                    <button
                        onClick={handlePrev}
                        disabled={isAnimating || !isInitialized}
                        className={`nav-button nav-button-prev ${isAnimating && direction === 'prev' ? 'active' : ''}`}
                        aria-label="Previous team member"
                    >
                        <div className="button-bg"></div>
                        <div className="button-border"></div>
                        <div className="button-glow"></div>

                        {/* Arrow Icon */}
                        <div className="arrow-container">
                            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* Ripple Effect */}
                        <div className="ripple-effect"></div>

                        {/* Hover Text */}
                        <span className="hover-text">PREV</span>
                    </button>

                    <div className='flex justify-between items-center mainImageChanger absolute h-full w-full px-32'>
                        {/* Left Side - Person Details */}
                        <div className='person-details flex flex-col justify-center h-full'>
                            <div className="person-info">
                                <h1 className='person-name'>{images[index].name}</h1>
                                <h2 className='person-role'>{images[index].role}</h2>
                                <div className="person-index">
                                    <span className="current-index">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="divider">/</span>
                                    <span className="total-index">{String(images.length).padStart(2, '0')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Center - Image */}
                        <div className="flex justify-center items-end h-full">
                            <Image
                                src={images[index].src}
                                alt={`Team Member - ${images[index].name}`}
                                width={400}
                                height={600}
                                className="object-contain object-bottom max-h-full origin-bottom mainImage"
                                priority={index === 0}
                            />
                        </div>

                        {/* Right Side - Additional Info */}
                        <div className='team-info flex flex-col justify-center h-full text-right'>
                            <div className="explore-info">
                                <h1 className='explore-title'>Explore Team</h1>
                                <h2 className='team-category'>{images[index].role}</h2>
                                <p className='scroll-hint'>Navigate to explore more</p>
                                <div className="team-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">08</span>
                                        <span className="stat-label">Members</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Button - Right Side */}
                    <button
                        onClick={handleNext}
                        disabled={isAnimating || !isInitialized}
                        className={`nav-button nav-button-next ${isAnimating && direction === 'next' ? 'active' : ''}`}
                        aria-label="Next team member"
                    >
                        <div className="button-bg"></div>
                        <div className="button-border"></div>
                        <div className="button-glow"></div>

                        {/* Arrow Icon */}
                        <div className="arrow-container">
                            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* Ripple Effect */}
                        <div className="ripple-effect"></div>

                        {/* Hover Text */}
                        <span className="hover-text">NEXT</span>
                    </button>
                </div>
            </main>
        </>
    )
}

export default TeamPage
'use client';
import React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from 'next/image'
import SmoothScroll from "@/components/SmoothScroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

function page() {
  useGSAP(() => {
    // Set initial states IMMEDIATELY to prevent any flash
    gsap.set('.animateText', { 
      y: 100, 
      opacity: 0 
    });
    
    gsap.set('.height-0', { 
      height: 0,
      overflow: 'hidden',
      opacity: 0
    });

    const main = document.querySelector(".main");
    const binaryNumbers: { element: HTMLElement; rect: DOMRect; isActive: boolean }[] = [];
    let rafId: number;
    let lastMouseX = 0;
    let lastMouseY = 0;
    const proximityRadius = 100;
    const proximityRadiusSquared = proximityRadius * proximityRadius;

    // Optimized: Reduce binary numbers for better performance (20x100 = 2000 elements is quite heavy)
    const ROWS = 15; // Reduced from 20
    const COLS = 80; // Reduced from 100

    // Create binary numbers and cache their positions - Optimized with DocumentFragment
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < ROWS; i++) {
      const container = document.createElement("div");
      container.className = "flex gap-2 w-full overflow-hidden my-4";
      for (let j = 0; j < COLS; j++) {
        const span = document.createElement("span");
        span.textContent = Math.round(Math.random()).toString();
        span.className = "mx-2 scale-75 text-black z-10 binary-number";
        container.appendChild(span);
      }
      fragment.appendChild(container);
    }
    main?.appendChild(fragment);

    const tl1 = gsap.timeline();

    tl1.to('.animateText' , {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      stagger: 0.5
    })

    // Cache positions after DOM is ready - Optimized structure
    setTimeout(() => {
      const elements = main?.querySelectorAll('.binary-number') as NodeListOf<HTMLElement>;
      elements?.forEach((element) => {
        const rect = element.getBoundingClientRect();
        binaryNumbers.push({
          element,
          rect: {
            ...rect,
            centerX: rect.left + rect.width / 2 + window.scrollX,
            centerY: rect.top + rect.height / 2 + window.scrollY
          } as DOMRect & { centerX: number; centerY: number },
          isActive: false
        });
      });
    }, 100);

    // Optimized animation function using RAF with improved batching and viewport culling
    const updateBinaryNumbers = () => {
      const mouseX = lastMouseX;
      const mouseY = lastMouseY;

      // Pre-allocate arrays with estimated capacity to reduce memory allocations
      const toActivate: HTMLElement[] = [];
      const toDeactivate: HTMLElement[] = [];
      toActivate.length = 0;
      toDeactivate.length = 0;

      // Viewport culling optimization - only check elements near the mouse
      const checkRadius = proximityRadius + 50; // Buffer zone
      const checkRadiusSquared = checkRadius * checkRadius;

      let activeCount = 0;
      const maxActiveElements = 50; // Limit concurrent animations for performance

      binaryNumbers.forEach((numberData) => {
        const { element, rect, isActive } = numberData;

        // Early exit if too many elements are already active
        if (activeCount >= maxActiveElements && !isActive) return;

        // Use squared distance to avoid expensive sqrt operation
        const deltaX = mouseX - (rect as any).centerX;
        const deltaY = mouseY - (rect as any).centerY;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;

        // Viewport culling - skip elements far from mouse
        if (distanceSquared > checkRadiusSquared && !isActive) return;

        const shouldBeActive = distanceSquared < proximityRadiusSquared;

        // Only animate if state changes (avoid redundant animations)
        if (shouldBeActive !== isActive) {
          numberData.isActive = shouldBeActive;

          if (shouldBeActive && activeCount < maxActiveElements) {
            toActivate.push(element);
            activeCount++;
          } else if (!shouldBeActive) {
            toDeactivate.push(element);
          }
        } else if (isActive) {
          activeCount++;
        }
      });

      // Batch GSAP animations for better performance
      if (toActivate.length > 0) {
        gsap.set(toActivate, {
          color: "rgba(28, 145, 72, 0.8)",
          textShadow: "0 0 10px rgba(28, 145, 72, 0.8)",
          scale: 1,
          force3D: true
        });
      }

      if (toDeactivate.length > 0) {
        gsap.set(toDeactivate, {
          color: "#000000",
          textShadow: "none",
          scale: 0.75,
          force3D: true
        });
      }
    };

    // Improved throttled mousemove handler with debouncing
    let isAnimating = false;
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      lastMouseX = mouseEvent.clientX;
      lastMouseY = mouseEvent.clientY;

      // Skip if already animating to maintain consistent 60fps
      if (isAnimating) return;

      isAnimating = true;
      rafId = requestAnimationFrame(() => {
        updateBinaryNumbers();
        isAnimating = false;
      });
    };
    
    main?.addEventListener("mousemove", handleMouseMove, { passive: true });

    const mainLogo = document.querySelector(".mainLogo");

    // Pre-optimize logo images for better performance
    gsap.set([".img1", ".img3", ".img4"], { 
      transformOrigin: "center center", 
      force3D: true 
    });

    mainLogo?.addEventListener("mouseenter", () => {
      const tl = gsap.timeline();

      tl.to('.img1', {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
        force3D: true
      })

      tl.to('.img3', {
        opacity: 1,
        rotate: -10,
        duration: 0.25,
        ease: "power2.out",
        force3D: true
      })

      tl.to('.img4', {
        opacity: 1,
        rotate: 10,
        duration: 0.25,
        ease: "power2.out",
        force3D: true
      })
    });

    mainLogo?.addEventListener("mouseleave", () => {
      const tl = gsap.timeline();

      tl.to('.img1', {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        force3D: true
      })

      tl.to('.img3', {
        opacity: 0,
        rotate: 45,
        duration: 0.25,
        ease: "power2.out",
        force3D: true
      })

      tl.to('.img4', {
        opacity: 0,
        rotate: -45,
        duration: 0.25,
        ease: "power2.out",
        force3D: true
      })
    });

    // Set initial states for ScrollTrigger elements to prevent flash
    gsap.set('.scrollText span', { 
      height: 0 
    });

    const t2 = gsap.timeline({
      scrollTrigger: {
        trigger: '.secondPage',
        start: "top top",
        end: "150% top",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true, // Optimization: recalculate on resize
        // markers: true, // Optional: for debugging, remove in production
      }
    });

    t2.to('.scrollText span', {
      height: "auto",
      duration: 1,
      ease: "power2.out",
      stagger: 0.1,
    })

    t2.to('.scrollText span', {
      color: "transparent",
      webkitTextStroke: "2px #075d27",
      duration: 0.1
    })
    t2.to('.scrollText span', {
      backgroundSize: "100% 100%",
      duration: 1,
      stagger: 0.1,
    })
    t2.to('.scrollText', {
      x: "-100%",
      duration: 1,
    });

    // SplitText functionality
    let split: any, animation: any;
    
    const setupSplitText = () => {
      split && split.revert();
      animation && animation.revert();
      split = SplitText.create(".height-0", {type: "chars,words,lines"});
      
      // Set initial states to prevent flash
      gsap.set(split.chars, {
        x: 150,
        opacity: 0
      });
    };

    // Initialize SplitText and run animation after a short delay
    setTimeout(() => {
      setupSplitText();
      
      // Animate the text elements to their normal height first
      gsap.to('.height-0', {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // Then animate the characters
          animation = gsap.to(split.chars, {
            x: 0,
            opacity: 1,
            duration: 0.7, 
            ease: "power4",
            stagger: 0.04
          });
        }
      });
    }, 1500); // Wait for logo animation to complete

    // Handle window resize
    const handleResize = () => {
      setupSplitText();
      // Re-run animation after resize
      setTimeout(() => {
        gsap.to('.height-0', {
          height: "auto",
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            animation = gsap.to(split.chars, {
              x: 0,
              opacity: 1,
              duration: 0.7, 
              ease: "power4",
              stagger: 0.04
            });
          }
        });
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    // Optimized cleanup function
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      
      // Remove event listeners
      main?.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      
      // Cleanup SplitText
      split && split.revert();
      animation && animation.revert();
    };
  });
  return (
    <SmoothScroll>
      <div className="main h-screen w-full relative overflow-hidden main-option-2 cursor-none">
        <div className="absolute h-full w-full flex items-center justify-center z-20">
          <div className="flex flex-col items-center text-center max-w-4xl px-8">
            <Image
              className="scale-125 mainLogo mb-8 animateText"
              src="/logo-bgless.png"
              alt="ASPDC"
              width={300}
              height={300}
              priority={true}
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli1b4AZzSFBBk3zNg=="
            />

            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text height-0">
                For <span className="text-green-500">Students</span>, By <span className="text-green-500">Students</span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed text-gray-300 max-w-3xl text height-0">
                Dive into the world of coding with <span className="text-green-500 font-semibold">ASPDC</span> - Where every student, regardless of experience, finds a safe space to learn, grow, and innovate. Join us in exploring web development, AI, competitive programming, and more!
              </p>
            </div>
          </div>
        </div>
        <Image className="absolute z-20 top-20 left-10 opacity-0 scale-50 img1" height={150} width={150} src="/main1.jpg" alt="ASPDC Logo" />
        <Image className="absolute z-20 -right-5 top-50 rotate-z-90 opacity-0 origin-bottom-right img3" height={200} width={200} src="/main3.jpg" alt="ASPDC Logo" />
        <Image className="absolute z-20 bottom-20 -left-5 -rotate-z-90 opacity-0 origin-bottom-left img4" height={200} width={200} src="/main4.jpg" alt="ASPDC Logo" />
        <div className="bottom-10 bg-transparent text-xl text-center absolute w-full z-20">
          <div className="flex flex-col items-center gap-2">
            <span>Scroll to Explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className="secondPage h-screen w-full overflow-hidden">
        <div className="h-full w-full scrollText flex items-center justify-center font-extrabold text-[20vw]">
          <span className="overflow-hidden inline-block"> A</span>
          <span className="overflow-hidden inline-block"> S</span>
          <span className="overflow-hidden inline-block"> P</span>
          <span className="overflow-hidden inline-block"> D</span>
          <span className="overflow-hidden inline-block"> C</span>
        </div>
      </div>
      <div className="h-screen w-full"></div>
    </SmoothScroll>
  );
}

export default page;

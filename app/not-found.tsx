'use client';
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, Home, Sparkles, Zap, Code } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const binaryContainerRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [hoverEffect, setHoverEffect] = useState(false);

  useEffect(() => {
    // Enhanced binary numbers animation
    if (binaryContainerRef.current) {
      const binaryContainer = binaryContainerRef.current;
      
      // Create interactive binary numbers
      for (let i = 0; i < 40; i++) {
        const binary = document.createElement('div');
        binary.textContent = Math.random() > 0.5 ? '1' : '0';
        binary.className = 'absolute text-green-500/15 font-mono select-none cursor-pointer transition-all duration-300 hover:text-green-400 hover:scale-150';
        binary.style.left = Math.random() * 100 + '%';
        binary.style.top = Math.random() * 100 + '%';
        binary.style.fontSize = (10 + Math.random() * 8) + 'px';
        binaryContainer.appendChild(binary);

        // Enhanced floating animation
        gsap.to(binary, {
          y: -80,
          x: (Math.random() - 0.5) * 30,
          opacity: 0,
          rotation: Math.random() * 180,
          duration: 5 + Math.random() * 3,
          delay: Math.random() * 2,
          repeat: -1,
          ease: "power2.out"
        });

        // Interactive hover effects
        binary.addEventListener('mouseenter', () => {
          gsap.to(binary, { 
            color: '#22c55e', 
            scale: 2, 
            textShadow: '0 0 15px #22c55e',
            duration: 0.3 
          });
          createSparkle(binary.offsetLeft, binary.offsetTop);
        });
        
        binary.addEventListener('mouseleave', () => {
          gsap.to(binary, { 
            color: 'rgba(34, 197, 94, 0.15)', 
            scale: 1, 
            textShadow: 'none',
            duration: 0.3 
          });
        });

        // Click to change number
        binary.addEventListener('click', () => {
          binary.textContent = Math.random() > 0.5 ? '1' : '0';
          gsap.fromTo(binary, 
            { scale: 2, color: '#fbbf24' },
            { scale: 1, color: 'rgba(34, 197, 94, 0.15)', duration: 0.5 }
          );
        });
      }
    }

    // Mouse tracking with enhanced cursor
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create occasional sparkles on mouse movement
      if (Math.random() > 0.97) {
        createSparkle(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Main animation timeline with more drama
    const tl = gsap.timeline();
    
    // Set initial states
    gsap.set(".error-code", { scale: 0, opacity: 0, rotationY: 180 });
    gsap.set(".error-title", { y: 50, opacity: 0, skewX: 10 });
    gsap.set(".error-subtitle", { y: 30, opacity: 0 });
    gsap.set(".action-button", { y: 40, opacity: 0, scale: 0.5 });
    gsap.set(".floating-icon", { scale: 0, opacity: 0, rotation: 180 });
    gsap.set(".status-dot", { scale: 0 });

    // Enhanced animation sequence
    tl.to(".error-code", {
      scale: 1,
      opacity: 1,
      rotationY: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)"
    })
    .to(".error-title", {
      y: 0,
      opacity: 1,
      skewX: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .to(".error-subtitle", {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .to(".floating-icon", {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.2
    }, "-=0.4")
    .to(".status-dot", {
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.8)",
      stagger: 0.1
    }, "-=0.3")
    .to(".action-button", {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.15
    }, "-=0.4");

    // Enhanced glitch effect with color variations
    if (glitchRef.current) {
      const glitchTl = gsap.timeline({ repeat: -1 });
      glitchTl
        .to(glitchRef.current, { skewX: 5, color: '#ef4444', duration: 0.1 })
        .to(glitchRef.current, { skewX: -5, x: 2, color: '#22c55e', duration: 0.1 })
        .to(glitchRef.current, { skewX: 0, x: 0, color: '#22c55e', duration: 0.1 })
        .to(glitchRef.current, { delay: 4 });
    }

    // Continuous floating animations for icons
    gsap.to(".floating-icon", {
      y: -10,
      rotation: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: { amount: 1, from: "random" }
    });

    // Pulsing status dots
    gsap.to(".status-dot", {
      scale: 1.2,
      opacity: 0.7,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: 0.3
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Create sparkle effect
  const createSparkle = (x: number, y: number) => {
    if (!containerRef.current) return;
    
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.className = 'absolute pointer-events-none text-yellow-400 text-xs';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.zIndex = '100';
    containerRef.current.appendChild(sparkle);

    gsap.fromTo(sparkle, 
      { scale: 0, rotation: 0 },
      { 
        scale: 1.5, 
        rotation: 360, 
        y: -30,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => sparkle.remove()
      }
    );
  };

  // Enhanced 404 click interaction
  const handle404Click = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount >= 2) {
      // Epic easter egg animation
      gsap.timeline()
        .to(".error-code", {
          rotation: 720,
          scale: 1.3,
          color: '#fbbf24',
          duration: 1.5,
          ease: "power2.out"
        })
        .to(".error-code", {
          rotation: 0,
          scale: 1,
          color: '#22c55e',
          duration: 1,
          ease: "elastic.out(1, 0.3)"
        });
      setClickCount(0);
    }

    // Enhanced explosion effect
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        createExplosionParticle();
      }, i * 40);
    }

    // Screen shake effect
    gsap.to(containerRef.current, {
      x: 5,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: "power2.inOut"
    });
  };

  const createExplosionParticle = () => {
    if (!containerRef.current) return;
    
    const shapes = ['●', '■', '▲', '♦', '★'];
    const colors = ['#22c55e', '#fbbf24', '#ef4444', '#3b82f6', '#8b5cf6'];
    
    const particle = document.createElement('div');
    particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    particle.className = 'absolute text-lg pointer-events-none font-bold';
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = '50%';
    particle.style.top = '35%';
    particle.style.zIndex = '100';
    containerRef.current.appendChild(particle);

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      rotation: Math.random() * 720,
      scale: 0,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => particle.remove()
    });
  };

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden cursor-none flex items-center justify-center" ref={containerRef}>
      {/* Enhanced custom cursor */}
      <div 
        ref={mouseRef}
        className="fixed w-4 h-4 bg-green-500/70 rounded-full pointer-events-none z-50 transition-all duration-200 shadow-lg shadow-green-500/50"
        style={{ 
          left: mousePosition.x - 8, 
          top: mousePosition.y - 8,
          transform: isHovering ? 'scale(2.5)' : 'scale(1)',
          boxShadow: isHovering ? '0 0 20px #22c55e' : '0 0 10px #22c55e'
        }}
      />

      {/* Interactive animated background */}
      <div 
        ref={binaryContainerRef}
        className="absolute inset-0 overflow-hidden"
      />

      {/* Enhanced grid background with pulse */}
      <div 
        className="absolute inset-0 opacity-[0.04] animate-pulse"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.6) 1px, transparent 0)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating decorative icons */}
      <div className="floating-icon absolute top-20 left-20 text-green-500/30 text-2xl">
        <Code />
      </div>
      <div className="floating-icon absolute top-32 right-32 text-green-400/20 text-xl">
        <Zap />
      </div>
      <div className="floating-icon absolute bottom-32 left-32 text-green-300/25 text-lg">
        <Sparkles />
      </div>

      {/* Main content - enhanced and centered */}
      <div className="text-center p-4 relative z-10 max-w-4xl mx-auto">
        
        {/* Enhanced 404 Error Code */}
        <div className="mb-8">
          <div 
            ref={glitchRef}
            onClick={handle404Click}
            className="error-code text-7xl md:text-8xl lg:text-9xl font-bold text-green-500 mb-6 relative cursor-pointer hover:scale-110 transition-all duration-300 filter drop-shadow-lg"
            onMouseEnter={() => {
              setIsHovering(true);
              setHoverEffect(true);
            }}
            onMouseLeave={() => {
              setIsHovering(false);
              setHoverEffect(false);
            }}
            style={{
              textShadow: hoverEffect ? '0 0 30px #22c55e, 0 0 60px #22c55e' : '0 0 20px #22c55e'
            }}
          >
            404
            <div className="absolute inset-0 text-green-300 opacity-20 animate-pulse">404</div>
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <h1 className="error-title text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-white">Page Not</span>{" "}
            <span className="text-green-500 relative">
              Found
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-transparent"></div>
            </span>
          </h1>
          
          <div className="error-subtitle text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            <span className="text-green-500 font-mono bg-green-500/10 px-2 py-1 rounded">[ERROR_404]</span> 
            {" "}This page seems to have vanished into the digital void. 
            Our <span className="text-green-500 font-semibold relative">
              ASPDC
              <div className="status-dot absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
            </span> team is on it!
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex gap-3 justify-center mb-8">
          <div className="flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-full border border-red-500/20 backdrop-blur-sm">
            <div className="status-dot w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-400 text-xs font-mono">LOST</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-2 rounded-full border border-yellow-500/20 backdrop-blur-sm">
            <div className="status-dot w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-400 text-xs font-mono">SCAN</span>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-full border border-green-500/20 backdrop-blur-sm">
            <div className="status-dot w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-xs font-mono">ACTIVE</span>
          </div>
        </div>

        {/* Enhanced action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="action-button">
            <button 
              className="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/30 relative overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Home className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Initialize Home</span>
              <Sparkles className="w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300" />
            </button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="action-button group flex items-center gap-3 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-green-500/30 hover:border-green-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Rollback</span>
            <div className="w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Interactive footer */}
        <div className="mt-8 text-center">
          <p className="text-green-500/60 text-xs font-mono mb-2">
            ASPDC • Click the numbers • Hover the binary rain
          </p>
          <div className="flex justify-center gap-1">
            <div className="status-dot w-1 h-1 bg-green-500 rounded-full"></div>
            <div className="status-dot w-1 h-1 bg-green-400 rounded-full"></div>
            <div className="status-dot w-1 h-1 bg-green-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

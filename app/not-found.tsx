'use client';
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, Home, RefreshCw, Terminal, Mouse, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const binaryContainerRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [terminalText, setTerminalText] = useState('');

  const terminalCommands = [
    '$ ls -la',
    '$ cat /var/log/missing-page.log',
    '$ ERROR: 404 - Page not found',
    '$ Searching for page...',
    '$ grep -r "page" /website/',
    '$ No matches found',
    '$ Suggestion: Try going home'
  ];

  useEffect(() => {
    // Terminal typing effect
    let commandIndex = 0;
    let charIndex = 0;
    
    const typeCommand = () => {
      if (commandIndex < terminalCommands.length) {
        if (charIndex < terminalCommands[commandIndex].length) {
          setTerminalText(prev => prev + terminalCommands[commandIndex][charIndex]);
          charIndex++;
          setTimeout(typeCommand, 50 + Math.random() * 50);
        } else {
          setTerminalText(prev => prev + '\n');
          commandIndex++;
          charIndex = 0;
          setTimeout(typeCommand, 1000);
        }
      }
    };

    setTimeout(typeCommand, 2000);

    // Enhanced binary numbers animation
    if (binaryContainerRef.current) {
      const binaryContainer = binaryContainerRef.current;
      
      // Create more dynamic binary numbers
      for (let i = 0; i < 80; i++) {
        const binary = document.createElement('div');
        binary.textContent = Math.random() > 0.5 ? '1' : '0';
        binary.className = 'absolute text-green-500/20 font-mono select-none pointer-events-none transition-all duration-300';
        binary.style.left = Math.random() * 100 + '%';
        binary.style.top = Math.random() * 100 + '%';
        binary.style.fontSize = (12 + Math.random() * 8) + 'px';
        binaryContainer.appendChild(binary);

        // Enhanced animation with random patterns
        gsap.to(binary, {
          y: -100 - Math.random() * 50,
          x: (Math.random() - 0.5) * 50,
          opacity: 0,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          duration: 4 + Math.random() * 3,
          delay: Math.random() * 3,
          repeat: -1,
          ease: "power2.out"
        });

        // Color change on hover effect
        binary.addEventListener('mouseenter', () => {
          gsap.to(binary, { 
            color: '#22c55e', 
            scale: 1.5, 
            textShadow: '0 0 10px #22c55e',
            duration: 0.3 
          });
        });
        
        binary.addEventListener('mouseleave', () => {
          gsap.to(binary, { 
            color: 'rgba(34, 197, 94, 0.2)', 
            scale: 1, 
            textShadow: 'none',
            duration: 0.3 
          });
        });
      }
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create particle trail
      createParticle(e.clientX, e.clientY);
    };

    // Create particle effect
    const createParticle = (x: number, y: number) => {
      if (!containerRef.current) return;
      
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-green-500 rounded-full pointer-events-none';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.zIndex = '100';
      containerRef.current.appendChild(particle);

      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Main animation timeline
    const tl = gsap.timeline();
    
    // Set initial states
    gsap.set(".error-code", { scale: 0, opacity: 0, rotationY: 180 });
    gsap.set(".error-title", { y: 50, opacity: 0, rotationX: -20 });
    gsap.set(".error-subtitle", { y: 30, opacity: 0 });
    gsap.set(".action-button", { y: 40, opacity: 0, scale: 0.8 });
    gsap.set(".terminal-window", { y: 80, opacity: 0, scale: 0.8 });
    gsap.set(".interactive-element", { scale: 0, opacity: 0 });

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
      rotationX: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8")
    .to(".error-subtitle", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")
    .to(".interactive-element", {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.1
    }, "-=0.4")
    .to(".action-button", {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.15
    }, "-=0.5")
    .to(".terminal-window", {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");

    // Enhanced glitch effect
    if (glitchRef.current) {
      const glitchTl = gsap.timeline({ repeat: -1 });
      glitchTl
        .to(glitchRef.current, { skewX: 5, duration: 0.1, ease: "power2.inOut" })
        .to(glitchRef.current, { skewX: -5, x: 2, duration: 0.1, ease: "power2.inOut" })
        .to(glitchRef.current, { skewX: 0, x: 0, duration: 0.1, ease: "power2.inOut" })
        .to(glitchRef.current, { delay: 2 });
    }

    // Continuous floating animations
    gsap.to(".interactive-element", {
      y: -5,
      rotation: 2,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle 404 click for easter egg
  const handle404Click = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount >= 4) {
      // Easter egg animation
      gsap.to(".error-code", {
        rotation: 360,
        scale: 1.2,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
        yoyo: true,
        repeat: 1
      });
      setClickCount(0);
    }

    // Create explosion effect
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        createExplosionParticle();
      }, i * 50);
    }
  };

  const createExplosionParticle = () => {
    if (!containerRef.current) return;
    
    const particle = document.createElement('div');
    particle.className = 'absolute w-2 h-2 bg-green-500 rounded-full pointer-events-none';
    particle.style.left = '50%';
    particle.style.top = '30%';
    particle.style.zIndex = '100';
    containerRef.current.appendChild(particle);

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      scale: 0,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => particle.remove()
    });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden cursor-none" ref={containerRef}>
      {/* Custom cursor */}
      <div 
        ref={mouseRef}
        className="fixed w-4 h-4 bg-green-500/50 rounded-full pointer-events-none z-50 transition-all duration-100"
        style={{ 
          left: mousePosition.x - 8, 
          top: mousePosition.y - 8,
          transform: isHovering ? 'scale(2)' : 'scale(1)'
        }}
      />

      {/* Enhanced animated background */}
      <div 
        ref={binaryContainerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />

      {/* Animated grid background */}
      <div 
        className="absolute inset-0 opacity-[0.05] animate-pulse"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.5) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          animation: 'gridMove 20s linear infinite'
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-green-500/20 rounded-full interactive-element"></div>
      <div className="absolute bottom-32 right-20 w-16 h-16 border border-green-400/15 rounded-lg rotate-45 interactive-element"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-500/10 rounded-full interactive-element"></div>
      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-green-300/10 rounded-full interactive-element"></div>

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        
        {/* Interactive 404 Error Code */}
        <div className="text-center mb-8">
          <div 
            ref={glitchRef}
            onClick={handle404Click}
            className="error-code text-8xl md:text-9xl lg:text-[12rem] font-bold text-green-500 mb-4 relative cursor-pointer hover:scale-105 transition-transform duration-300"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            404
            <div className="absolute inset-0 text-green-300 opacity-30 animate-ping">404</div>
            <div className="absolute inset-0 text-red-500 opacity-20" style={{ transform: 'translate(2px, 2px)' }}>404</div>
          </div>
          
          <h1 className="error-title text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">System</span>{" "}
            <span className="text-green-500 animate-pulse">Error</span>
          </h1>
          
          <p className="error-subtitle text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
            <span className="text-green-500 font-mono">[ERROR_404]</span> The requested page has been 
            <span className="text-red-400"> deleted</span> from the matrix. 
            Even our best <span className="text-green-500 font-semibold">ASPDC</span> developers are searching for it!
          </p>
        </div>

        {/* Interactive status indicators */}
        <div className="flex gap-4 mb-8 interactive-element">
          <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm font-mono">CONNECTION_LOST</span>
          </div>
          <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-mono">SEARCHING...</span>
          </div>
        </div>

        {/* Enhanced action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/" className="action-button">
            <button 
              className="group flex items-center gap-3 bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/30 relative overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Home className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Initialize Home</span>
              <Sparkles className="w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="action-button group flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-green-500/30 hover:border-green-500 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Rollback</span>
            <RefreshCw className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300" />
          </button>
        </div>

        {/* Interactive terminal window */}
        <div className="terminal-window bg-gray-900 border border-green-500/30 rounded-lg p-4 max-w-2xl w-full mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm ml-2">ASPDC Terminal</span>
          </div>
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
            {terminalText}
            <span className="animate-pulse">|</span>
          </pre>
        </div>

        {/* Fun interaction hint */}
        <div className="interactive-element text-center">
          <p className="text-gray-500 text-sm mb-2 flex items-center justify-center gap-2">
            <Mouse className="w-4 h-4" />
            Move your mouse around • Click the 404 for a surprise
          </p>
          <p className="text-green-500/60 text-xs font-mono">
            Error 404 • System Not Found • ASPDC Debug Mode Active
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>
    </div>
  );
}

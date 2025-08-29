'use client'

import React, { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
    const outputRef = useRef<HTMLDivElement>(null)
    const [output, setOutput] = useState('Output will appear here...')
    const [selectedDemo, setSelectedDemo] = useState<string>('')
    const [stack, setStack] = useState<string[]>([])
    const [terminalInput, setTerminalInput] = useState('')
    const [terminalHistory, setTerminalHistory] = useState<string[]>([
        "Type 'help' to see available commands.",
    ])

    const demoCodes = [
        {
            label: 'Hello World (JS)',
            code: "console.log('Hello, World!');",
        },
        {
            label: 'Sum Function (JS)',
            code: 'function sum(a, b) {\n  return a + b;\n}\nconsole.log(sum(2, 3));',
        },
        {
            label: 'Factorial (JS)',
            code: 'function factorial(n) {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n}\nconsole.log(factorial(5));',
        },
    ]

    const techOptions = [
        { name: 'JavaScript', color: 'bg-yellow-300', icon: '🟨' },
        { name: 'Python', color: 'bg-blue-400', icon: '🐍' },
        { name: 'TypeScript', color: 'bg-blue-300', icon: '🔷' },
        { name: 'React', color: 'bg-cyan-300', icon: '⚛️' },
        { name: 'Node.js', color: 'bg-green-400', icon: '🟩' },
        { name: 'VS Code', color: 'bg-blue-600', icon: '💻' },
        { name: 'GitHub', color: 'bg-gray-800', icon: '🐙' },
        { name: 'Terminal', color: 'bg-black', icon: '⌨️' },
    ]

    const terminalCommands: { [key: string]: string } = {
        help: 'Available commands: help, about, aspdc, joke, clear',
        about: 'ASPDC: A squad of tech-loving students sharing knowledge and good vibes.',
        aspdc: 'ASPDC stands for Adani Student Programming and Development Club.',
        joke: 'Why do programmers prefer dark mode? Because light attracts bugs! 🐞',
        clear: '__clear__',
    }

    const handleTerminalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.trim().toLowerCase()
            let response = terminalCommands[cmd] || `Unknown command: ${cmd}`
            if (response === '__clear__') {
                setTerminalHistory(["Type 'help' to see available commands."])
            } else {
                setTerminalHistory([...terminalHistory, '> ' + cmd, response])
            }
            setTerminalInput('')
        }
    }

    // Animation logic
    useGSAP(() => {
        // Description color fill animation
        const desc = document.getElementById('about-desc')
        if (desc) {
            gsap.set(desc, { opacity: 1 })
            gsap.to(desc, {
                scrollTrigger: {
                    trigger: desc,
                    start: 'top 95%',
                    end: 'top 60%',
                    scrub: 0.8,
                },
                onUpdate: function () {
                    const progress = this.progress()
                    ;(desc as HTMLElement).style.background =
                        `linear-gradient(90deg, #ffffff ${progress * 100}%, #6b7280 ${progress * 100}%)`
                    ;(desc as HTMLElement).style.webkitBackgroundClip = 'text'
                    ;(desc as HTMLElement).style.webkitTextFillColor =
                        'transparent'
                    ;(desc as HTMLElement).style.backgroundClip = 'text'
                },
            })
        }

        // More visible points animation
        const points = document.querySelectorAll('.animated-point')
        points.forEach((point, idx) => {
            gsap.fromTo(
                point,
                { opacity: 0, y: 60, scale: 0.85 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: 'elastic.out(1, 0.6)',
                    delay: idx * 0.1,
                    scrollTrigger: {
                        trigger: point,
                        start: 'top 95%',
                        end: 'top 80%',
                        scrub: 0.5,
                    },
                    onUpdate: function () {
                        const progress = this.progress()
                        ;(point as HTMLElement).style.background =
                            `linear-gradient(90deg, #ffffff ${progress * 100}%, #6b7280 ${progress * 100}%)`
                        ;(point as HTMLElement).style.webkitBackgroundClip =
                            'text'
                        ;(point as HTMLElement).style.webkitTextFillColor =
                            'transparent'
                        ;(point as HTMLElement).style.backgroundClip = 'text'
                    },
                }
            )
        })
    })

    const handleRun = () => {
        if (selectedDemo) {
            setOutput('✅ Output: Demo code executed! (This is a demo output.)')
        } else {
            setOutput('Please select a demo code to run.')
        }
    }

    const handleClear = () => {
        setSelectedDemo('')
        setOutput('Output will appear here...')
    }

    return (
        <section className="relative w-full overflow-hidden bg-black px-4 py-20 sm:px-8 lg:px-16">
            <div className="relative z-10 container mx-auto">
                <div className="mb-12 text-center lg:mb-16">
                    <h1 className="about-title mb-4 text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
                        <span className="text-green-500">What's</span>{' '}
                        <span className="text-white">ASPDC</span>{' '}
                        <span className="text-green-400">All</span>{' '}
                        <span className="text-white">About</span>
                    </h1>
                    <div
                        className="about-subtitle mx-auto max-w-4xl px-4 text-lg leading-relaxed text-gray-300 sm:text-xl lg:text-2xl"
                        id="about-desc"
                    >
                        ASPDC is a squad of tech-loving students who geek out
                        over code and love to share the knowledge. No
                        gatekeeping here - just good vibes and great learning.
                    </div>
                </div>

                <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">
                    <div>
                        <ul className="space-y-6 text-gray-200 lg:space-y-8">
                            <li className="animated-point rounded-lg border-none bg-transparent px-2 py-2 text-xl font-normal tracking-wide lg:text-2xl">
                                Lit workshops on everything from building killer
                                websites to training AIs
                            </li>
                            <li className="animated-point rounded-lg border-none bg-transparent px-2 py-2 text-xl font-normal tracking-wide lg:text-2xl">
                                Coding hangouts where we tackle projects
                                together
                            </li>
                            <li className="animated-point rounded-lg border-none bg-transparent px-2 py-2 text-xl font-normal tracking-wide lg:text-2xl">
                                Chances to flex your skills in coding
                                competitions
                            </li>
                            <li className="animated-point rounded-lg border-none bg-transparent px-2 py-2 text-xl font-normal tracking-wide lg:text-2xl">
                                Networking opps with tech industry pros (aka
                                future bosses)
                            </li>
                            <li className="animated-point rounded-lg border-none bg-transparent px-2 py-2 text-xl font-normal tracking-wide lg:text-2xl">
                                A judgment-free zone to try, fail, and crush it
                            </li>
                        </ul>
                    </div>
                    <div className="relative flex h-96 w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-green-900/30 via-black/60 to-green-400/10 p-8 shadow-xl">
                        <div className="flex h-full w-full flex-col items-center justify-center gap-6">
                            <span className="mb-2 text-2xl font-bold text-green-400 lg:text-4xl">
                                Terminal Easter Egg
                            </span>
                            <div className="h-64 w-full overflow-y-auto rounded-lg border border-green-700 bg-black/80 p-4 font-mono text-sm text-green-300 shadow-lg">
                                {terminalHistory.map((line, idx) => (
                                    <div
                                        key={idx}
                                        className="whitespace-pre-wrap"
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>
                            <input
                                type="text"
                                className="mt-2 w-full rounded-lg border border-green-700 bg-black/90 p-2 font-mono text-green-300 transition-all focus:ring-2 focus:ring-green-400 focus:outline-none"
                                placeholder="Enter command..."
                                value={terminalInput}
                                onChange={(e) =>
                                    setTerminalInput(e.target.value)
                                }
                                onKeyDown={handleTerminalInput}
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

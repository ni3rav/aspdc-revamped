'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function ReactionTest() {
    const [status, setStatus] = useState<
        'idle' | 'waiting' | 'ready' | 'clicked'
    >('idle')
    const [message, setMessage] = useState('Click to Start')
    const [time, setTime] = useState<number | null>(null)
    const startTimeRef = useRef<number>(0)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const startGame = () => {
        setStatus('waiting')
        setMessage('Wait for Green...')
        setTime(null)

        // Random wait 2–5 seconds
        const delay = Math.floor(Math.random() * 3000) + 2000

        timeoutRef.current = setTimeout(() => {
            setStatus('ready')
            setMessage('CLICK NOW!')
            startTimeRef.current = Date.now()
        }, delay)
    }

    const handleClick = () => {
        if (status === 'idle') {
            startGame()
        } else if (status === 'waiting') {
            // Clicked too early
            clearTimeout(timeoutRef.current!)
            setStatus('idle')
            setMessage('Too Soon! Click to Try Again')
        } else if (status === 'ready') {
            const reactionTime = Date.now() - startTimeRef.current
            setStatus('clicked')
            setTime(reactionTime)
            setMessage(`⚡ Your Time: ${reactionTime} ms`)
        } else if (status === 'clicked') {
            setStatus('idle')
            setMessage('Click to Start')
            setTime(null)
        }
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    return (
        <div className="mt-12 flex flex-col items-center justify-center">
            <motion.div
                onClick={handleClick}
                className={`flex h-72 w-72 cursor-pointer items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg transition-colors duration-300 select-none ${
                    status === 'idle'
                        ? 'bg-primary'
                        : status === 'waiting'
                          ? 'bg-red-500'
                          : status === 'ready'
                            ? 'bg-green-500'
                            : 'bg-primary'
                }`}
                whileTap={{ scale: 0.95 }}
            >
                {message}
            </motion.div>

            {time && (
                <p className="mt-4 text-lg text-gray-300">
                    🔄 Click the box to try again
                </p>
            )}
        </div>
    )
}

import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            {/* Glowing 404 */}
            <h1 className="relative text-9xl font-extrabold tracking-wider">
                <span className="relative z-10">404</span>
                <span className="text-primary absolute inset-0 opacity-80 blur-lg">
                    404
                </span>
            </h1>

            {/* Fun subtitle */}
            <p className="mt-6 text-lg text-gray-400 sm:text-xl">
                Oops... looks like you took a wrong turn 🚧
            </p>

            {/* Button */}
            <Link
                href="/"
                className="bg-foreground hover:bg-primary mt-8 rounded-full px-6 py-3 font-semibold text-black shadow-md transition hover:scale-105"
            >
                Go Home
            </Link>
        </div>
    )
}

export default NotFound

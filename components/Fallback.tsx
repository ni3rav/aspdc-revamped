import React from 'react'

interface FallbackProps {
    message: string
    illustration?: React.ReactNode
    className?: string
}

export default function Fallback({
    message,
    illustration,
    className,
}: FallbackProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center py-16 text-center ${className ?? ''}`}
        >
            {illustration && <div className="mb-6">{illustration}</div>}
            <p className="text-muted-foreground text-lg">{message}</p>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check } from 'lucide-react'

interface ShareButtonProps {
    title?: string
    className?: string
}

export function ShareButton({
    title = 'Share this post',
    className,
}: ShareButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy link:', err)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className={className}
            aria-label={copied ? 'Link copied!' : title}
        >
            {copied ? (
                <div className="text-primary flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" />
                    Copied!
                </div>
            ) : (
                <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                </>
            )}
        </Button>
    )
}

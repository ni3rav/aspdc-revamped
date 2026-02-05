'use client'

import { Button } from '@/components/ui/button'
import { Share2, Link2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonProps {
    title: string
    url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: `Check out: ${title}`,
                    url,
                })
                toast.success('Shared successfully!')
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url)
                toast.success('Link copied to clipboard!')
            } else {
                toast.error('Sharing not supported')
            }
        } catch {
            toast.error('Failed to share')
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2"
        >
            <Share2 size={16} />
            Share
        </Button>
    )
}

export function CopyLinkButton({ url }: { url: string }) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            toast.success('Link copied!')
        } catch {
            toast.error('Failed to copy')
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
        >
            <Link2 size={16} />
            Copy Link
        </Button>
    )
}

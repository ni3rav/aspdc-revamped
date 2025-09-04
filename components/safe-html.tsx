'use client'

import { useMemo } from 'react'
import DOMPurify from 'dompurify'

interface SafeHtmlContentProps {
    content: string
    className?: string
}

export function SafeHtmlContent({ content, className }: SafeHtmlContentProps) {
    const sanitizedContent = useMemo(() => {
        return DOMPurify.sanitize(content, {
            ALLOWED_TAGS: [
                'p',
                'br',
                'strong',
                'em',
                'u',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'ul',
                'ol',
                'li',
                'blockquote',
                'a',
                'img',
                'code',
                'pre',
                'span',
                'div',
            ],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
            ALLOW_DATA_ATTR: false,
        })
    }, [content])

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
    )
}

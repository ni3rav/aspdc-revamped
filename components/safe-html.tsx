import sanitizeHtml from 'sanitize-html'

interface SafeHtmlContentProps {
    content: string
    className?: string
}

export function SafeHtmlContent({ content, className }: SafeHtmlContentProps) {
    const clean = sanitizeHtml(content)
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    )
}

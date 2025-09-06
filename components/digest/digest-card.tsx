'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Post } from 'zenblog/types'

type PostCardProps = {
    post: Post
    className?: string
    id: number
}

function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    } catch {
        return iso
    }
}

export function PostCard({ post, className, id }: PostCardProps) {
    const href = `/digest/${post.slug}`
    const firstTwoAuthors = post.authors?.slice(0, 2) ?? []
    const extraAuthors = Math.max((post.authors?.length ?? 0) - 2, 0)
    console.log(`id: ${id}`)

    return (
        <div
            className={cn(
                `animate-in slide-in-from-bottom-10 h-full`,
                className
            )}
        >
            <Link
                href={href}
                className="focus-visible:ring-ring focus-visible:ring-offset-background block rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label={`Read ${post.title}`}
            >
                <Card
                    className={cn(
                        'h-full overflow-hidden rounded-lg border-0 bg-white/5 shadow-md backdrop-blur-sm transition-all',
                        'hover:bg-primary/10 text-white hover:shadow-lg',
                        className
                    )}
                >
                    {/* Media */}
                    <div className="relative aspect-video w-full">
                        <Image
                            src={
                                post.cover_image ||
                                '/placeholder.svg?height=360&width=640&query=post%20cover'
                            }
                            alt={post.title}
                            fill
                            sizes="(min-width: 1024px) 400px, 100vw"
                            className="object-cover"
                            priority={false}
                        />
                    </div>

                    <CardHeader className="space-y-2">
                        {/* Meta */}
                        <div className="flex items-center justify-between gap-2 text-xs text-gray-300">
                            <div className="flex items-center gap-2">
                                {post.category ? (
                                    <Badge className="bg-primary/90 rounded-full px-2 py-0.5 text-white">
                                        {post.category.name}
                                    </Badge>
                                ) : null}
                            </div>
                            <time dateTime={post.published_at}>
                                {formatDate(post.published_at)}
                            </time>
                        </div>

                        <CardTitle className="text-lg font-semibold text-white">
                            {post.title}
                        </CardTitle>

                        {firstTwoAuthors.length ? (
                            <p className="text-xs text-gray-400">
                                {'By '}
                                {firstTwoAuthors.map((a) => a.name).join(', ')}
                                {extraAuthors > 0
                                    ? ` and ${extraAuthors} more`
                                    : ''}
                            </p>
                        ) : null}

                        {post.excerpt ? (
                            <p className="line-clamp-3 text-sm text-gray-300">
                                {post.excerpt}
                            </p>
                        ) : null}
                    </CardHeader>

                    <CardContent className="flex flex-col gap-3">
                        {/* Tags */}
                        {post.tags?.length ? (
                            <div className="flex flex-wrap items-center gap-2">
                                {post.tags.slice(0, 4).map((tag) => (
                                    <Badge
                                        key={tag.slug}
                                        className="rounded-full border border-white/20 bg-white/10 text-gray-200"
                                    >
                                        {tag.name}
                                    </Badge>
                                ))}
                                {post.tags.length > 4 ? (
                                    <Badge className="rounded-full border border-white/20 bg-white/10 text-gray-200">
                                        +{post.tags.length - 4}
                                    </Badge>
                                ) : null}
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}

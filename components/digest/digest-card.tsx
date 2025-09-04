'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Post } from 'zenblog/types'

type PostCardProps = {
    post: Post
    className?: string
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

export function PostCard({ post, className }: PostCardProps) {
    const href = `/digest/${post.slug}`
    const firstTwoAuthors = post.authors?.slice(0, 2) ?? []
    const extraAuthors = Math.max((post.authors?.length ?? 0) - 2, 0)
    const reduceMotion = useReducedMotion()

    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            whileHover={reduceMotion ? {} : { y: -2, scale: 1.01 }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
                mass: 0.6,
            }}
            className={cn('h-full', className)}
        >
            <Link
                href={href}
                className="focus-visible:ring-ring focus-visible:ring-offset-background block rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label={`Read ${post.title}`}
            >
                <Card className="border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground h-full overflow-hidden transition-colors">
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
                        <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                {post.category ? (
                                    <Badge variant="secondary">
                                        {post.category.name}
                                    </Badge>
                                ) : null}
                            </div>
                            <time dateTime={post.published_at}>
                                {formatDate(post.published_at)}
                            </time>
                        </div>

                        <CardTitle className="text-balance">
                            {post.title}
                        </CardTitle>

                        {firstTwoAuthors.length ? (
                            <p className="text-muted-foreground text-xs">
                                {'By '}
                                {firstTwoAuthors.map((a) => a.name).join(', ')}
                                {extraAuthors > 0
                                    ? ` and ${extraAuthors} more`
                                    : ''}
                            </p>
                        ) : null}

                        {post.excerpt ? (
                            <p className="text-muted-foreground text-sm">
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
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        {tag.name}
                                    </Badge>
                                ))}
                                {post.tags.length > 4 ? (
                                    <Badge
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        +{post.tags.length - 4}
                                    </Badge>
                                ) : null}
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    )
}

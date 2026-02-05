'use client'

import { PostSummary } from '@/lib/hive'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function formatDate(input: string | null) {
    if (!input) return ''
    const d = new Date(input)
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function PostCard({ post }: { post: PostSummary }) {
    const date = formatDate(post.publishedAt)

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/40 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-neutral-800/50">
            <Link
                href={`/digest/${post.slug}`}
                className="flex flex-1 flex-col p-6"
            >
                <div className="mb-4 flex flex-wrap gap-2">
                    {post.category && (
                        <Badge
                            variant="outline"
                            className="border-primary/30 text-primary text-xs"
                        >
                            {post.category.name}
                        </Badge>
                    )}
                    {post.tags.slice(0, 2).map((tag) => (
                        <Badge
                            key={tag.slug}
                            variant="outline"
                            className="border-white/20 text-xs text-neutral-400"
                        >
                            {tag.name}
                        </Badge>
                    ))}
                    {post.tags.length > 2 && (
                        <Badge
                            variant="outline"
                            className="border-white/20 text-xs text-neutral-400"
                        >
                            +{post.tags.length - 2}
                        </Badge>
                    )}
                </div>

                <h2 className="group-hover:text-primary mb-3 text-xl leading-tight font-bold text-neutral-100 transition-colors">
                    {post.title}
                </h2>

                <p className="mb-4 line-clamp-3 flex-1 text-sm text-neutral-400">
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                        {post.author && (
                            <span className="flex items-center gap-1">
                                <User size={12} />
                                {post.author.name}
                            </span>
                        )}
                        {date && (
                            <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {date}
                            </span>
                        )}
                    </div>

                    <span className="flex items-center gap-1 text-xs font-medium text-neutral-300 transition group-hover:text-white">
                        Read
                        <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </span>
                </div>
            </Link>
        </article>
    )
}

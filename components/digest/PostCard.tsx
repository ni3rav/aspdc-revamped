'use client'

import { PostSummary } from '@/lib/hive'
import Link from 'next/link'
import { User, ArrowRight } from 'lucide-react'
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
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-all duration-200 hover:border-neutral-700">
            <Link
                href={`/digest/${post.slug}`}
                className="flex flex-1 flex-col"
            >
                <h2 className="group-hover:text-primary border-b border-neutral-800 px-6 py-5 text-xl leading-snug font-semibold text-neutral-100 transition-colors">
                    {post.title}
                </h2>

                <div className="flex flex-1 flex-col p-6">
                    <p className="mb-5 line-clamp-3 flex-1 text-base leading-relaxed text-neutral-400">
                        {post.excerpt}
                    </p>

                    <div className="space-y-4 text-sm text-neutral-500">
                        {post.category && (
                            <div className="flex items-center gap-3">
                                <span className="text-neutral-600">
                                    Category:
                                </span>
                                <Badge
                                    variant="outline"
                                    className="border-primary text-primary h-7 px-2.5 text-xs font-medium tracking-wide uppercase"
                                >
                                    {post.category.name}
                                </Badge>
                            </div>
                        )}

                        {post.tags.length > 0 && (
                            <div className="flex items-center gap-3">
                                <span className="shrink-0 text-neutral-600">
                                    Tags:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {post.tags.slice(0, 3).map((tag) => (
                                        <Badge
                                            key={tag.slug}
                                            variant="outline"
                                            className="h-7 border-neutral-700 px-2.5 text-xs text-neutral-400"
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                    {post.tags.length > 3 && (
                                        <span className="text-neutral-600">
                                            +{post.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
                            <div className="flex items-center gap-3">
                                {post.author && (
                                    <span className="flex items-center gap-1.5">
                                        <User size={14} />
                                        <span className="max-w-[120px] truncate">
                                            {post.author.name}
                                        </span>
                                    </span>
                                )}
                                {date && (
                                    <>
                                        <span className="text-neutral-700">
                                            ·
                                        </span>
                                        <span>{date}</span>
                                    </>
                                )}
                            </div>

                            <ArrowRight
                                size={18}
                                className="group-hover:text-primary text-neutral-600 transition-all group-hover:translate-x-0.5"
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    )
}

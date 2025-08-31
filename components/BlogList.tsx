'use client'

import { Blog } from '@/db/types'
import { PixelImage } from '@/components/magicui/pixel-image'
import { Calendar, ExternalLink, Link, Link2 } from 'lucide-react'
import { toast } from 'sonner'

function formatDate(input: string | Date) {
    const d = new Date(input)
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function getHostname(url: string) {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

export function BlogList({ posts }: { posts: Blog[] }) {
    return (
        <div className="space-y-8 pb-8">
            {posts.map((post, index) => {
                const hostname = getHostname(post.link)
                const date = formatDate(post.publishDate)

                return (
                    <article
                        key={post.id}
                        className="group mx-auto max-w-6xl"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'both',
                        }}
                    >
                        <div className="hover:border-primary relative rounded-3xl border border-white/20 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/5 md:p-8">
                            {/* Subtle gradient overlay on hover */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neutral-400/0 to-neutral-600/0 transition-all duration-700 group-hover:from-neutral-400/5 group-hover:to-neutral-600/5"></div>

                            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
                                {/* Enhanced Image Section */}
                                <div className="relative h-64 w-full overflow-hidden rounded-2xl transition-all duration-700 group-hover:shadow-xl lg:h-80 lg:w-[34rem] lg:group-hover:scale-[1.03]">
                                    {post.coverImage ? (
                                        <div className="relative h-full w-full">
                                            <PixelImage
                                                src={post.coverImage}
                                                customGrid={{
                                                    rows: 8,
                                                    cols: 12,
                                                }}
                                                grayscaleAnimation
                                                pixelFadeInDuration={1400}
                                                maxAnimationDelay={2000}
                                                colorRevealDelay={1800}
                                            />
                                            {/* Subtle overlay for better text contrast */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-24 text-center">
                                            <div className="mb-6 text-8xl opacity-20">
                                                📚
                                            </div>
                                            <h3 className="mb-2 text-2xl font-bold text-neutral-300">
                                                No articles yet
                                            </h3>
                                            <p className="mb-6 max-w-md text-neutral-400">
                                                Check back soon for the latest
                                                blog posts and articles.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Content Section */}
                                <div className="flex-1 space-y-4 text-center lg:text-left">
                                    {/* Enhanced Title */}
                                    <h2 className="text-primary line-clamp-3 text-2xl leading-tight font-black md:text-3xl lg:text-4xl">
                                        {post.title}
                                    </h2>

                                    {/* Enhanced Metadata */}
                                    <div className="flex flex-wrap justify-center gap-3 text-sm text-neutral-400 lg:justify-start">
                                        <span>by {post.author}</span>
                                        {hostname && (
                                            <a
                                                href={`https://${hostname}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span className="hover:bg-primary/20 hover:text-primary rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-neutral-300 transition-colors">
                                                    {hostname}
                                                </span>
                                            </a>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} />
                                            <span>{date}</span>
                                        </div>
                                    </div>

                                    {/* Enhanced CTA Button */}
                                    <div className="flex justify-center gap-4 pt-2 lg:justify-start">
                                        <a
                                            href={post.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/cta bg-primary inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-bold text-black transition-all duration-500 hover:scale-110 active:scale-95 md:text-lg"
                                            aria-label={`Read article: ${post.title}`}
                                        >
                                            <span>Read Article</span>
                                            <ExternalLink
                                                size={20}
                                                className="text-black transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5"
                                            />
                                        </a>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    post.link
                                                )
                                                toast(`Link Copied`)
                                            }}
                                            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-neutral-300 transition hover:bg-white/10"
                                        >
                                            Copy Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                )
            })}

            {/* Enhanced Empty State */}
            {posts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="mb-6 text-8xl opacity-20">📚</div>
                    <h3 className="mb-2 text-2xl font-bold text-neutral-300">
                        No articles yet
                    </h3>
                    <p className="max-w-md text-neutral-400">
                        Check back soon for the latest blog posts and articles.
                    </p>
                </div>
            )}
        </div>
    )
}

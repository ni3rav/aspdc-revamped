'use client'

import { Blog } from '@/db/types'
import { PixelImage } from '@/components/magicui/pixel-image'

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

const ShareIcon = ({ size = 20, ...props }) => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height={size}
        role="presentation"
        viewBox="0 0 24 24"
        width={size}
        {...props}
    >
        <path
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
        />
    </svg>
)

export function BlogList({ posts }: { posts: Blog[] }) {
    return (
        <div className="space-y-8">
            {posts.map((post) => {
                const hostname = getHostname(post.link)
                const date = formatDate(post.publishDate)

                return (
                    <article key={post.id} className="group">
                        <div className="rounded-3xl p-8 transition-all duration-300 hover:bg-black/30">
                            {/* Main layout: Responsive - vertical on mobile, horizontal on desktop */}
                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
                                {/* Image: Top on mobile, Left on desktop */}
                                <div className="flex-shrink-0 md:order-1">
                                    {post.coverImage ? (
                                        <div className="md:perspective-1000 md:rotateY-12 relative h-64 w-full overflow-hidden rounded-2xl transition-transform duration-300 md:h-80 md:w-[32rem] md:transform">
                                            <PixelImage
                                                src={post.coverImage}
                                                customGrid={{
                                                    rows: 8,
                                                    cols: 12,
                                                }}
                                                grayscaleAnimation
                                            />
                                            {/* 🙃 tweak according to this data, make it little bit slow from default values */}
                                            {/* grayscaleAnimation	  boolean	  true	  Whether to animate from grayscale to color
                              pixelFadeInDuration	  number	  1000	  Duration (ms) for each pixel fade-in animation
                              maxAnimationDelay	    number	  1200	  Maximum random delay (ms) for pixel animation
                              colorRevealDelay	    number	  1500	  Delay (ms) before revealing color */}

                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
                                        </div>
                                    ) : (
                                        <div className="md:perspective-1000 md:rotateY-12 md:group-hover:rotateY-0 flex h-48 w-full items-center justify-center rounded-2xl bg-gray-800 transition-transform duration-300 md:h-56 md:w-80 md:transform">
                                            <div className="h-12 w-12 rounded-xl bg-green-500/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Content: Bottom on mobile, Right on desktop */}
                                <div className="min-w-0 flex-1 md:order-2 md:flex md:flex-col md:justify-center md:text-center">
                                    {/* Title - Green and bold */}
                                    <a
                                        href={post.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mb-3 block transition-colors duration-200 group-hover:text-green-400"
                                    >
                                        <h2 className="line-clamp-2 text-xl leading-tight font-bold text-green-500 md:text-2xl">
                                            {post.title}
                                        </h2>
                                    </a>

                                    {/* Author - White */}
                                    <p className="mb-2 text-base text-white md:text-lg">
                                        by {post.author}
                                    </p>

                                    {/* Date - White */}
                                    <p className="mb-2 text-sm text-white/80 md:text-base">
                                        {date}
                                    </p>

                                    {/* URL/Hostname - White */}
                                    <p className="mb-4 text-xs text-white/60 md:mb-6 md:text-sm">
                                        {hostname}
                                    </p>

                                    {/* Action button - Sleek green */}
                                    <a
                                        href={post.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:scale-105 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/25 md:mx-auto md:gap-3 md:px-6 md:py-3"
                                    >
                                        Read Article
                                        <ShareIcon
                                            size={16}
                                            className="text-black md:hidden"
                                        />
                                        <ShareIcon
                                            size={18}
                                            className="hidden text-black md:block"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </article>
                )
            })}
        </div>
    )
}

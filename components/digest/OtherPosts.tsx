'use client'

import React, { useState } from 'react'
import { PostCard } from './digest-card'
import { Badge } from '@/components/ui/badge'
import { Post } from 'zenblog/types'

// Props Interface
interface OtherPostsProps {
    posts: Post[]
    latestPost: Post
}

const OtherPosts: React.FC<OtherPostsProps> = ({ posts, latestPost }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    // Unique categories
    const categories = Array.from(
        new Set(
            posts
                .map((p) => p.category?.name)
                .filter((c): c is string => Boolean(c))
        )
    )

    // Filter posts based on active category
    const filteredPosts = activeCategory
        ? posts.filter((p) => p.category?.name === activeCategory)
        : posts

    return (
        <>
            {/* Filter Bar */}
            <div className="mb-6 flex flex-wrap gap-3">
                <Badge
                    onClick={() => setActiveCategory(null)}
                    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all ${
                        activeCategory === null
                            ? 'bg-primary text-white shadow-md'
                            : 'hover:bg-primary/80 bg-white/10 text-gray-300 backdrop-blur-sm hover:text-white hover:shadow'
                    }`}
                >
                    All
                </Badge>

                {categories.map((cat) => (
                    <Badge
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all ${
                            activeCategory === cat
                                ? 'bg-primary text-white shadow-md'
                                : 'hover:bg-primary/80 bg-white/10 text-gray-300 backdrop-blur-sm hover:text-white hover:shadow'
                        }`}
                    >
                        {cat}
                    </Badge>
                ))}
            </div>

            {/* Other Posts */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts
                    .filter((p) => p.slug !== latestPost.slug) // exclude featured post
                    .map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
            </div>
        </>
    )
}

export default OtherPosts

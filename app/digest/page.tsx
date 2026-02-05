import { Suspense } from 'react'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { FilterBarWrapper } from '@/components/digest/FilterBarWrapper'
import { PostsGrid } from '@/components/digest/PostsGrid'

interface DigestPageProps {
    searchParams: Promise<{
        category?: string
        tags?: string
        author?: string
        page?: string
    }>
}

export default function DigestPage({ searchParams }: DigestPageProps) {
    return (
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-16">
            <div className="mb-8 md:mb-12">
                <TextScramble className="text-primary mb-4 text-3xl font-bold uppercase md:text-4xl lg:text-5xl">
                    Digest
                </TextScramble>
                <p className="max-w-2xl text-neutral-400">
                    Explore our latest articles, insights, and stories from the
                    community.
                </p>
            </div>

            <Suspense fallback={<FilterBarSkeleton />}>
                <FilterBarWrapper searchParams={searchParams} />
            </Suspense>

            <Suspense fallback={<PostsGridSkeleton />}>
                <PostsGrid searchParams={searchParams} />
            </Suspense>
        </main>
    )
}

function FilterBarSkeleton() {
    return (
        <div className="mb-6 h-24 animate-pulse rounded-xl bg-neutral-800/50" />
    )
}

function PostsGridSkeleton() {
    return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="h-64 animate-pulse rounded-2xl bg-neutral-800/50"
                />
            ))}
        </div>
    )
}

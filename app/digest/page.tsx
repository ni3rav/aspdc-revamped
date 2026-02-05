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
        <main className="mx-auto min-h-screen max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
            <header className="mb-12">
                <TextScramble className="text-primary text-4xl font-bold tracking-tight uppercase md:text-5xl">
                    Digest
                </TextScramble>
                <p className="mt-3 text-base text-neutral-400 sm:text-lg">
                    Articles, insights, and stories from the community.
                </p>
            </header>

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
        <div className="mb-8 h-28 animate-pulse rounded-2xl bg-neutral-900" />
    )
}

function PostsGridSkeleton() {
    return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="h-72 animate-pulse rounded-2xl bg-neutral-900"
                />
            ))}
        </div>
    )
}

import { hive } from '@/lib/hive'
import { PostCard } from './PostCard'

interface PostsGridProps {
    searchParams: Promise<{
        category?: string
        tags?: string
        author?: string
        page?: string
    }>
}

const POSTS_PER_PAGE = 12

export async function PostsGrid({ searchParams }: PostsGridProps) {
    const params = await searchParams
    const page = parseInt(params.page || '1', 10)
    const offset = (page - 1) * POSTS_PER_PAGE

    const postsRes = await hive.listPosts({
        limit: POSTS_PER_PAGE,
        offset,
        category: params.category,
        author: params.author,
        tags: params.tags ? params.tags.split(',') : undefined,
    })

    const totalPages = Math.ceil(postsRes.total / POSTS_PER_PAGE)

    if (postsRes.data.length === 0) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                <span className="animate-bounce text-7xl">✍️</span>
                <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                    No Posts Found
                </h2>
                <p className="mt-2 text-neutral-400">
                    Try adjusting your filters to find what you&apos;re looking
                    for.
                </p>
            </div>
        )
    }

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {postsRes.data.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    category={params.category}
                    tags={params.tags}
                    author={params.author}
                />
            )}
        </div>
    )
}

function Pagination({
    currentPage,
    totalPages,
    category,
    tags,
    author,
}: {
    currentPage: number
    totalPages: number
    category?: string
    tags?: string
    author?: string
}) {
    const buildHref = (pageNum: number) => {
        const params = new URLSearchParams()
        if (category) params.set('category', category)
        if (tags) params.set('tags', tags)
        if (author) params.set('author', author)
        params.set('page', pageNum.toString())
        return `/digest?${params.toString()}`
    }

    return (
        <div className="mt-12 flex items-center justify-center gap-4">
            {currentPage > 1 && (
                <a
                    href={buildHref(currentPage - 1)}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-white/40 hover:text-white"
                >
                    Previous
                </a>
            )}

            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                        <a
                            key={pageNum}
                            href={buildHref(pageNum)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                                pageNum === currentPage
                                    ? 'bg-primary text-black'
                                    : 'border border-white/20 text-neutral-300 hover:border-white/40 hover:text-white'
                            }`}
                        >
                            {pageNum}
                        </a>
                    )
                )}
            </div>

            {currentPage < totalPages && (
                <a
                    href={buildHref(currentPage + 1)}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-white/40 hover:text-white"
                >
                    Next
                </a>
            )}
        </div>
    )
}

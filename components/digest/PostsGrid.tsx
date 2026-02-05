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
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-700 bg-neutral-900 p-16 text-center">
                <span className="text-6xl">✍️</span>
                <h2 className="mt-5 text-2xl font-semibold text-neutral-200">
                    No posts found
                </h2>
                <p className="mt-2 text-base text-neutral-500">
                    Try adjusting your filters.
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
        <div className="mt-12 flex items-center justify-center gap-3">
            {currentPage > 1 && (
                <a
                    href={buildHref(currentPage - 1)}
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-base text-neutral-400 transition hover:border-neutral-600 hover:text-white"
                >
                    Prev
                </a>
            )}

            <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                        <a
                            key={pageNum}
                            href={buildHref(pageNum)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg text-base transition ${
                                pageNum === currentPage
                                    ? 'bg-primary font-medium text-black'
                                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
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
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-base text-neutral-400 transition hover:border-neutral-600 hover:text-white"
                >
                    Next
                </a>
            )}
        </div>
    )
}

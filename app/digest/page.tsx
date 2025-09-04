import { PostCard } from '@/components/digest/digest-card'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { fetchAllDigest } from '@/lib/cms'

async function AllDigest() {
    const posts = await fetchAllDigest()
        .then((res) => res.data)
        .then((data) => (Array.isArray(data) ? data : data?.data || []))

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                Digest
            </TextScramble>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* //TODO: pagination */}
                {posts.slice(0, 9).map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>
        </main>
    )
}

export default AllDigest

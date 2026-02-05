import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostContent } from '@/components/digest/PostContent'

interface PostPageProps {
    params: Promise<{
        slug: string
    }>
}

export default function PostPage({ params }: PostPageProps) {
    return (
        <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="mb-6">
                    <Link
                        href="/digest"
                        className="flex items-center gap-2 text-neutral-400 hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to Digest
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<PostSkeleton />}>
                <PostContent params={params} />
            </Suspense>
        </main>
    )
}

function PostSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 rounded bg-neutral-800" />
            <div className="h-16 w-full rounded bg-neutral-800" />
            <div className="h-4 w-48 rounded bg-neutral-800" />
            <div className="h-64 w-full rounded bg-neutral-800" />
        </div>
    )
}

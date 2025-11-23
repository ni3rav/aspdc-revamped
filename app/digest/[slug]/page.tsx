import { ShareButton } from '@/components/digest/share-button'
import { SafeHtmlContent } from '@/components/safe-html'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchDigestBySlug, fetchAllDigest } from '@/lib/cms'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink, Twitter } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export async function generateStaticParams() {
    try {
        const response = await fetchAllDigest({ limit: 100 })
        const posts = response?.data || []
        return posts.map((post) => ({
            slug: post.slug,
        }))
    } catch (error) {
        console.error('Error generating static params:', error)
        return []
    }
}

async function DigestContent({ slug }: { slug: string }) {
    const post = await fetchDigestBySlug(slug).then((res) => res?.data)

    if (!post) {
        return (
            <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                    <span className="animate-bounce text-7xl">📰</span>
                    <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                        Post Not Found
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Looks like this digest doesn't exist yet.
                    </p>
                    <Button variant="ghost" asChild className="mt-6">
                        <Link
                            href="/digest"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Digests
                        </Link>
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="animate-in fade-in mx-auto max-w-4xl px-6 py-16 duration-500 md:py-24">
            {/* Back Button */}
            <div className="animate-in slide-in-from-left-4 mb-8 delay-100 duration-300">
                <Button
                    variant="ghost"
                    asChild
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Link href="/digest" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to posts
                    </Link>
                </Button>
            </div>

            {/* Card wrapper */}
            <div className="border-border/50 animate-in slide-in-from-bottom-10 space-y-8 rounded-2xl border bg-white/5 p-6 shadow-lg backdrop-blur-lg duration-300 md:p-8">
                {/* Top Row: Date + Share */}
                <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post?.published_at}>
                            {formatDate(
                                post?.published_at ||
                                    '2025-09-03T10:59:21.494+00:00'
                            )}
                        </time>
                    </div>
                    <ShareButton title={`Share "${post?.title}"`} />
                </div>

                {/* Title + Category */}
                <header className="space-y-4">
                    {post?.category && (
                        <Badge className="bg-primary/90 rounded-full px-3 py-1 text-sm text-white">
                            {post?.category.name}
                        </Badge>
                    )}
                    <h1 className="text-foreground text-3xl font-extrabold tracking-tight md:text-5xl">
                        {post?.title}
                    </h1>
                    {post?.excerpt && (
                        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed md:text-lg">
                            {post?.excerpt}
                        </p>
                    )}
                </header>

                {/* Cover Image */}
                {post && (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-md">
                        <Image
                            src={
                                post?.cover_image ||
                                '/placeholder.svg?height=360&width=640&query=post%20cover'
                            }
                            alt={post?.title}
                            fill
                            className="object-contain transition-transform duration-700 hover:scale-105 md:object-cover"
                            priority
                        />
                        <div className="from-background/90 via-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />
                    </div>
                )}

                {/* Authors */}
                {post?.authors?.length > 0 && (
                    <section className="border-border/40 border-t pt-6">
                        <h2 className="text-card-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
                            Written by
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {post?.authors.map((author) => (
                                <div
                                    key={author.slug}
                                    className="border-border/40 flex items-center gap-3 rounded-lg border bg-white/5 p-3 transition hover:bg-white/10"
                                >
                                    <Avatar className="ring-background h-10 w-10 overflow-hidden rounded-full ring-2">
                                        <AvatarImage
                                            src={
                                                author.image_url ||
                                                '/placeholder.svg'
                                            }
                                            alt={author.name}
                                        />
                                        <AvatarFallback className="bg-muted text-muted-foreground">
                                            {author.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-card-foreground text-sm font-semibold">
                                            {author.name}
                                        </h3>
                                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                            {author.website_url && (
                                                <a
                                                    href={author.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-foreground flex items-center gap-1"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Website
                                                </a>
                                            )}
                                            {author.twitter_url && (
                                                <a
                                                    href={author.twitter_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-foreground flex items-center gap-1"
                                                >
                                                    <Twitter className="h-3 w-3" />
                                                    Twitter
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tags */}
                {post?.tags && post?.tags.length > 0 && (
                    <section className="border-border/40 border-t pt-6">
                        <div className="flex flex-wrap justify-center gap-2">
                            {post?.tags.map((tag) => (
                                <Badge
                                    key={tag.slug}
                                    variant="outline"
                                    className="hover:bg-primary/20 hover:text-primary rounded-full px-3 py-1 text-xs transition-colors"
                                >
                                    #{tag.name}
                                </Badge>
                            ))}
                        </div>
                    </section>
                )}

                {/* Article Content */}
                <article className="prose prose-base md:prose-lg prose-neutral dark:prose-invert animate-in fade-in slide-in-from-bottom-4 max-w-none">
                    <SafeHtmlContent
                        content={
                            post?.html_content ||
                            '<h1>Oops no content available.</h1>'
                        }
                    />
                </article>
            </div>
        </main>
    )
}

export default async function Digest({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    return (
        <Suspense
            fallback={
                <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-muted-foreground text-center">
                            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                            <p>Loading digest...</p>
                        </div>
                    </div>
                </main>
            }
        >
            <DigestContent slug={slug} />
        </Suspense>
    )
}

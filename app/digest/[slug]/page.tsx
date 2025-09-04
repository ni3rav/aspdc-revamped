import { ShareButton } from '@/components/digest/share-button'
import { SafeHtmlContent } from '@/components/safe-html'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchDigestBySlug } from '@/lib/cms'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { ArrowLeft, Calendar, ExternalLink, Link, Twitter } from 'lucide-react'
import Image from 'next/image'

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default async function Digest({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    const post = await fetchDigestBySlug(slug).then((res) => res?.data)

    return (
        <>
            <div className="bg-background animate-in fade-in min-h-screen duration-500">
                <div className="container mx-auto max-w-4xl px-4 py-8">
                    {/* Back Button */}
                    <div className="animate-in slide-in-from-left-4 mb-8 delay-100 duration-300">
                        <Button
                            variant="ghost"
                            asChild
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Link
                                href="/digest"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to posts
                            </Link>
                        </Button>
                    </div>

                    {/* Cover Image */}
                    {post?.cover_image && (
                        <div className="animate-in zoom-in-95 mb-8 overflow-hidden rounded-lg delay-200 duration-500">
                            <Image
                                src={post?.cover_image || '/placeholder.svg'}
                                alt={post?.title}
                                width={800}
                                height={400}
                                className="h-64 w-full object-cover md:h-96"
                            />
                        </div>
                    )}

                    {/* Article Header */}
                    <header className="animate-in fade-in slide-in-from-bottom-4 mb-8 delay-300 duration-500">
                        {/* Category */}
                        {post?.category && (
                            <Badge variant="secondary" className="mb-4">
                                {post?.category.name}
                            </Badge>
                        )}

                        {/* Title */}
                        <h1 className="text-foreground mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                            {post?.title}
                        </h1>

                        {/* Excerpt */}
                        {post?.excerpt && (
                            <p className="text-muted-foreground mb-6 text-lg leading-relaxed text-pretty">
                                {post?.excerpt}
                            </p>
                        )}

                        {/* Meta Information */}
                        <div className="text-muted-foreground flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
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
                    </header>

                    {/* Authors */}
                    <section className="bg-card border-border animate-in fade-in slide-in-from-bottom-4 mb-8 rounded-lg border p-6 delay-500 duration-500">
                        <h2 className="text-card-foreground mb-4 text-lg font-semibold">
                            Written by
                        </h2>
                        <div className="space-y-4">
                            {post?.authors.map((author) => (
                                <div
                                    key={author.slug}
                                    className="flex items-start gap-4"
                                >
                                    <Avatar className="ring-background h-12 w-12 ring-2">
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
                                    <div className="flex-1">
                                        <h3 className="text-card-foreground font-medium">
                                            {author.name}
                                        </h3>
                                        {author.bio && (
                                            <p className="text-muted-foreground mb-2 text-sm">
                                                {author.bio}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3">
                                            {author.website_url && (
                                                <a
                                                    href={author.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
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
                                                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
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

                    {/* Tags */}
                    {post?.tags && post?.tags.length > 0 && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 mb-8 delay-700 duration-500">
                            <div className="flex flex-wrap gap-2">
                                {post?.tags.map((tag) => (
                                    <Badge
                                        key={tag.slug}
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        #{tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Article Content */}
                    <article className="prose prose-neutral dark:prose-invert animate-in fade-in slide-in-from-bottom-4 max-w-none delay-1000 duration-500">
                        <SafeHtmlContent
                            content={
                                post?.html_content ||
                                '<h1>Oops no content, how this coming up huihui</h1>'
                            }
                        />
                    </article>
                </div>
            </div>
        </>
    )
}

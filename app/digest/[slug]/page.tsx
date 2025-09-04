import { ShareButton } from '@/components/digest/share-button'
import { SafeHtmlContent } from '@/components/safe-html'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fetchDigestBySlug } from '@/lib/cms'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink, Twitter } from 'lucide-react'
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
                        <div className="relative mb-12 overflow-hidden rounded-2xl">
                            <Image
                                src={post?.cover_image || '/placeholder.svg'}
                                alt={post?.title}
                                width={1200}
                                height={600}
                                className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105 md:h-[28rem]"
                                priority
                            />
                            <div className="from-background/70 via-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />
                        </div>
                    )}

                    {/* Article Header */}
                    <header className="animate-in fade-in slide-in-from-bottom-4 mb-12 space-y-6 text-center delay-200 duration-500">
                        {post?.category && (
                            <Badge
                                variant="secondary"
                                className="rounded-full px-3 py-1 text-sm"
                            >
                                {post?.category.name}
                            </Badge>
                        )}
                        <h1 className="text-foreground text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                            {post?.title}
                        </h1>
                        {post?.excerpt && (
                            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
                                {post?.excerpt}
                            </p>
                        )}
                        <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
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
                    <section className="bg-card border-border animate-in fade-in slide-in-from-bottom-4 mb-12 rounded-2xl border p-8 shadow-sm">
                        <h2 className="text-card-foreground mb-6 text-lg font-semibold tracking-wide uppercase">
                            Written by
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {post?.authors.map((author) => (
                                <div
                                    key={author.slug}
                                    className="border-border/60 hover:bg-muted/30 flex items-center gap-4 rounded-xl border p-4 transition-colors"
                                >
                                    <Avatar className="ring-background h-14 w-14 overflow-hidden rounded-full ring-2">
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
                                        <h3 className="text-card-foreground text-base font-semibold">
                                            {author.name}
                                        </h3>
                                        {author.bio && (
                                            <p className="text-muted-foreground mb-1 line-clamp-2 text-sm">
                                                {author.bio}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 text-xs">
                                            {author.website_url && (
                                                <a
                                                    href={author.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
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
                                                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
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
                        <section className="animate-in fade-in slide-in-from-bottom-4 mb-12 delay-700 duration-500">
                            <div className="flex flex-wrap justify-center gap-2">
                                {post?.tags.map((tag) => (
                                    <Badge
                                        key={tag.slug}
                                        variant="outline"
                                        className="hover:bg-accent hover:text-accent-foreground rounded-full px-3 py-1 text-xs transition-colors"
                                    >
                                        #{tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Article Content */}
                    <article className="prose prose-lg prose-neutral dark:prose-invert animate-in fade-in slide-in-from-bottom-4 max-w-none delay-1000 duration-500">
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

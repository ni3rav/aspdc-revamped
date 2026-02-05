import { hive } from '@/lib/hive'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { sanitizePostHtml } from '@/lib/sanitize'

interface PostContentProps {
    params: Promise<{
        slug: string
    }>
}

export async function PostContent({ params }: PostContentProps) {
    const { slug } = await params

    let post
    try {
        post = await hive.getPost(slug)
    } catch {
        notFound()
    }

    const sanitizedContent = sanitizePostHtml(post.htmlContent)

    const date = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : null

    return (
        <article>
            <header className="mb-10">
                {post.category && (
                    <Badge
                        variant="outline"
                        className="border-primary text-primary mb-5 h-8 px-3 text-sm font-medium tracking-wide uppercase"
                    >
                        {post.category.name}
                    </Badge>
                )}

                <h1 className="mb-5 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-base text-neutral-400">
                    {post.author && (
                        <span className="flex items-center gap-2">
                            <User size={18} />
                            {post.author.name}
                        </span>
                    )}
                    {date && (
                        <>
                            <span className="text-neutral-600">·</span>
                            <span className="flex items-center gap-2">
                                <Calendar size={18} />
                                {date}
                            </span>
                        </>
                    )}
                </div>

                {post.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Link
                                key={tag.slug}
                                href={`/digest?tags=${tag.slug}`}
                            >
                                <Badge
                                    variant="outline"
                                    className="h-8 border-neutral-700 px-3 text-sm text-neutral-400 transition hover:border-neutral-600 hover:text-neutral-200"
                                >
                                    <Tag size={14} className="mr-1.5" />
                                    {tag.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 sm:p-10">
                <div
                    className="prose prose-lg prose-invert prose-neutral prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-base prose-pre:bg-neutral-800 max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
            </div>
        </article>
    )
}

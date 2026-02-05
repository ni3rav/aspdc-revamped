import { hive } from '@/lib/hive'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, User, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import sanitizeHtml from 'sanitize-html'

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

    const sanitizedContent = sanitizeHtml(post.htmlContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'img',
            'h1',
            'h2',
            'h3',
            'code',
            'pre',
        ]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title'],
            code: ['class'],
            pre: ['class'],
        },
    })

    const date = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : null

    return (
        <article className="rounded-2xl border border-white/20 bg-neutral-900/40 backdrop-blur-sm">
            <div className="border-b border-white/10 p-6 sm:p-8 lg:p-10">
                {post.category && (
                    <Badge
                        variant="outline"
                        className="border-primary/30 text-primary mb-4"
                    >
                        {post.category.name}
                    </Badge>
                )}

                <h1 className="mb-6 text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                    {post.author && (
                        <span className="flex items-center gap-2">
                            <User size={16} />
                            {post.author.name}
                        </span>
                    )}
                    {date && (
                        <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {date}
                        </span>
                    )}
                </div>

                {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Link
                                key={tag.slug}
                                href={`/digest?tags=${tag.slug}`}
                            >
                                <Badge
                                    variant="outline"
                                    className="border-white/20 text-neutral-400 hover:border-white/40 hover:text-white"
                                >
                                    <Tag size={12} className="mr-1" />
                                    {tag.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="prose prose-invert max-w-none p-6 sm:p-8 lg:p-10">
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>
        </article>
    )
}

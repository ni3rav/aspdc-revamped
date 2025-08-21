'use client'
import { BlogCard, AddBlogCard } from '@/components/admin/blog-card'
import { useBlogs } from '@/hooks/useBlogs'

export default function BlogsPage() {
    const { data: blogs, isLoading, error } = useBlogs()

    if (isLoading)
        return (
            <div className="text-muted-foreground text-center">
                Loading blogs...
            </div>
        )
    if (error)
        return (
            <div className="text-destructive text-center">
                Error loading blogs
            </div>
        )

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-foreground mb-8 text-3xl font-bold">
                Blog Articles
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Add new blog card */}
                <AddBlogCard />

                {/* Display existing blogs */}
                {blogs?.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>

            {blogs?.length === 0 && (
                <p className="text-muted-foreground mt-8 text-center">
                    No blog articles yet. Add your first article!
                </p>
            )}
        </div>
    )
}

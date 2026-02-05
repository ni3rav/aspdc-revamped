import { z } from 'zod'

const BASE_URL = 'https://api.hivecms.online/api/public/v1'

// Error handling
export class HiveError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: Response
    ) {
        super(message)
        this.name = 'HiveError'
    }
}

// Types (matching docs exactly)
const CategoryShape = z.object({
    name: z.string(),
    slug: z.string(),
})

const TagShape = z.object({
    name: z.string(),
    slug: z.string(),
})

const AuthorShape = z.object({
    id: z.string(),
    name: z.string(),
    about: z.string(),
    socialLinks: z.object({}).passthrough(),
})

const PostSummaryShape = z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    publishedAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    category: CategoryShape.nullable(),
    tags: z.array(TagShape),
    author: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .nullable(),
})

const PostDetailShape = PostSummaryShape.extend({
    htmlContent: z.string(),
})

const PostListResponseShape = z.object({
    data: z.array(PostSummaryShape),
    total: z.number(),
    offset: z.number(),
    limit: z.number(),
})

const TagCategoryResponseShape = z.object({
    data: z.array(TagShape),
})

const AuthorResponseShape = z.object({
    data: z.array(AuthorShape),
})

const StatsShape = z.object({
    totalPosts: z.number(),
    totalAuthors: z.number(),
    totalCategories: z.number(),
    totalTags: z.number(),
})

const ErrorResponseShape = z.object({
    message: z.string(),
})

// Export types (matching docs exactly)
export type Category = { name: string; slug: string }
export type Tag = { name: string; slug: string }
export type Author = {
    id: string
    name: string
    about: string
    socialLinks: Record<string, unknown>
}
export type PostSummary = {
    title: string
    slug: string
    excerpt: string
    publishedAt: string | null
    updatedAt: string | null
    category: { name: string; slug: string } | null
    tags: Array<{ name: string; slug: string }>
    author: { id: string; name: string } | null
}
export type PostDetail = PostSummary & { htmlContent: string }
export type PostListResponse = {
    data: PostSummary[]
    total: number
    offset: number
    limit: number
}
export type TagCategoryResponse = { data: Tag[] }
export type AuthorResponse = { data: Author[] }
export type Stats = {
    totalPosts: number
    totalAuthors: number
    totalCategories: number
    totalTags: number
}
export type ErrorResponse = { message: string }

// Query parameter types
export interface ListPostsParams {
    limit?: number
    offset?: number
    category?: string
    tags?: string[]
    author?: string
}

// Client class
export class HiveClient {
    private apiKey: string
    private baseUrl: string

    constructor(apiKey: string, baseUrl: string = BASE_URL) {
        this.apiKey = apiKey
        this.baseUrl = baseUrl
    }

    private buildUrl(path: string, params?: Record<string, unknown>): string {
        const url = new URL(`${this.baseUrl}/${this.apiKey}${path}`)

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (Array.isArray(value)) {
                        url.searchParams.append(key, value.join(','))
                    } else {
                        url.searchParams.append(key, String(value))
                    }
                }
            })
        }

        return url.toString()
    }

    private async fetch<T>(url: string, schema: z.ZodSchema<T>): Promise<T> {
        const response = await fetch(url, {
            headers: {
                Accept: 'application/json',
            },
        })

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}`

            try {
                const errorData = await response.json()
                const parsed = ErrorResponseShape.safeParse(errorData)
                if (parsed.success) {
                    errorMessage = parsed.data.message
                }
            } catch {
                // ignore
            }

            throw new HiveError(errorMessage, response.status, response)
        }

        const data = await response.json()
        const result = schema.safeParse(data)

        if (!result.success) {
            throw new HiveError(
                `Invalid response format: ${result.error.message}`,
                500
            )
        }

        return result.data
    }

    // Posts
    async listPosts(params: ListPostsParams = {}): Promise<PostListResponse> {
        const queryParams: Record<string, unknown> = {
            limit: params.limit,
            offset: params.offset,
            category: params.category,
            author: params.author,
        }

        if (params.tags && params.tags.length > 0) {
            queryParams.tags = params.tags
        }

        const url = this.buildUrl('/posts', queryParams)
        return this.fetch(url, PostListResponseShape)
    }

    async getPost(slug: string): Promise<PostDetail> {
        const url = this.buildUrl(`/posts/${encodeURIComponent(slug)}`)
        return this.fetch(url, PostDetailShape)
    }

    // Categories
    async listCategories(): Promise<Category[]> {
        const url = this.buildUrl('/categories')
        const response = await this.fetch(url, TagCategoryResponseShape)
        return response.data
    }

    // Tags
    async listTags(): Promise<Tag[]> {
        const url = this.buildUrl('/tags')
        const response = await this.fetch(url, TagCategoryResponseShape)
        return response.data
    }

    // Authors
    async listAuthors(): Promise<Author[]> {
        const url = this.buildUrl('/authors')
        const response = await this.fetch(url, AuthorResponseShape)
        return response.data
    }

    // Stats
    async getStats(): Promise<Stats> {
        const url = this.buildUrl('/stats')
        return this.fetch(url, StatsShape)
    }

    // Paginated helper for posts
    async *paginatePosts(
        params: Omit<ListPostsParams, 'offset'> = {}
    ): AsyncGenerator<PostSummary, void, unknown> {
        let offset = 0
        const limit = params.limit || 20

        while (true) {
            const response = await this.listPosts({ ...params, limit, offset })

            for (const post of response.data) {
                yield post
            }

            if (offset + response.data.length >= response.total) {
                break
            }

            offset += limit
        }
    }

    // Helper to get all posts at once (be careful with large datasets)
    async getAllPosts(
        params: Omit<ListPostsParams, 'offset' | 'limit'> = {}
    ): Promise<PostSummary[]> {
        const posts: PostSummary[] = []
        for await (const post of this.paginatePosts(params)) {
            posts.push(post)
        }
        return posts
    }
}

// Convenience factory function
export function createHiveClient(apiKey: string, baseUrl?: string): HiveClient {
    return new HiveClient(apiKey, baseUrl)
}

// Pre-configured client using HIVE_API_KEY env variable
// Only use this in server-side code (Server Components, API Routes, Server Actions)
function getHiveClient(): HiveClient {
    const apiKey = process.env.HIVE_API_KEY
    if (!apiKey) {
        throw new Error(
            'HIVE_API_KEY environment variable is not set. ' +
                'Add it to your .env.local file: HIVE_API_KEY=your-key-here'
        )
    }
    return new HiveClient(apiKey)
}

// Exported singleton instance - use this throughout your app
export const hive = getHiveClient()

// Default export
export default HiveClient

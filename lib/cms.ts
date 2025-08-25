import { createZenblogClient } from 'zenblog'

const zenblog = createZenblogClient({ blogId: process.env.ZENBLOG_BLOG_ID! })

// get all digests
type fetchDigestParams = {
    limit?: number
    offset?: number
    category?: string
}

export async function fetchAllDigest({
    limit = 10,
    offset = 0,
    category,
}: fetchDigestParams = {}) {
    try {
        const digest = await zenblog.posts.list({
            limit,
            offset,
            category,
        })
        return { success: true, data: digest }
    } catch (error) {
        console.error(error)
        return { success: false, data: [] }
    }
}

// get digest by slug
export async function fetchDigestBySlug(slug: string) {
    try {
        const post = await zenblog.posts.get({ slug })
        return { success: true, data: post }
    } catch (error) {
        console.error(error)
        return { success: false, data: [] }
    }
}

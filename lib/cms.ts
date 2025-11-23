import { cacheLife } from 'next/cache'
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
    'use cache'
    cacheLife('hours')

    try {
        const digest = await zenblog.posts.list({
            limit,
            offset,
            category,
        })
        return digest
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function fetchDigestBySlug(slug: string) {
    'use cache'
    cacheLife('hours')

    try {
        const post = await zenblog.posts.get({ slug })
        return post
    } catch (error) {
        console.error(error)
        return null
    }
}

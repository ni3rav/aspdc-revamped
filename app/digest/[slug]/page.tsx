import { fetchDigestBySlug } from '@/lib/cms'

export default async function Digest({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const resolvedParams = await params
    const { slug } = resolvedParams

    const data = await fetchDigestBySlug(slug).then((post) =>
        JSON.stringify(post)
    )

    return <div>{data}</div>
}

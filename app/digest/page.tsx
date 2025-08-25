import { fetchAllDigest } from '@/lib/cms'

async function AllDigest() {
    const posts = await fetchAllDigest()
    const data = JSON.stringify(posts)
    return <div>{data}</div>
}

export default AllDigest

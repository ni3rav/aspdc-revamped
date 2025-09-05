import OtherPosts from '@/components/digest/OtherPosts'
import { TextScramble } from '@/components/motion-primitives/text-scramble'
import { fetchAllDigest } from '@/lib/cms'
import Image from 'next/image'

async function AllDigest() {
    const posts = await fetchAllDigest().then((res) => res?.data)
    // const posts = [
    //     {
    //         "title": "post 4",
    //         "slug": "post-4",
    //         "published_at": "2025-09-03T10:59:21.494+00:00",
    //         "excerpt": "excerpt 4",
    //         "cover_image": "",
    //         "tags": [],
    //         "authors": [
    //             {
    //                 "slug": "ni3rav",
    //                 "name": "Nirav",
    //                 "image_url": "https://images.zenblog.com/authors/ni3rav-363843.jpeg",
    //                 "bio": "god's favourite idiot",
    //                 "website": "https://ni3rav.me",
    //                 "twitter": "https://x.com/ni3rav",
    //                 "website_url": "https://ni3rav.me",
    //                 "twitter_url": "https://x.com/ni3rav"
    //             }
    //         ],
    //         "category": null
    //     },
    //     {
    //         "title": "post 3",
    //         "slug": "post-3",
    //         "published_at": "2025-09-03T10:58:23.491+00:00",
    //         "excerpt": "excerpt 3",
    //         "cover_image": "",
    //         "tags": [],
    //         "authors": [
    //             {
    //                 "slug": "ni3rav",
    //                 "name": "Nirav",
    //                 "image_url": "https://images.zenblog.com/authors/ni3rav-363843.jpeg",
    //                 "bio": "god's favourite idiot",
    //                 "website": "https://ni3rav.me",
    //                 "twitter": "https://x.com/ni3rav",
    //                 "website_url": "https://ni3rav.me",
    //                 "twitter_url": "https://x.com/ni3rav"
    //             }
    //         ],
    //         "category": {
    //             "name": "demo",
    //             "slug": "demo"
    //         }
    //     },
    //     {
    //         "title": "post 2",
    //         "slug": "post-2",
    //         "published_at": "2025-09-03T10:57:09.874+00:00",
    //         "excerpt": "excerpt 2",
    //         "cover_image": "",
    //         "tags": [],
    //         "authors": [
    //             {
    //                 "slug": "ni3rav",
    //                 "name": "Nirav",
    //                 "image_url": "https://images.zenblog.com/authors/ni3rav-363843.jpeg",
    //                 "bio": "god's favourite idiot",
    //                 "website": "https://ni3rav.me",
    //                 "twitter": "https://x.com/ni3rav",
    //                 "website_url": "https://ni3rav.me",
    //                 "twitter_url": "https://x.com/ni3rav"
    //             }
    //         ],
    //         "category": {
    //             "name": "demo",
    //             "slug": "demo"
    //         }
    //     },
    //     {
    //         "title": "post 1",
    //         "slug": "post-1",
    //         "published_at": "2025-09-03T10:56:04.274+00:00",
    //         "excerpt": "excerpt 1",
    //         "cover_image": "",
    //         "tags": [],
    //         "authors": [
    //             {
    //                 "slug": "ni3rav",
    //                 "name": "Nirav",
    //                 "image_url": "https://images.zenblog.com/authors/ni3rav-363843.jpeg",
    //                 "bio": "god's favourite idiot",
    //                 "website": "https://ni3rav.me",
    //                 "twitter": "https://x.com/ni3rav",
    //                 "website_url": "https://ni3rav.me",
    //                 "twitter_url": "https://x.com/ni3rav"
    //             }
    //         ],
    //         "category": {
    //             "name": "demo",
    //             "slug": "demo"
    //         }
    //     }
    // ]
    if (!posts || posts.length === 0) {
        return (
            <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
                <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                    DIGEST
                </TextScramble>
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center">
                    <span className="animate-bounce text-7xl">📰</span>
                    <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                        No Digests Yet
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Stay tuned — fresh articles will appear here soon!
                    </p>
                </div>
            </main>
        )
    }
    const latestPost = posts.splice(0, 1)[0]

    return (
        <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase md:mb-16 lg:text-4xl">
                DIGEST
            </TextScramble>

            {/* Featured Post */}
            <div className="group mb-16 grid items-center gap-8 rounded-lg bg-white/3 backdrop-blur-sm md:grid-cols-2">
                {/* Left - Image */}
                <div className="relative overflow-hidden rounded-xl shadow-md">
                    <Image
                        src={latestPost.cover_image || '/placeholder.svg'}
                        alt={latestPost.title}
                        width={600}
                        height={400}
                        className="h-[300px] w-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                </div>

                {/* Right - Details */}
                <div className="flex flex-col justify-center gap-4">
                    {latestPost.category && (
                        <span className="bg-primary/90 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium text-white">
                            {latestPost.category.name}
                        </span>
                    )}

                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                        {latestPost.title}
                    </h2>

                    <p className="text-sm text-gray-200">
                        {latestPost.excerpt}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-300">
                        <Image
                            src={latestPost.authors[0].image_url}
                            alt={latestPost.authors[0].name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="font-medium">
                            {latestPost.authors[0].name}
                        </span>
                        <span>•</span>
                        <time>
                            {new Date(
                                latestPost.published_at
                            ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </time>
                    </div>
                </div>
            </div>

            <div className="bg-primary/40 my-10 h-1 w-full rounded-full md:hidden" />

            <OtherPosts latestPost={latestPost} posts={posts} />
        </main>
    )
}

export default AllDigest

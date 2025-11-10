import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.zenblog.com',
            },
            {
                protocol: 'https',
                hostname: 'files.catbox.moe',
            },
            {
                protocol: 'https',
                hostname: 'ibb.co',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
    },
}

export default nextConfig

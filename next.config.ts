import type { NextConfig } from 'next'

/**
 * Next.js Configuration
 *
 * Optimized configuration for performance and user experience
 */
const nextConfig: NextConfig = {
    // Disable automatic scroll restoration to ensure pages load from top
    experimental: {
        scrollRestoration: false,
    },

    // Image optimization settings
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
}

export default nextConfig

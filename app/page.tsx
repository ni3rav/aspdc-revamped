import Hero from '@/components/layout/Hero'
import AboutSection from '@/components/layout/AboutSection'
import { FlowingGallery } from '@/components/ui/FlowingGallery'
import ScrollTo from '@/components/ui/ScrollTo'
import Footer from '@/components/layout/footer'
import ScrollVelocity from '@/components/ui/VelocityText'
import FAQ from '@/components/ui/FAQ'
import SmoothScrolling from '@/components/ui/SmoothScrolling'
import PageManager from '@/components/ui/PageManager'
import { Suspense } from 'react'

/**
 * Gallery items configuration
 * Contains the data for the interactive memory gallery
 * Optimized with proper alt text for accessibility
 */
const galleryItems = [
    { text: 'Ingenious', image: '/main1.jpg', alt: 'ASPDC Ingenious Event' },
    {
        text: 'Ingenious Winner',
        image: '/main2.jpg',
        alt: 'Ingenious Competition Winners',
    },
    {
        text: 'Code Charades',
        image: '/main3.jpg',
        alt: 'Code Charades Programming Event',
    },
    {
        text: 'Code Charades 2.0',
        image: '/main4.jpg',
        alt: 'Code Charades Second Edition',
    },
]

/**
 * Loading fallback component for better performance
 */
const LoadingFallback = () => (
    <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-primary animate-pulse">Loading...</div>
    </div>
)

/**
 * Main Page Component
 * Landing page with Hero section, About section, and interactive gallery
 * Fully responsive and optimized for all devices
 *
 * Features:
 * - Insanely smooth scrolling with Lenis
 * - Auto-scroll back to Hero section
 * - Performance optimized with Suspense boundaries
 * - Prevents AboutSection flash on load via PageManager
 */
const page = () => {
    return (
        <PageManager>
            {/* ScrollTo component ensures page loads from top - MUST BE FIRST */}
            <ScrollTo />

            {/* Smooth scrolling provider - initialized after scroll position is set */}
            <SmoothScrolling />

            {/* Hero Section - First impression with main branding */}
            <Suspense fallback={<LoadingFallback />}>
                <Hero />
            </Suspense>

            {/* About Section - Organization information and mission */}
            <Suspense fallback={<LoadingFallback />}>
                <AboutSection />
            </Suspense>

            {/* Interactive Gallery Section - Memories showcase */}
            <section
                className="relative min-h-[400px] w-full sm:min-h-[500px] md:min-h-[600px]"
                aria-label="Memories Gallery"
            >
                <Suspense fallback={<LoadingFallback />}>
                    <FlowingGallery items={galleryItems} />
                </Suspense>
            </section>

            {/* Velocity Text Animation - Responsive marquee */}
            <div className="w-full overflow-hidden">
                <Suspense fallback={<LoadingFallback />}>
                    <ScrollVelocity
                        texts={[
                            'ASPDC • Code • Innovation',
                            'Learn • Grow • Connect',
                        ]}
                        velocity={50}
                        className="text-primary/70"
                        numCopies={4}
                    />
                </Suspense>
            </div>

            {/* FAQ Section - Responsive design */}
            <Suspense fallback={<LoadingFallback />}>
                <FAQ />
            </Suspense>

            {/* Footer Section - Playful, branded, animated */}
            <Suspense fallback={<LoadingFallback />}>
                <Footer />
            </Suspense>
        </PageManager>
    )
}

export default page

import Hero from '@/components/layout/Hero'
import AboutSection from '@/components/layout/AboutSection'
import { FlowingGallery } from '@/components/ui/FlowingGallery'
import ScrollTo from '@/components/ui/ScrollTo'

/**
 * Gallery items configuration
 * Contains the data for the interactive memory gallery
 */
const galleryItems = [
    { text: 'Ingenious', image: '/main1.jpg' },
    { text: 'Ingenious Winner', image: '/main2.jpg' },
    { text: 'Code Charades', image: '/main3.jpg' },
    { text: 'Code Charades 2.0', image: '/main4.jpg' },
]

/**
 * Main Page Component
 * Landing page with Hero section, About section, and interactive gallery
 *
 * Uses ScrollTo component to ensure page loads from Hero section
 */
const page = () => {
    return (
        <div className="min-h-dvh w-screen">
            {/* ScrollTo component ensures page loads from top */}
            <ScrollTo />

            {/* Hero Section - First impression with main branding */}
            <Hero />

            {/* About Section - Organization information and mission */}
            <AboutSection />

            {/* Interactive Gallery Section - Memories showcase */}
            <section
                className="relative h-[600px]"
                aria-label="Memories Gallery"
            >
                <FlowingGallery items={galleryItems} />
            </section>
        </div>
    )
}

export default page

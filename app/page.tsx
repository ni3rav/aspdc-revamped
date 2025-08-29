import Hero from '@/components/layout/Hero'
import AboutSection from '@/components/layout/AboutSection'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const page = () => {
    return (
        <div className="min-h-dvh w-screen">
            <Hero />
            <AboutSection />
        </div>
    )
}

export default page

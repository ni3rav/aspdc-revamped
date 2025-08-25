import Hero from '@/components/layout/Hero'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const page = () => {
    return (
        <div className="min-h-dvh w-screen">
            <Hero />
        </div>
    )
}

export default page

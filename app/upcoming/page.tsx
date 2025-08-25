import { TextScramble } from '@/components/motion-primitives/text-scramble'

export default function page() {
    return (
        <main className="mx-auto max-w-5xl px-8 py-12 md:py-32 lg:px-0">
            <TextScramble className="text-primary mb-8 text-2xl font-bold uppercase underline underline-offset-5 md:mb-16 lg:text-4xl">
                Mark Your Calenders
            </TextScramble>
        </main>
    )
}

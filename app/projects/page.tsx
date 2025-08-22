import React from 'react'
import { Dcardcode } from '@/components/Dcardcode'
import { TextScramble } from '@/components/motion-primitives/text-scramble'

const page = () => {
    return (
        <main className='py-12 md:py-32'>
            <div className='mx-auto max-w-5xl px-8 lg:px-0'>
                <TextScramble className="mb-8 text-primary uppercase text-4xl font-bold md:mb-16 lg:text-5xl">Projects By The Team</TextScramble>
            </div>
            <Dcardcode title='Make things float in air' description='Hover over this card to unleash the power of CSS perspective' imgUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" button='View More' />
        </main>
    )
}

export default page
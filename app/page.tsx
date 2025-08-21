import DotGrid from '@/components/bits/DotGrid/DotGrid'
import Navbar from '@/components/layout/Navbar'
import React from 'react'

const page = () => {
    return (
        <main className='min-h-dvh w-screen relative'>
            <Navbar />
            <div className='fixed inset-0 -z-10'>
                <DotGrid dotSize={10} baseColor='#111111' activeColor='#23C55E' className='h-full w-full' />
            </div>
        </main>
    )
}

export default page
'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
    const pathname = usePathname()

    // Hide navbar on admin routes and login/signup pages
    if (
        pathname?.startsWith('/admin') ||
        pathname === '/login' ||
        pathname === '/signup'
    ) {
        return null
    }

    return <Navbar />
}

import React from 'react'
import { NavBar } from '../ui/tubelight-navbar'

const Navbar = () => {
    const navItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Projects', url: '/' },
        { name: 'Digest', url: '/' },
    ]
    return (
        <NavBar items={navItems} className="text-white secnone" />
    )
}

export default Navbar
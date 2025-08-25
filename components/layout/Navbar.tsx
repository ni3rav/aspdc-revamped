import React from 'react'
import { NavBar } from '../ui/tubelight-navbar'

const Navbar = () => {
    const navItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Projects', url: '/projects' },
        { name: 'Digest', url: '/digest' },
    ]
    return <NavBar items={navItems} className="secnone text-white" />
}

export default Navbar

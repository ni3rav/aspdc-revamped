import React from 'react'
import { NavBar } from '../ui/tubelight-navbar'

const Navbar = () => {
    const navItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/' },
        { name: 'Events', url: '/' },
        { name: 'Gallery', url: '/' },
        { name: 'Projects', url: '/' },
        { name: 'Leaderboard', url: '/' },
    ]
    return (
        <NavBar items={navItems} className="text-white" />
    )
}

export default Navbar
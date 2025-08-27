import React, { useEffect, useState } from 'react'
import { NavBar } from '../ui/tubelight-navbar'
import MobileNavbar from '../ui/MobileNavbar'
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import Image from "next/Image";
// import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
    const navItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Projects', url: '/projects' },
        { name: 'Digest', url: '/digest' },
    ]

    return (
        <div>
            {/* desktop navbar */}
            <div className="hidden md:block">
                <NavBar items={navItems} className="secnone text-white" />
            </div>

            {/* mobile navbar*/}
            <div className="block md:hidden">
                <MobileNavbar items={navItems} />
            </div>
        </div>
    )
}

export default Navbar

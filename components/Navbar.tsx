import MobileNavbar from './MobileNavbar'
import { NavBar } from './ui/tubelight-navbar'

const Navbar = () => {
    const navItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Projects', url: '/projects' },
        { name: 'Blogs', url: '/blogs' },
        { name: 'Digest', url: '/digest' },
        { name: 'Achievments', url: '/achievements' },
    ]

    return (
        <div>
            {/* desktop navbar */}
            <div className="hidden md:block">
                <NavBar items={navItems} className="text-white" />
            </div>

            {/* mobile navbar*/}
            <div className="block md:hidden">
                <MobileNavbar items={navItems} />
            </div>
        </div>
    )
}

export default Navbar

import MobileNavbar from './MobileNavbar'
import { NavBar } from './ui/tubelight-navbar'

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
            <div className="hidden sm:block">
                <NavBar items={navItems} className="text-white" />
            </div>

            {/* mobile navbar*/}
            <div className="block sm:hidden">
                <MobileNavbar items={navItems} />
            </div>
        </div>
    )
}

export default Navbar

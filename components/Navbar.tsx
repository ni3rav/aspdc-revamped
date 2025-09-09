import MobileNavbar from './MobileNavbar'
import { NavBarLg, NavBarMd } from './ui/tubelight-navbar'

const Navbar = () => {
    const lgNavItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Achievments', url: '/achievements' },
        { name: 'Projects', url: '/projects' },
        { name: 'Blogs', url: '/blogs' },
        { name: 'Digest', url: '/digest' },
        { name: 'Leaderboard', url: '/leaderboard' },
    ]

    const mdNavItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Achievments', url: '/achievements' },
    ]

    return (
        <div>
            {/* desktop navbar */}
            <div className="hidden lg:block">
                <NavBarLg items={lgNavItems} className="text-white" />
            </div>

            <div className="hidden md:block lg:hidden">
                <NavBarMd items={mdNavItems} className="text-white" />
            </div>

            {/* mobile navbar*/}
            <div className="block md:hidden">
                <MobileNavbar items={lgNavItems} />
            </div>
        </div>
    )
}

export default Navbar

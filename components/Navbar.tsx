import MobileNavbar from './MobileNavbar'
import { NavBarLg, NavBarXl } from './ui/tubelight-navbar'

const Navbar = () => {
    const xlNavItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Achievments', url: '/achievements' },
        { name: 'Projects', url: '/projects' },
        { name: 'Blogs', url: '/blogs' },
        // { name: 'Digest', url: '/digest' },
        // { name: 'Leaderboard', url: '/leaderboard' },
    ]

    const lgNavItems = [
        { name: 'Home', url: '/' },
        { name: 'Team', url: '/team' },
        { name: 'Upcoming', url: '/upcoming' },
        { name: 'Events', url: '/events' },
        { name: 'Achievments', url: '/achievements' },
    ]

    return (
        <div>
            {/* desktop navbar */}
            <div className="hidden xl:block">
                <NavBarXl items={xlNavItems} className="text-white" />
            </div>

            <div className="hidden md:block xl:hidden">
                <NavBarLg items={lgNavItems} className="text-white" />
            </div>

            {/* mobile navbar*/}
            <div className="block md:hidden">
                <MobileNavbar items={lgNavItems} />
            </div>
        </div>
    )
}

export default Navbar

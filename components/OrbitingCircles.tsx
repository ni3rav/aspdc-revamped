'use client'

import {
    SiKeras,
    SiReact,
    SiTailwindcss,
    SiFigma,
    SiGit,
    SiGithub,
    SiPython,
} from 'react-icons/si'
import { BiLogoVisualStudio } from 'react-icons/bi'
import { OrbitingCircles } from './magicui/orbiting-circles'
import ScrambledText from './bits/ScrambledText/ScrambledText'

type IconKey = keyof typeof Icons

type OrbitConfig = {
    Icon: IconKey
    radius: number
    delay: number
    duration: number
    reverse?: boolean
}

export default function OrbitingCirclesComp() {
    const orbitConfigs: OrbitConfig[] = [
        { Icon: 'gitHub', radius: 120, delay: 0, duration: 18 },
        { Icon: 'keras', radius: 120, delay: 8, duration: 21 },
        { Icon: 'react', radius: 180, delay: 16, duration: 26, reverse: true },
        {
            Icon: 'tailwind',
            radius: 180,
            delay: 24,
            duration: 29,
            reverse: true,
        },
        { Icon: 'figma', radius: 180, delay: 32, duration: 30, reverse: true },
        { Icon: 'vscode', radius: 240, delay: 40, duration: 33 },
        { Icon: 'git', radius: 240, delay: 48, duration: 34 },
        { Icon: 'python', radius: 240, delay: 56, duration: 37 },
    ]

    return (
        <main className="relative flex h-[800px] w-[550px] flex-col items-center justify-center overflow-hidden rounded-lg">
            {/* Central Logo/Text */}
            <ScrambledText
                radius={30}
                duration={1.2}
                speed={0.5}
                scrambleChars={'.:'}
                className="text-primary relative z-10 text-center text-5xl font-extrabold drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
            >
                ASPDC
            </ScrambledText>

            {/* Orbiting Icons */}
            {orbitConfigs.map((config, index) => (
                <OrbitingCircles
                    key={index}
                    className="size-[50px] transition-transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    {...config}
                >
                    {Icons[config.Icon]()}
                </OrbitingCircles>
            ))}

            {/* Mobile Version */}
            <div className="relative flex h-[400px] w-full items-center justify-center lg:hidden">
                <span className="text-primary relative z-10 text-4xl font-bold">
                    ASPDC
                </span>
                {orbitConfigs.map((config, index) => (
                    <OrbitingCircles
                        key={index}
                        className="size-[28px] transition-transform hover:scale-110"
                        {...{
                            ...config,
                            radius: Math.floor(config.radius * 0.7),
                        }}
                    >
                        {SmallIcons[config.Icon]()}
                    </OrbitingCircles>
                ))}
            </div>
        </main>
    )
}

const SmallIcons = {
    gitHub: () => <SiGithub size={24} className="text-gray-200" />,
    keras: () => <SiKeras size={20} className="text-red-400" />,
    react: () => <SiReact size={24} className="text-cyan-400" />,
    tailwind: () => <SiTailwindcss size={24} className="text-sky-400" />,
    figma: () => <SiFigma size={24} className="text-pink-400" />,
    vscode: () => <BiLogoVisualStudio size={24} className="text-blue-500" />,
    git: () => <SiGit size={24} className="text-orange-400" />,
    python: () => <SiPython size={24} className="text-yellow-400" />,
}

const Icons = {
    gitHub: () => <SiGithub size={32} className="text-gray-200" />,
    keras: () => <SiKeras size={28} className="text-red-400" />,
    react: () => <SiReact size={35} className="text-cyan-400" />,
    tailwind: () => <SiTailwindcss size={32} className="text-sky-400" />,
    figma: () => <SiFigma size={35} className="text-pink-400" />,
    vscode: () => <BiLogoVisualStudio size={32} className="text-blue-500" />,
    git: () => <SiGit size={35} className="text-orange-400" />,
    python: () => <SiPython size={32} className="text-yellow-400" />,
}

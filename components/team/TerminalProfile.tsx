import React, { useState } from 'react'
import styles from './TerminalProfile.module.css'

export interface TerminalProfileProps {
    name: string
    role?: string
    avatar: string
    socials?: {
        linkedin?: string
        instagram?: string
        github?: string
    }
}

const typeText = (
    text: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    speed: number = 40
) => {
    let index = 0
    const timer = setInterval(() => {
        if (index <= text.length) {
            setter(text.slice(0, index))
            index++
        } else {
            clearInterval(timer)
        }
    }, speed)
    return timer
}

const TerminalProfile: React.FC<TerminalProfileProps> = ({
    name,
    role,
    avatar,
    socials,
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [typedName, setTypedName] = useState('')
    const [typedRole, setTypedRole] = useState('')
    const [showSocials, setShowSocials] = useState(false)

    const handleMouseEnter = () => {
        setIsHovered(true)
        setTypedName('')
        setTypedRole('')
        setShowSocials(false)

        setTimeout(() => {
            typeText(name, setTypedName)

            setTimeout(
                () => {
                    if (role) {
                        typeText(role, setTypedRole, 35)
                        setTimeout(
                            () => {
                                if (socials) setShowSocials(true)
                            },
                            role.length * 35 + 200
                        )
                    } else if (socials) {
                        setTimeout(() => setShowSocials(true), 200)
                    }
                },
                name.length * 40 + 250
            )
        }, 150)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setTypedName('')
        setTypedRole('')
        setShowSocials(false)
    }

    return (
        <div
            className={styles.terminalProfile}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.terminalHeader}>
                <span className={styles.dotRed}></span>
                <span className={styles.dotYellow}></span>
                <span className={styles.dotGreen}></span>
                <span className={styles.terminalTitle}>~/aspdc/team</span>
            </div>

            <div className={styles.terminalBody}>
                <div className={styles.imageContainer}>
                    <img src={avatar} alt={name} className={styles.avatar} />
                </div>

                <div className={styles.nameOverlay}>{name}</div>

                <div className={styles.infoOverlay}>
                    {isHovered && (
                        <>
                            <div className={styles.commandLine}>
                                <span className={styles.prompt}>$</span>
                                <span className={styles.command}>whoami</span>
                            </div>
                            <div className={styles.output}>
                                {typedName}
                                {typedName.length < name.length && (
                                    <span className={styles.cursor}>|</span>
                                )}
                            </div>

                            {role && typedName === name && (
                                <>
                                    <div className={styles.commandLine}>
                                        <span className={styles.prompt}>$</span>
                                        <span className={styles.command}>
                                            cat role.txt
                                        </span>
                                    </div>
                                    <div className={styles.output}>
                                        {typedRole}
                                        {typedRole.length < role.length && (
                                            <span className={styles.cursor}>
                                                |
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}

                            {socials && showSocials && (
                                <>
                                    <div className={styles.commandLine}>
                                        <span className={styles.prompt}>$</span>
                                        <span className={styles.command}>
                                            ls -la socials/
                                        </span>
                                    </div>
                                    <div className={styles.socialLinks}>
                                        {socials.linkedin && (
                                            <a
                                                href={socials.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.socialLink}
                                            >
                                                LinkedIn
                                            </a>
                                        )}
                                        {socials.instagram && (
                                            <a
                                                href={socials.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.socialLink}
                                            >
                                                Instagram
                                            </a>
                                        )}
                                        {socials.github && (
                                            <a
                                                href={socials.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.socialLink}
                                            >
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TerminalProfile

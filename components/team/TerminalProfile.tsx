import React from 'react'
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

const TerminalProfile: React.FC<TerminalProfileProps> = ({
    name,
    role,
    avatar,
    socials,
}) => {
    return (
        <div className={styles.terminalProfile}>
            <div className={styles.terminalHeader}>
                <span className={styles.dotRed}></span>
                <span className={styles.dotYellow}></span>
                <span className={styles.dotGreen}></span>
                <span className={styles.terminalTitle}>aspdc@team:~$</span>
            </div>
            <div className={styles.terminalBody}>
                <div className={styles.avatarWrap}>
                    <img
                        src={avatar}
                        alt={name + ' avatar'}
                        className={styles.avatar}
                    />
                </div>
                <div className={styles.terminalText}>
                    <div className={styles.line}>
                        <span className={styles.prompt}>$</span> whoami
                    </div>
                    <div className={styles.response}>{name}</div>
                    {role && (
                        <>
                            <div className={styles.line}>
                                <span className={styles.prompt}>$</span> role
                            </div>
                            <div className={styles.response}>{role}</div>
                        </>
                    )}
                    {socials && (
                        <>
                            <div className={styles.line}>
                                <span className={styles.prompt}>$</span> socials
                            </div>
                            <div className={styles.socialsWrap}>
                                {socials.linkedin && (
                                    <a
                                        href={socials.linkedin}
                                        target="_blank"
                                        rel="noopener"
                                        className={styles.socialLink}
                                    >
                                        LinkedIn
                                    </a>
                                )}
                                {socials.instagram && (
                                    <a
                                        href={socials.instagram}
                                        target="_blank"
                                        rel="noopener"
                                        className={styles.socialLink}
                                    >
                                        Instagram
                                    </a>
                                )}
                                {socials.github && (
                                    <a
                                        href={socials.github}
                                        target="_blank"
                                        rel="noopener"
                                        className={styles.socialLink}
                                    >
                                        GitHub
                                    </a>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TerminalProfile

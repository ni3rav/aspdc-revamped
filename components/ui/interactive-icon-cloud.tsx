'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import {
    Cloud,
    fetchSimpleIcons,
    ICloud,
    renderSimpleIcon,
    SimpleIcon,
} from 'react-icon-cloud'

export const cloudProps: Omit<ICloud, 'children'> = {
    containerProps: {
        style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            paddingTop: 40,
        },
    },
    options: {
        reverse: true,
        depth: 1,
        wheelZoom: false,
        imageScale: 2,
        activeCursor: 'default',
        tooltip: 'native',
        initial: [0.1, -0.1],
        clickToFront: 500,
        tooltipDelay: 0,
        outlineColour: 'transparent',
        maxSpeed: 0.08,
        minSpeed: 0.05,
        // dragControl: false,
    },
}

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
    const fallbackHex = theme === 'light' ? '#6e6e73' : '#ffffff'

    return renderSimpleIcon({
        icon,
        fallbackHex,
        minContrastRatio: 1,
        size: 42,
        aProps: {
            href: undefined,
            target: undefined,
            rel: undefined,
            onClick: (e: any) => e.preventDefault(),
            style: {
                border: 'none',
                background: 'transparent',
            },
        },
    })
}

export type DynamicCloudProps = {
    iconSlugs: string[]
}

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>

export function IconCloud({ iconSlugs }: DynamicCloudProps) {
    const [data, setData] = useState<IconData | null>(null)
    const { theme } = useTheme()

    useEffect(() => {
        fetchSimpleIcons({ slugs: iconSlugs }).then(setData)
    }, [iconSlugs])

    const renderedIcons = useMemo(() => {
        if (!data) return null

        return Object.values(data.simpleIcons).map((icon) =>
            renderCustomIcon(icon, theme || 'light')
        )
    }, [data, theme])

    return (
        // @ts-ignore
        <Cloud {...cloudProps}>
            <>{renderedIcons}</>
        </Cloud>
    )
}

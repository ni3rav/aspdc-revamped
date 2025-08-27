'use client'

import {
    CSSProperties,
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from 'react'

import { cn } from '@/lib/utils'

interface NeonColorsProps {
    firstColor: string
    secondColor: string
}

interface NeonGradientCardProps {
    /**
     * @default <div />
     * @type ReactElement
     * @description
     * The component to be rendered as the card
     * */
    as?: ReactElement
    /**
     * @default ""
     * @type string
     * @description
     * The className of the card
     */
    className?: string

    /**
     * @default ""
     * @type ReactNode
     * @description
     * The children of the card
     * */
    children?: ReactNode

    /**
     * @default 5
     * @type number
     * @description
     * The size of the border in pixels
     * */
    borderSize?: number

    /**
     * @default 20
     * @type number
     * @description
     * The size of the radius in pixels
     * */
    borderRadius?: number

    /**
     * @default "{ firstColor: '#ff00aa', secondColor: '#00FFF1' }"
     * @type string
     * @description
     * The colors of the neon gradient
     * */
    neonColors?: NeonColorsProps

    [key: string]: any
}

export const NeonGradientCard: React.FC<NeonGradientCardProps> = ({
    className,
    children,
    borderSize = 2,
    neonColors = {
        firstColor: '#23C55E',
        secondColor: '#FFFFFF',
    },
    role,
    ...props
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { offsetWidth, offsetHeight } = containerRef.current
                setDimensions({ width: offsetWidth, height: offsetHeight })
            }
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)

        return () => {
            window.removeEventListener('resize', updateDimensions)
        }
    }, [])

    useEffect(() => {
        if (containerRef.current) {
            const { offsetWidth, offsetHeight } = containerRef.current
            setDimensions({ width: offsetWidth, height: offsetHeight })
        }
    }, [children])

    return (
        <div
            ref={containerRef}
            style={
                {
                    '--border-size': `${borderSize}px`,
                    '--neon-first-color': neonColors.firstColor,
                    '--neon-second-color': neonColors.secondColor,
                    '--card-width': `${dimensions.width}px`,
                    '--card-height': `${dimensions.height}px`,
                    '--pseudo-element-background-image': `linear-gradient(0deg, ${neonColors.firstColor}})`,
                    '--pseudo-element-width': `${dimensions.width + borderSize * 2}px`,
                    '--pseudo-element-height': `${dimensions.height + borderSize * 2}px`,
                    '--after-blur': `${dimensions.width / 20}px`,
                } as CSSProperties
            }
            className={cn('relative z-10 size-full rounded-xl', className)}
            {...props}
        >
            <div
                className={cn(
                    'relative size-full min-h-[inherit] rounded-xl bg-black',
                    'before:absolute before:-top-[var(--border-size)] before:-left-[var(--border-size)] before:-z-10 before:block',
                    "before:h-[var(--pseudo-element-height)] before:w-[var(--pseudo-element-width)] before:rounded-xl before:content-['']",
                    'before:bg-[length:100%_200%]',
                    'before:animate-background-position-spin',
                    'after:absolute after:-top-[var(--border-size)] after:-left-[var(--border-size)] after:-z-10 after:block',
                    "after:h-[var(--pseudo-element-height)] after:w-[var(--pseudo-element-width)] after:rounded-xl after:blur-[var(--after-blur)] after:content-['']",
                    'after:bg-[length:100%_200%] after:opacity-80',
                    'after:animate-background-position-spin',
                    'dark:bg-neutral-900',
                    `${
                        role !== 'Member'
                            ? 'before:bg-[linear-gradient(0deg,var(--neon-first-color))] after:bg-[linear-gradient(0deg,var(--neon-first-color))]'
                            : 'before:bg-[linear-gradient(0deg,var(--neon-second-color))] after:bg-[linear-gradient(0deg,var(--neon-second-color))]'
                    }`
                )}
            >
                {children}
            </div>
        </div>
    )
}

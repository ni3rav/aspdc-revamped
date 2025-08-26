'use client'
import { useEffect, useState } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BentoGridProps extends ComponentPropsWithoutRef<'div'> {
    children: ReactNode
    className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<'div'> {
    name: string
    className: string
    background: string[]
    description: string
    href: string
    cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
    return (
        <div
            className={cn(
                'grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

const BentoCard = ({
    name,
    className,
    background,
    description,
    href,
    cta,
    ...props
}: BentoCardProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        if (background.length <= 1) return

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === background.length - 1 ? 0 : prev + 1
            )
        }, 3000) // Change image every 3 seconds

        return () => clearInterval(interval)
    }, [background])
    return (
        <div
            key={name}
            className={cn(
                'group relative flex flex-col justify-between overflow-hidden rounded-xl border',
                'bg-background transform-gpu [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] [border:1px_solid_rgba(255,255,255,.1)]',
                className
            )}
            {...props}
        >
            <div className="relative h-64 w-full overflow-hidden transition-normal duration-300 group-hover:h-52">
                {background.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${name} - image ${index + 1}`}
                        className={cn(
                            'absolute h-full w-full object-cover transition-opacity duration-1000',
                            index === currentImageIndex
                                ? 'opacity-100'
                                : 'opacity-0'
                        )}
                    />
                ))}
            </div>
            <div className="p-4">
                <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10">
                    <h3 className="text-primary text-xl font-semibold">
                        {name}
                    </h3>
                    <p className="max-w-lg text-neutral-400">{description}</p>
                </div>

                <div
                    className={cn(
                        'pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden'
                    )}
                >
                    <Button
                        variant="default"
                        asChild
                        size="sm"
                        className="pointer-events-auto p-0"
                    >
                        <a href={href}>
                            {cta}
                            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
                        </a>
                    </Button>
                </div>
            </div>

            <div
                className={cn(
                    'pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex'
                )}
            >
                <Button
                    variant="ghost"
                    asChild
                    size="sm"
                    className="pointer-events-auto p-0"
                >
                    <a href={href}>
                        {cta}
                        <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
                    </a>
                </Button>
            </div>

            <div className="pointer-events-none absolute inset-0 transform-gpu bg-neutral-800/10 transition-all duration-300" />
        </div>
    )
}

export { BentoCard, BentoGrid }

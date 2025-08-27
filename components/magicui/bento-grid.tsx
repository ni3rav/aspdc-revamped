'use client'
import { useEffect, useState } from 'react'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import {
    MorphingDialog,
    MorphingDialogContainer,
    MorphingDialogContent,
    MorphingDialogTrigger,
    MorphingDialogClose,
    MorphingDialogTitle,
    MorphingDialogDescription,
} from '@/components/motion-primitives/morphing-dialog'

import { cn } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { ProgressiveBlur } from '../motion-primitives/progressive-blur'

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
                'grid w-full auto-rows-[22rem] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3',
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
    const [dialogImageIndex, setDialogImageIndex] = useState(0)

    useEffect(() => {
        if (background.length <= 1) return

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === background.length - 1 ? 0 : prev + 1
            )
        }, 2000)

        return () => clearInterval(interval)
    }, [background])

    const handlePrevious = () => {
        setDialogImageIndex((prev) =>
            prev === 0 ? background.length - 1 : prev - 1
        )
    }

    const handleNext = () => {
        setDialogImageIndex((prev) =>
            prev === background.length - 1 ? 0 : prev + 1
        )
    }

    return (
        <MorphingDialog>
            <MorphingDialogTrigger className="group bg-background relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
                <div className="relative h-full w-full">
                    {background.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${name} - image ${index + 1}`}
                            className={cn(
                                'absolute h-full w-full object-cover transition-all duration-500',
                                'transform-gpu group-hover:scale-105',
                                index === currentImageIndex
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            )}
                        />
                    ))}
                    <ProgressiveBlur
                        className="pointer-events-none absolute bottom-0 left-0 h-[50%] w-full"
                        blurIntensity={0.6}
                    />

                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="transform-gpu text-2xl font-bold text-white transition-all duration-300 group-hover:-translate-y-1">
                            {name}
                        </h3>
                        <p className="mt-2 line-clamp-2 scale-70 transform-gpu text-sm text-white/80 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                            {description}
                        </p>
                    </div>
                </div>
            </MorphingDialogTrigger>

            <MorphingDialogContainer>
                <MorphingDialogContent className="bg-background/95 relative mx-4 h-[85vh] w-[95vw] max-w-5xl overflow-hidden rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    <MorphingDialogClose className="absolute top-6 right-6 z-50 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/40" />

                    <div className="flex h-full flex-col gap-8">
                        <div className="space-y-4">
                            <MorphingDialogTitle className="text-primary text-4xl font-bold">
                                {name}
                            </MorphingDialogTitle>

                            <MorphingDialogDescription className="prose prose-lg dark:prose-invert prose-primary max-w-3xl">
                                {description}
                            </MorphingDialogDescription>
                        </div>

                        <div className="relative flex-1 overflow-hidden rounded-xl">
                            {background.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${name} - image ${index + 1}`}
                                    className={cn(
                                        'absolute inset-0 h-full w-full object-cover transition-all duration-700',
                                        index === dialogImageIndex
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                            ))}

                            {/* Enhanced Navigation */}
                            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-6">
                                <button
                                    onClick={handlePrevious}
                                    className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40"
                                >
                                    <ChevronLeftIcon className="h-8 w-8" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40"
                                >
                                    <ChevronRightIcon className="h-8 w-8" />
                                </button>
                            </div>

                            {/* Enhanced Image Counter */}
                            <div className="absolute right-6 bottom-6 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-sm">
                                <p className="text-base font-medium text-white">
                                    {dialogImageIndex + 1} / {background.length}
                                </p>
                            </div>

                            {/* Enhanced Navigation Dots */}
                            <div className="absolute bottom-6 left-6 flex gap-2">
                                {background.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setDialogImageIndex(index)
                                        }
                                        className={cn(
                                            'h-3 w-12 rounded-full transition-all duration-300',
                                            index === dialogImageIndex
                                                ? 'bg-primary'
                                                : 'bg-white/30 hover:bg-white/50'
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </MorphingDialogContent>
            </MorphingDialogContainer>
        </MorphingDialog>
    )
}

export { BentoCard, BentoGrid }

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
    const [dialogImageIndex, setDialogImageIndex] = useState(0)

    // useEffect(() => {
    //     if (background.length <= 1) return

    //     const interval = setInterval(() => {
    //         setCurrentImageIndex((prev) =>
    //             prev === background.length - 1 ? 0 : prev + 1
    //         )
    //     }, 2000)

    //     return () => clearInterval(interval)
    // }, [background])

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
            <MorphingDialogTrigger className="bg-background relative flex flex-col overflow-hidden rounded-2xl border transition-transform duration-300 hover:scale-105">
                <div className="relative h-full w-full">
                    {background.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${name} - image ${index + 1}`}
                            className={cn(
                                'absolute h-full w-full object-cover transition-all duration-300 group-hover:scale-110',
                                index === currentImageIndex
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            )}
                        />
                    ))}
                    <ProgressiveBlur
                        className="pointer-events-none absolute bottom-0 left-0 h-[50%] w-full"
                        blurIntensity={0.5}
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-4 text-center">
                        <h3 className="text-2xl font-semibold text-white">
                            {name}
                        </h3>
                    </div>
                </div>
            </MorphingDialogTrigger>

            <MorphingDialogContainer>
                <MorphingDialogContent className="bg-background relative mx-4 h-[80vh] w-[90vw] max-w-4xl overflow-y-auto rounded-xl p-6 shadow-xl">
                    <MorphingDialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" />

                    <div className="flex flex-col gap-6">
                        {/* Title and Description Section */}
                        <div className="flex flex-col gap-4">
                            <MorphingDialogTitle className="text-4xl font-bold text-green-500">
                                {name}
                            </MorphingDialogTitle>

                            <MorphingDialogDescription className="prose prose-sm dark:prose-invert">
                                {description}
                            </MorphingDialogDescription>
                        </div>

                        {/* Full-width Image Section */}
                        <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                            {background.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${name} - image ${index + 1}`}
                                    className={cn(
                                        'absolute h-full w-full object-cover transition-opacity duration-500',
                                        index === dialogImageIndex
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                            ))}

                            {/* Navigation Arrows */}
                            <button
                                onClick={handlePrevious}
                                className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                            >
                                <ChevronLeftIcon className="h-6 w-6" />
                            </button>

                            <button
                                onClick={handleNext}
                                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                            >
                                <ChevronRightIcon className="h-6 w-6" />
                            </button>

                            {/* Image navigation dots */}
                            <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
                                {background.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setDialogImageIndex(index)
                                        }
                                        className={`h-2 w-2 rounded-full transition-colors ${
                                            index === dialogImageIndex
                                                ? 'bg-green-500'
                                                : 'bg-white/50'
                                        }`}
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

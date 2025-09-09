'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BentoGridProps {
    children: React.ReactNode
    className?: string
}

interface BentoCardProps {
    name: string
    description: string
    background: string[]
    className?: string
}

export const BentoGrid = ({ children, className }: BentoGridProps) => {
    return (
        <div
            className={cn(
                'grid w-full grid-flow-dense auto-rows-[22rem] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3',
                className
            )}
        >
            {children}
        </div>
    )
}

export const BentoCard = ({
    name,
    description,
    background,
    className,
}: BentoCardProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [dialogImageIndex, setDialogImageIndex] = useState(0)
    const [hover, setHover] = useState(false)

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
        <>
            {/* Compact Card */}
            <motion.div
                onHoverStart={() => setHover(true)}
                onHoverEnd={() => setHover(false)}
                layoutId={`card-${name}`}
                transition={{
                    layout: { duration: 0.18, ease: 'easeOut' },
                    default: { duration: 0.18, ease: 'easeOut' },
                }}
                onClick={() => setIsOpen(true)}
                className={cn(
                    'group bg-background relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all',
                    className
                )}
            >
                {/* 🔑 Image has its own layoutId */}
                <motion.img
                    layoutId={`card-image-${name}`}
                    src={background[0]}
                    alt={name}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                <motion.div
                    className={`absolute bottom-0 m-3 flex flex-col justify-end rounded-xl bg-black/5 p-3 backdrop-blur-sm transition-all duration-300 lg:scale-80 lg:opacity-0 ${hover && 'lg:scale-100 lg:opacity-100'}`}
                >
                    <h3 className="text-primary text-2xl font-bold">{name}</h3>
                    <p className="mt-2 hidden h-10 items-center justify-center text-sm text-ellipsis text-white/80 xl:flex">
                        {description}
                    </p>
                </motion.div>
            </motion.div>

            {/* Expanded View */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Expanded Card */}
                        <motion.div
                            layoutId={`card-${name}`}
                            transition={{
                                layout: { duration: 0.18, ease: 'easeOut' },
                            }}
                            className="fixed inset-0 z-50 m-auto flex h-[60vh] w-[95vw] max-w-5xl flex-col rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl lg:h-[75vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setDialogImageIndex(0)
                                }}
                                className="absolute top-6 right-6 z-50 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Content */}
                            <div className="flex h-full flex-col gap-8">
                                <div className="space-y-4">
                                    <h2 className="text-primary text-4xl font-bold">
                                        {name}
                                    </h2>
                                    <p className="max-w-3xl text-lg text-gray-300">
                                        {description}
                                    </p>
                                </div>

                                {/* 🔑 Image in expanded view shares layoutId, but fixed height */}
                                <motion.div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl">
                                    <motion.img
                                        layoutId={`card-image-${name}`}
                                        src={background[dialogImageIndex]}
                                        alt={`${name} - image ${dialogImageIndex + 1}`}
                                        className="w-full rounded-xl object-cover"
                                    />
                                </motion.div>

                                {/* Navigation */}
                                {background.length > 1 && (
                                    <>
                                        <div className="absolute inset-x-0 top-3/4 z-10 flex -translate-y-1/2 justify-between px-2 lg:top-1/2 lg:px-12">
                                            <button
                                                onClick={handlePrevious}
                                                className="scale-80 rounded-full bg-white/5 p-3 backdrop-blur-lg lg:scale-100"
                                            >
                                                <ChevronLeftIcon className="h-8 w-8" />
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="scale-80 rounded-full bg-white/5 p-3 backdrop-blur-lg lg:scale-100"
                                            >
                                                <ChevronRightIcon className="h-8 w-8" />
                                            </button>
                                        </div>

                                        <div className="text-primary absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full px-4 py-2 font-black shadow-lg backdrop-blur-lg lg:bottom-10">
                                            {dialogImageIndex + 1} /{' '}
                                            {background.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

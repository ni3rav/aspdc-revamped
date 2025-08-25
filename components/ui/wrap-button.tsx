import React from 'react'
import Link from 'next/link'
import { ArrowRight, Globe } from 'lucide-react'

import { cn } from '@/lib/utils'

interface WrapButtonProps {
    className?: string
    children: React.ReactNode
    href?: string
}

const WrapButton: React.FC<WrapButtonProps> = ({
    className,
    children,
    href,
}) => {
    return (
        <div className="flex items-center justify-center">
            {href ? (
                <Link href={href}>
                    <div
                        className={cn(
                            'group group flex h-[46px] cursor-pointer items-center rounded-full border border-[#3B3A3A] bg-[#151515] p-[10px] text-sm',
                            className
                        )}
                    >
                        <p className="group-hover:text-primary mr-3 ml-2 flex items-center justify-center gap-2 font-medium tracking-tight">
                            {children}
                        </p>
                        <div className="group-hover:text-primary group-hover:border-primary flex size-[20px] items-center justify-center rounded-full border-2 border-[#3b3a3a] text-[#3b3a3a] transition-all ease-in-out group-hover:ml-2">
                            <ArrowRight
                                size={14}
                                className="transition-all ease-in-out group-hover:rotate-45"
                            />
                        </div>
                    </div>
                </Link>
            ) : (
                <div
                    className={cn(
                        'group group flex h-[64px] cursor-pointer items-center gap-2 rounded-full border border-[#3B3A3A] bg-[#151515] p-[11px]',
                        className
                    )}
                >
                    <div className="flex h-[43px] items-center justify-center rounded-full border border-[#3B3A3A] bg-[#fe7500] text-white">
                        <Globe className="mx-2 animate-spin" />
                        <p className="mr-3 font-medium tracking-tight">
                            {children ? children : 'Get Started'}
                        </p>
                    </div>
                    <div className="flex size-[26px] items-center justify-center rounded-full border-2 border-[#3b3a3a] text-[#3b3a3a] transition-all ease-in-out group-hover:ml-2">
                        <ArrowRight
                            size={18}
                            className="transition-all ease-in-out group-hover:rotate-45"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default WrapButton

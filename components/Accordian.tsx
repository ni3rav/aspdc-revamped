'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

interface AccordionItemProps {
    title: string
    content: React.ReactNode
    isExpanded: boolean
    onToggle: () => void
}

interface AccordionProps {
    items: Array<{
        title: string
        content: React.ReactNode
    }>
}

const AccordionItem: React.FC<AccordionItemProps> = ({
    title,
    content,
    isExpanded,
    onToggle,
}) => {
    return (
        <div
            className={`w-full cursor-pointer overflow-hidden rounded-xl border transition-all select-none ${isExpanded ? 'border-[#23C55E]/60 shadow-lg shadow-[#23C55E]/10' : 'border-white/10 hover:border-[#23C55E]/30'} bg-gradient-to-br from-[#111111] to-[#1a1a1a]`}
            onClick={onToggle}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5">
                <h2
                    className={`text-base font-medium transition-colors ${
                        isExpanded ? 'text-[#23C55E]' : 'text-gray-200'
                    }`}
                >
                    {title}
                </h2>
                <motion.div
                    animate={{
                        rotate: isExpanded ? 180 : 0,
                        scale: isExpanded ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400"
                >
                    <ChevronDown size={20} />
                </motion.div>
            </div>

            {/* Content with AnimatePresence */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            damping: 8, // controls bounciness
                            stiffness: 80, // controls speed
                        }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 text-sm leading-relaxed text-gray-300">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    const handleToggle = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index)
    }

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                    isExpanded={expandedIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </div>
    )
}

const accordionItems = [
    {
        title: 'Do I need to be a coding genius to join ASPDC?',
        content: (
            <p>
                Nope! Whether you're a total newbie or a coding wizard, you're
                welcome here. We're all about learning and growing together 🚀
            </p>
        ),
    },
    {
        title: 'What kind of events does ASPDC organize?',
        content: (
            <p>
                We've got it all! Workshops, hackathons, coding competitions,
                tech talks, and even fun socials 🎉
            </p>
        ),
    },
    {
        title: 'How can I stay updated on ASPDC events?',
        content: (
            <p>
                Follow us on socials, join our Discord, or hop into our WhatsApp
                group 📱. We’ll keep you posted!
            </p>
        ),
    },
    {
        title: 'Is there a membership fee?',
        content: (
            <p>
                Nope, it's{' '}
                <span className="font-semibold text-[#23C55E]">100% free</span>{' '}
                💚. We want everyone to have access to learning and
                opportunities.
            </p>
        ),
    },
    {
        title: 'Do I need prior experience to attend workshops?',
        content: (
            <p>
                Not at all! Our sessions are designed for beginners and pros
                alike. Just bring your curiosity 🔥
            </p>
        ),
    },
    {
        title: 'Can I suggest an event idea?',
        content: (
            <p>
                Absolutely! If you've got a cool idea just email us right here
                or reach out on our socials. Let's build something awesome
                together 🚀
            </p>
        ),
    },
]

const AccordionComp: React.FC = () => {
    return (
        <div>
            <Accordion items={accordionItems} />
        </div>
    )
}

export default AccordionComp

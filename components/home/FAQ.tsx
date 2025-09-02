'use client'

import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { MagicCard } from '../magicui/magic-card'
import AccordionComp from '../Accordian'
import { useState } from 'react'
import { toast } from 'sonner'

export default function FAQContactPage() {
    const [sendMail, setSendMail] = useState({
        subject: '',
        body: '',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openEmail = (e: any) => {
        e.preventDefault()
        const recipient = 'aspdc@adaniuni.ac.in'
        const subject = encodeURIComponent(`${sendMail.subject}`)
        const body = encodeURIComponent(`${sendMail.body}`)
        if (subject.trim().length === 0 || body.trim().length === 0) {
            toast.error('Looks like you missed the subject or message!')
            return
        }

        try {
            // Attempt to open the default email client
            window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`
            setTimeout(() => {
                toast.success('Feedback sent successfully')
            }, 1500)
        } catch (e) {
            console.error('Error opening email client:', e)
            // Fallback to Gmail if the default email client is not available
            window.open(
                `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`,
                '_blank'
            )
            setTimeout(() => {
                toast.success('Feedback sent successfully')
            }, 1500)
        }
    }
    return (
        <div
            id="contact"
            className="relative min-h-screen px-4 py-16 text-white sm:px-8 lg:px-16"
        >
            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center text-5xl font-bold md:text-7xl"
            >
                Got Questions?{' '}
                <span className="text-primary">We Got Answers</span>
            </motion.h1>

            {/* Two Column Layout */}
            <div className="flex flex-col gap-10 lg:flex-row">
                {/* FAQ Accordion (Left Side) */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full lg:w-1/2"
                >
                    <AccordionComp />
                </motion.div>

                {/* Contact Section (Right Side) */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full lg:w-1/2"
                >
                    <MagicCard className="border-primary/20 hover:shadow-primary/20 group h-full rounded-2xl border bg-gradient-to-br from-[#151515] to-[#1a1a1a] p-8 shadow-lg transition">
                        {/* Contact Info */}
                        <h2 className="group-hover:text-primary mb-3 text-2xl font-semibold transition-colors">
                            Still got questions?
                        </h2>
                        <p className="mb-6 text-base leading-relaxed opacity-80">
                            We'd love to help you out. Reach us anytime.
                        </p>

                        {/* Contact Form */}
                        <div className="border-primary/20 rounded-2xl border bg-[#1a1a1a] p-6 shadow-lg">
                            <form className="space-y-6">
                                <div>
                                    <label className="mb-2 block font-medium">
                                        Subject
                                    </label>
                                    <Input
                                        value={sendMail.subject}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setSendMail({
                                                ...sendMail,
                                                subject: e.target.value,
                                            })
                                        }
                                        type="text"
                                        placeholder="Enter Subject"
                                        className="border-none bg-[#1f1f1f]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block font-medium">
                                        Message
                                    </label>
                                    <Textarea
                                        value={sendMail.body}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setSendMail({
                                                ...sendMail,
                                                body: e.target.value,
                                            })
                                        }
                                        placeholder="Write your message..."
                                        rows={4}
                                        className="border-none bg-[#1f1f1f]"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/70 w-full cursor-pointer rounded-lg px-6 py-3 font-semibold text-black shadow-md"
                                    onClick={(e) => openEmail(e)}
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </MagicCard>
                </motion.div>
            </div>
        </div>
    )
}

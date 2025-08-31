'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Mail,
    Phone,
    MessageCircleHeart,
    Sparkles,
    Send,
    MapPin,
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function page() {
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        // Simulate submit
        console.table(Object.fromEntries(form.entries()))
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
    }

    return (
        <div className="mx-auto flex max-w-5xl items-center justify-center px-8 py-12 md:py-32 lg:px-0">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-primary/20 bg-white/5 shadow-xl backdrop-blur-sm">
                    <CardHeader className="space-y-2 text-center">
                        <motion.div
                            initial={{ scale: 0.9, rotate: -2 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 15,
                            }}
                            className="border-primary/30 bg-primary/10 mx-auto inline-flex items-center gap-2 rounded-2xl border px-3 py-1"
                        >
                            <Sparkles className="text-primary size-4" />
                            <span className="text-primary text-xs font-medium">
                                Say hello
                            </span>
                        </motion.div>
                        <CardTitle className="text-3xl tracking-tight">
                            Contact Us
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Minimal, fun, and pleasing—right to the point. The
                            background is transparent so it blends into your
                            world.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Ada Lovelace"
                                    required
                                    className="bg-neutral-950/40"
                                />
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@domain.com"
                                        required
                                        className="bg-neutral-950/40"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Reason</Label>
                                    <Select name="reason" defaultValue="hello">
                                        <SelectTrigger className="bg-neutral-950/40">
                                            <SelectValue placeholder="Pick one" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hello">
                                                Just saying hi 👋
                                            </SelectItem>
                                            <SelectItem value="support">
                                                I need support 🛟
                                            </SelectItem>
                                            <SelectItem value="quote">
                                                Suggest a feature 🧐
                                            </SelectItem>
                                            <SelectItem value="feedback">
                                                Share feedback 💬
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Keep it short & sweet ✨"
                                    rows={5}
                                    required
                                    className="bg-white/60 dark:bg-neutral-950/40"
                                />
                            </div>

                            <div className="flex items-start gap-2 text-xs">
                                <input
                                    id="consent"
                                    name="consent"
                                    type="checkbox"
                                    required
                                    className="mt-1"
                                />
                                <Label
                                    htmlFor="consent"
                                    className="leading-snug"
                                >
                                    I agree to be contacted about my message. No
                                    spam, pinky promise.
                                </Label>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 text-sm opacity-80">
                                    <span className="inline-flex items-center gap-1">
                                        <Mail className="size-4" />{' '}
                                        hello@yourbrand.dev
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Phone className="size-4" /> +00 123 456
                                        789
                                    </span>
                                </div>
                                <Button
                                    type="submit"
                                    className="bg-primary text-primary-foreground hover:opacity-90"
                                >
                                    <Send className="mr-2 size-4" /> Send
                                </Button>
                            </div>

                            {submitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="bg-primary/10 border-primary/30 text-primary rounded-xl border px-3 py-2 text-sm"
                                >
                                    Thanks! Your message took flight. We'll be
                                    in touch soon.
                                </motion.div>
                            )}
                        </form>

                        <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
                            <InfoPill
                                icon={<MessageCircleHeart className="size-4" />}
                                label="Friendly support"
                            />
                            <InfoPill
                                icon={<MapPin className="size-4" />}
                                label="Remote-first"
                            />
                            <InfoPill
                                icon={<Sparkles className="size-4" />}
                                label="Quick replies"
                            />
                        </div>
                    </CardContent>
                </Card>

                <footer className="mt-6 text-center text-xs opacity-70">
                    Need something else? Ping us anytime.
                </footer>
            </motion.div>
        </div>
    )
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="border-primary/20 bg-primary/5 inline-flex items-center gap-2 rounded-2xl border px-3 py-2">
            {icon}
            <span>{label}</span>
        </div>
    )
}

'use client'

import { UpcomingEvent } from '@/db/types'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function UpcomingEventsPage({
    events,
}: {
    events: UpcomingEvent[]
}) {
    return (
        <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 text-neutral-200 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
                <motion.article
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: i * 0.1,
                        duration: 0.5,
                        ease: 'easeOut',
                    }}
                    className="group hover:shadow-primary/30 hover:border-primary/40 relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/70 to-neutral-800/30 shadow-lg backdrop-blur-md"
                >
                    {/* Event Image */}
                    {event.eventImageUrl && (
                        <div className="relative aspect-video w-full overflow-hidden">
                            <img
                                src={event.eventImageUrl}
                                alt={event.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                            {/* Tag Badge */}
                            <span
                                className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold shadow ${(() => {
                                    const today = new Date()
                                    today.setHours(0, 0, 0, 0) // normalize to midnight
                                    const eventDate = new Date(event.date)
                                    eventDate.setHours(0, 0, 0, 0)

                                    if (eventDate.getTime() < today.getTime()) {
                                        return 'bg-neutral-700 text-neutral-200' // Past
                                    } else if (
                                        eventDate.getTime() === today.getTime()
                                    ) {
                                        return 'bg-yellow-400 text-black' // Today
                                    } else {
                                        return 'bg-primary text-black' // Upcoming
                                    }
                                })()}`}
                            >
                                {(() => {
                                    const today = new Date()
                                    today.setHours(0, 0, 0, 0)
                                    const eventDate = new Date(event.date)
                                    eventDate.setHours(0, 0, 0, 0)

                                    if (eventDate.getTime() < today.getTime()) {
                                        return 'Past Event'
                                    } else if (
                                        eventDate.getTime() === today.getTime()
                                    ) {
                                        return 'Happening Today 🎉'
                                    } else {
                                        return 'Upcoming'
                                    }
                                })()}
                            </span>
                        </div>
                    )}

                    {/* Content */}
                    <div className="relative flex flex-1 flex-col justify-between p-6">
                        <div>
                            <h2 className="text-primary mb-2 text-xl leading-tight font-extrabold md:text-2xl">
                                {event.name}
                            </h2>
                            <p className="text-sm leading-relaxed text-neutral-400 md:text-base">
                                {event.description}
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="mt-6 space-y-2 text-sm text-neutral-300">
                            <div className="flex items-center gap-2">
                                <Calendar
                                    size={16}
                                    className="text-primary shrink-0"
                                />
                                <span>
                                    {new Date(event.date).toLocaleDateString(
                                        'en-US',
                                        {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        }
                                    )}
                                </span>
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin
                                        size={16}
                                        className="text-primary shrink-0"
                                    />
                                    <span>{event.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3">
                            {event.registrationLink ? (
                                <Link
                                    href={event.registrationLink}
                                    target="_blank"
                                    className="bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-black shadow transition hover:scale-105 active:scale-95"
                                >
                                    Register <ExternalLink size={16} />
                                </Link>
                            ) : (
                                <span className="rounded-lg border border-white/20 px-4 py-2 text-sm text-neutral-400">
                                    Coming Soon 🚧
                                </span>
                            )}
                        </div>
                    </div>
                </motion.article>
            ))}

            {/* Empty State */}
            {events.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-neutral-900/40 p-16 text-center"
                >
                    <span className="animate-bounce text-7xl">👩‍💻</span>
                    <h2 className="mt-6 text-3xl font-bold text-neutral-100">
                        No Upcoming Events
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        Stay tuned — something exciting is cooking at ASPDC!
                    </p>
                </motion.div>
            )}
        </section>
    )
}

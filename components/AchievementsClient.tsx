'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Achievement } from '@/db/types'

function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    })
}

export default function AchievementsPage({ ach }: { ach: Achievement[] }) {
    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ach.map((a, i) => (
                <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                    <Card className="group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg">
                        {a.imageUrl && (
                            <div className="relative h-40 w-full overflow-hidden">
                                <Image
                                    src={a.imageUrl}
                                    alt={a.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        )}
                        <CardHeader className="space-y-2">
                            <CardTitle className="line-clamp-2">
                                {a.title}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs">
                                {formatDate(a.date)}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground line-clamp-3 text-sm">
                                {a.description}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}

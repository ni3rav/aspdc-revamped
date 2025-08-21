'use client'
import React from 'react'
import {
    AchievementCard,
    AddAchievementCard,
} from '@/components/admin/acv-card'
import { useAchievements } from '@/hooks/useAchievements'

export default function AchievementsPage() {
    const { data: achievements, isLoading, error } = useAchievements()

    if (isLoading)
        return (
            <div className="text-muted-foreground text-center">
                Loading achievements...
            </div>
        )
    if (error)
        return (
            <div className="text-destructive text-center">
                Error loading achievements
            </div>
        )

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-foreground mb-8 text-3xl font-bold">
                Achievements
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Add new achievement card */}
                <AddAchievementCard />

                {/* Display existing achievements */}
                {achievements?.map((achievement) => (
                    <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                    />
                ))}
            </div>

            {achievements?.length === 0 && (
                <p className="text-muted-foreground mt-8 text-center">
                    No achievements yet. Add your first achievement!
                </p>
            )}
        </div>
    )
}

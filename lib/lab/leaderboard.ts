import type { LabProfile } from '@/db/types'
import { CHARACTER_PROFILES } from './characters'
import { getCompetitionRank } from './ranking/rank'

export type LabLeaderboardEntry = {
    id: string
    rank: number
    githubUsername: string
    avatarUrl: string
    characterId: string
    characterName: string
    developerScore: number
    analyzedAt: Date
}

export function getCharacterName(characterId: string): string {
    const found = CHARACTER_PROFILES.find((c) => c.id === characterId)
    if (found) return found.name

    return characterId
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
}

export function getGitHubAvatarUrl(githubUsername: string): string {
    return `https://avatars.githubusercontent.com/${githubUsername}`
}

export function formatLeaderboardEntries(
    profiles: LabProfile[]
): LabLeaderboardEntry[] {
    const sorted = [...profiles].sort((a, b) => {
        if (b.developerScore !== a.developerScore) {
            return b.developerScore - a.developerScore
        }
        return a.githubUsername.localeCompare(b.githubUsername)
    })

    const scores = sorted.map((profile) => profile.developerScore)

    return sorted.map((profile) => {
        return {
            id: profile.id,
            rank: getCompetitionRank(profile.developerScore, scores),
            githubUsername: profile.githubUsername,
            avatarUrl: getGitHubAvatarUrl(profile.githubUsername),
            characterId: profile.characterId,
            characterName: getCharacterName(profile.characterId),
            developerScore: profile.developerScore,
            analyzedAt: profile.analyzedAt,
        }
    })
}

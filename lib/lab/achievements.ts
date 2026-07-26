import type { GitHubSnapshot, TraitVector } from './types'
import type { RankingScoreV2 } from './ranking/types'

export type AchievementDefinition = {
    id: string
    name: string
    description: string
    icon: string
    unlock: (context: AchievementContext) => boolean
}

export type Achievement = {
    id: string
    name: string
    description: string
    icon: string
}

export type AchievementContext = {
    vector: TraitVector
    snapshot: GitHubSnapshot
    rank?: number
}

function uniqueLanguageCount(snapshot: GitHubSnapshot): number {
    return new Set(
        snapshot.repos
            .map((repo) => repo.language)
            .filter((language): language is string => Boolean(language))
    ).size
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
    {
        id: 'the-blue-sky',
        name: 'The Blue Sky',
        description:
            'High coding discipline and exceptionally consistent commits.',
        icon: 'blue-sky',
        unlock: ({ vector }) => vector.Discipline > 90,
    },
    {
        id: 'say-my-name',
        name: 'Say My Name',
        description:
            'Ranked in the global top 10 on the developer leaderboard.',
        icon: 'crown',
        unlock: ({ rank }) => rank !== undefined && rank <= 10,
    },
    {
        id: 'i-am-the-danger',
        name: 'I Am The Danger',
        description:
            'High code output with frequent major changes and refactors.',
        icon: 'danger',
        unlock: ({ vector }) => vector.Chaos > 85,
    },
    {
        id: 'science-bitch',
        name: 'Science, B***h!',
        description: 'Proficient across 3 or more programming languages.',
        icon: 'flask',
        unlock: ({ vector, snapshot }) =>
            vector.Scientist > 75 && uniqueLanguageCount(snapshot) >= 3,
    },
    {
        id: 'better-call-saul',
        name: 'Better Call Saul',
        description:
            'High communication score with active pull request discussions.',
        icon: 'gavel',
        unlock: ({ vector }) => vector.Communication > 75,
    },
    {
        id: 'tightened-up',
        name: 'Tightened Up',
        description:
            'Clean architecture score with well-structured project repositories.',
        icon: 'chicken',
        unlock: ({ vector }) => vector.Architect > 75,
    },
    {
        id: 'no-half-measures',
        name: 'No Half Measures',
        description:
            'Qualifying public contributions on at least 24 days in the 90-day window.',
        icon: 'measure',
        unlock: () => false,
    },
    {
        id: 'this-is-not-meth',
        name: 'This Is Not Meth',
        description:
            'Comprehensive documentation across all your public repositories.',
        icon: 'label',
        unlock: ({ vector }) => vector.Documentation > 75,
    },
    {
        id: 'yeah-science',
        name: 'Yeah Science',
        description:
            'High curiosity score with frequent exploration of new technologies.',
        icon: 'spark',
        unlock: ({ vector }) => vector.Curiosity > 75,
    },
    {
        id: 'the-one-who-builds',
        name: 'The One Who Builds',
        description: 'Maintains 5 or more active original repositories.',
        icon: 'hammer',
        unlock: () => false,
    },
    {
        id: 'associate-network',
        name: 'Associate Network',
        description:
            'At least 10 credited external pull requests, reviews, or issues.',
        icon: 'network',
        unlock: () => false,
    },
    {
        id: 'open-the-lab',
        name: 'Open The Lab',
        description: 'A collaboration pillar score of 70 or higher.',
        icon: 'unlock',
        unlock: () => false,
    },
    {
        id: 'empire-business',
        name: 'Empire Business',
        description: 'High project leadership and repository management score.',
        icon: 'empire',
        unlock: ({ vector }) => vector.Leadership > 75,
    },
]

export function unlockAchievements(
    vector: TraitVector,
    snapshot: GitHubSnapshot,
    options: { rank?: number } = {}
): Achievement[] {
    const context: AchievementContext = {
        vector,
        snapshot,
        rank: options.rank,
    }

    return ACHIEVEMENTS.filter((achievement) =>
        achievement.unlock(context)
    ).map(({ id, name, description, icon }) => ({
        id,
        name,
        description,
        icon,
    }))
}

function achievementById(id: string): Achievement {
    const definition = ACHIEVEMENTS.find((achievement) => achievement.id === id)
    if (!definition) {
        throw new Error(`Unknown achievement definition: ${id}`)
    }
    const { name, description, icon } = definition
    return { id, name, description, icon }
}

export function unlockDynamicRankingAchievements(rank: number): Achievement[] {
    return rank <= 10 ? [achievementById('say-my-name')] : []
}

export function unlockDurableRankingAchievements(
    ranking: RankingScoreV2
): Achievement[] {
    const collaborationActions =
        ranking.credited.creditedPullRequestPoints +
        ranking.credited.creditedReviews +
        ranking.credited.creditedIssues

    return [
        ranking.credited.activeDays >= 24
            ? achievementById('no-half-measures')
            : null,
        ranking.credited.activeOriginalRepositories >= 5
            ? achievementById('the-one-who-builds')
            : null,
        collaborationActions >= 10
            ? achievementById('associate-network')
            : null,
        ranking.pillars.collaboration >= 70
            ? achievementById('open-the-lab')
            : null,
    ].filter((achievement): achievement is Achievement => Boolean(achievement))
}

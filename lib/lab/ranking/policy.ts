export const RANKING_V2_POLICY = {
    windowDays: 90,
    score: { minimum: 0, maximum: 100 },
    sustainedActivity: {
        finalWeight: 0.3,
        activeWeeks: { weight: 0.65, cap: 13 },
        activeDays: { weight: 0.35, cap: 36 },
    },
    building: {
        finalWeight: 0.3,
        commits: { weight: 0.7, cap: 90, perDayCap: 5 },
        activeOriginalRepositories: { weight: 0.3, cap: 5 },
    },
    collaboration: {
        finalWeight: 0.25,
        pullRequests: {
            weight: 0.45,
            cap: 12,
            mergedPoints: 1,
            openPoints: 0.5,
            perDayCap: 2,
            perRepositoryCap: 4,
        },
        reviews: {
            weight: 0.35,
            cap: 24,
            perDayCap: 4,
            perRepositoryCap: 10,
        },
        issues: {
            weight: 0.2,
            cap: 10,
            perDayCap: 2,
            perRepositoryCap: 4,
        },
    },
    stewardship: {
        finalWeight: 0.15,
        repositoryLimit: 5,
        hygiene: {
            readme: 40,
            description: 25,
            topics: 15,
            license: 10,
            releaseOrTag: 10,
        },
    },
} as const

export function formatPolicyPercent(weight: number): string {
    return `${weight * 100}%`
}

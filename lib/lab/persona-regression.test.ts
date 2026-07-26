import { describe, expect, it } from 'vitest'
import { runAnalysisPipeline } from './analyze'
import type { GitHubSnapshot } from './types'

const baseSnapshot: GitHubSnapshot = {
    login: 'student',
    accountCreatedAt: '2024-01-01T00:00:00.000Z',
    followers: 1,
    following: 1,
    publicRepos: 1,
    repos: [],
    events: [],
}

const fixtures: Array<{
    name: string
    snapshot: GitHubSnapshot
    expectedTopThree: string[]
}> = [
    {
        name: 'new student',
        snapshot: { ...baseSnapshot, login: 'new-student' },
        expectedTopThree: ['tuco-salamanca', 'jesse-pinkman', 'skinny-pete'],
    },
    {
        name: 'steady student builder',
        snapshot: {
            ...baseSnapshot,
            login: 'steady-builder',
            followers: 4,
            publicRepos: 3,
            repos: [
                {
                    name: 'coursework',
                    language: 'TypeScript',
                    topicsCount: 2,
                    hasDescription: true,
                    isFork: false,
                    stargazersCount: 0,
                    forksCount: 0,
                },
                {
                    name: 'portfolio',
                    language: 'JavaScript',
                    topicsCount: 1,
                    hasDescription: true,
                    isFork: false,
                    stargazersCount: 2,
                    forksCount: 0,
                },
            ],
            events: Array.from({ length: 12 }, (_, index) => ({
                type: 'PushEvent',
                createdAt: new Date(Date.UTC(2026, 5, index + 1)).toISOString(),
            })),
        },
        expectedTopThree: ['todd', 'hector-salamanca', 'lydia'],
    },
    {
        name: 'fork-based learner',
        snapshot: {
            ...baseSnapshot,
            login: 'fork-learner',
            publicRepos: 8,
            repos: Array.from({ length: 8 }, (_, index) => ({
                name: `fork-${index}`,
                language: index % 2 ? 'Python' : 'C++',
                topicsCount: 3,
                hasDescription: true,
                isFork: true,
                stargazersCount: 100,
                forksCount: 40,
            })),
            events: [
                {
                    type: 'ForkEvent',
                    createdAt: '2026-06-01T00:00:00.000Z',
                },
            ],
        },
        expectedTopThree: ['jesse-pinkman', 'hank-schrader', 'lalo-salamanca'],
    },
    {
        name: 'student collaborator',
        snapshot: {
            ...baseSnapshot,
            login: 'collaborator',
            followers: 8,
            following: 10,
            publicRepos: 2,
            repos: [
                {
                    name: 'oss',
                    language: 'Rust',
                    topicsCount: 2,
                    hasDescription: true,
                    isFork: false,
                    stargazersCount: 10,
                    forksCount: 2,
                },
            ],
            events: [
                'PullRequestEvent',
                'PullRequestReviewEvent',
                'IssuesEvent',
                'PushEvent',
                'PullRequestEvent',
                'IssueCommentEvent',
            ].map((type, index) => ({
                type,
                createdAt: new Date(Date.UTC(2026, 5, index + 1)).toISOString(),
            })),
        },
        expectedTopThree: ['lydia', 'hank-schrader', 'todd'],
    },
]

describe('persona regression fixtures', () => {
    it.each(fixtures)(
        'preserves the top-three character order for $name',
        ({ snapshot, expectedTopThree }) => {
            const result = runAnalysisPipeline(snapshot)
            expect(result.characterMatches.map((match) => match.id)).toEqual(
                expectedTopThree
            )
        }
    )
})

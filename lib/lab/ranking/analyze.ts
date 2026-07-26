import { runAnalysisPipeline, type AnalysisPipelineResult } from '../analyze'
import type { GitHubSnapshot } from '../types'
import {
    createPersistedRankingSnapshotV2,
    scoreRankingSnapshotV2,
} from './score'
import type {
    PersistedRankingSnapshotV2,
    RankingScoreV2,
    RankingSnapshotV2,
} from './types'

export type LabAnalysisV2Result = {
    persona: AnalysisPipelineResult
    ranking: RankingScoreV2
    persistedRankingSnapshot: PersistedRankingSnapshotV2
}

export function runLabAnalysisV2(
    personaSnapshot: GitHubSnapshot,
    rankingSnapshot: RankingSnapshotV2
): LabAnalysisV2Result {
    if (
        personaSnapshot.login.toLowerCase() !==
        rankingSnapshot.login.toLowerCase()
    ) {
        throw new Error(
            'Persona and ranking snapshots must belong to the same GitHub user.'
        )
    }

    const persona = runAnalysisPipeline(personaSnapshot)
    const ranking = scoreRankingSnapshotV2(rankingSnapshot)

    return {
        persona,
        ranking,
        persistedRankingSnapshot: createPersistedRankingSnapshotV2(
            rankingSnapshot,
            ranking
        ),
    }
}

import { describe, expect, it } from 'vitest'
import { assertRankingSnapshotOwner } from './migration'

describe('assertRankingSnapshotOwner', () => {
    it('accepts the linked profile login case-insensitively', () => {
        expect(() =>
            assertRankingSnapshotOwner('StudentDev', 'studentdev')
        ).not.toThrow()
    })

    it('rejects a token that belongs to another GitHub login', () => {
        expect(() =>
            assertRankingSnapshotOwner('student', 'other-developer')
        ).toThrow(
            'Linked GitHub token resolved to @other-developer, not profile @student.'
        )
    })
})

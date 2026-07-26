import { describe, expect, it } from 'vitest'
import { githubLoginsEqual } from './github-login'

describe('githubLoginsEqual', () => {
    it('matches GitHub logins case-insensitively without changing their identity', () => {
        expect(githubLoginsEqual('Student-Dev', 'student-dev')).toBe(true)
        expect(githubLoginsEqual('student-dev', 'studentdev')).toBe(false)
    })
})

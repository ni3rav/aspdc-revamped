'use client'

import { useActionState } from 'react'
import {
    registerForLeaderboard,
    type RegisterState,
} from '@/app/actions/register-leaderboard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const initialState: RegisterState = {
    message: undefined,
    success: undefined,
    errors: undefined,
}

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(
        registerForLeaderboard,
        initialState
    )

    return (
        <form action={formAction} className="max-w-md space-y-6">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    disabled={isPending}
                    required
                />
                {state?.errors?.fullName && (
                    <p className="text-sm text-red-500">
                        {state.errors.fullName[0]}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="codeforcesHandle">Codeforces Handle</Label>
                <Input
                    id="codeforcesHandle"
                    name="codeforcesHandle"
                    type="text"
                    placeholder="tourist"
                    disabled={isPending}
                    required
                />
                {state?.errors?.codeforcesHandle && (
                    <p className="text-sm text-red-500">
                        {state.errors.codeforcesHandle[0]}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="leetcodeHandle">LeetCode Handle</Label>
                <Input
                    id="leetcodeHandle"
                    name="leetcodeHandle"
                    type="text"
                    placeholder="leetcode_user"
                    disabled={isPending}
                    required
                />
                {state?.errors?.leetcodeHandle && (
                    <p className="text-sm text-red-500">
                        {state.errors.leetcodeHandle[0]}
                    </p>
                )}
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Registering...' : 'Register'}
            </Button>

            {state?.message && (
                <div
                    className={`rounded-md p-4 ${
                        state.success
                            ? 'border border-green-200 bg-green-50 text-green-800'
                            : 'border border-red-200 bg-red-50 text-red-800'
                    }`}
                >
                    {state.message}
                </div>
            )}
        </form>
    )
}

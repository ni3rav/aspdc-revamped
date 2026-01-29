'use client'

import { useActionState, useEffect } from 'react'
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

interface RegisterFormProps {
    onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [state, formAction, isPending] = useActionState(
        registerForLeaderboard,
        initialState
    )

    useEffect(() => {
        if (state?.success && onSuccess) {
            onSuccess()
        }
    }, [state?.success, onSuccess])

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">
                    Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    disabled={isPending}
                    required
                />
                {state?.errors?.fullName && (
                    <p className="text-destructive text-sm">
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
                />
                {state?.errors?.codeforcesHandle && (
                    <p className="text-destructive text-sm">
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
                />
                {state?.errors?.leetcodeHandle && (
                    <p className="text-destructive text-sm">
                        {state.errors.leetcodeHandle[0]}
                    </p>
                )}
            </div>

            <p className="text-muted-foreground text-xs">
                <span className="text-destructive">*</span> Required field. At
                least one handle (Codeforces or LeetCode) must be provided.
            </p>

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Registering...' : 'Register'}
            </Button>

            {state?.message && (
                <div
                    className={`rounded-md border p-3 text-sm ${
                        state.success
                            ? 'border-primary/20 bg-primary/10 text-primary'
                            : 'border-destructive/20 bg-destructive/10 text-destructive'
                    }`}
                >
                    {state.message}
                </div>
            )}
        </form>
    )
}

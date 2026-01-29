'use server'

import { z } from 'zod'
import { type CodeforcesUser } from '@/db/types'
import { getCodeforcesUser } from '@/lib/codeforces'
import { db } from '@/db/drizzle'
import { leaderboardUsers } from '@/db/schema'
import { revalidatePath } from 'next/cache'

const registrationSchema = z
    .object({
        fullName: z
            .string()
            .min(1, 'Full name is required')
            .transform((val) => val.trim())
            .refine((val) => val.length >= 2, {
                message: 'Full name must be at least 2 characters',
            }),
        codeforcesHandle: z
            .string()
            .transform((val) => val.trim())
            .optional(),
        leetcodeHandle: z
            .string()
            .transform((val) => val.trim())
            .optional(),
    })
    .refine(
        (data) => {
            const hasCodeforces =
                data.codeforcesHandle && data.codeforcesHandle.length > 0
            const hasLeetcode =
                data.leetcodeHandle && data.leetcodeHandle.length > 0
            return hasCodeforces || hasLeetcode
        },
        {
            message: 'At least one handle (Codeforces or LeetCode) is required',
            path: ['codeforcesHandle'],
        }
    )

export type RegisterState = {
    message?: string
    success?: boolean
    errors?: {
        fullName?: string[]
        codeforcesHandle?: string[]
        leetcodeHandle?: string[]
    }
    cfData?: CodeforcesUser
}

export async function registerForLeaderboard(
    prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    const validatedFields = registrationSchema.safeParse({
        fullName: formData.get('fullName'),
        codeforcesHandle: formData.get('codeforcesHandle'),
        leetcodeHandle: formData.get('leetcodeHandle'),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Please check your inputs.',
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { codeforcesHandle, fullName, leetcodeHandle } = validatedFields.data

    try {
        // Only validate Codeforces if provided
        if (codeforcesHandle) {
            const cfUser = await getCodeforcesUser(codeforcesHandle)

            if (!cfUser) {
                return {
                    success: false,
                    message: `Could not verify Codeforces user: ${codeforcesHandle}. Please check the username.`,
                }
            }
        }

        // Save to database
        await db.insert(leaderboardUsers).values({
            fullName,
            codeforcesHandle: codeforcesHandle || null,
            leetcodeHandle: leetcodeHandle || null,
        })

        revalidatePath('/leaderboard')

        return {
            success: true,
            message: `Successfully registered! Welcome to the leaderboard.`,
        }
    } catch (error) {
        console.error('Registration error:', error)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}

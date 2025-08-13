import * as z from 'zod'

export const authSchema = z.object({
    email: z.email('enter a valid email'),
    password: z.string().min(8, 'password must be 8 characters long'),
})

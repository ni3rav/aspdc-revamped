import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db/drizzle' // your drizzle instance
import { nextCookies } from 'better-auth/next-js'
import * as schema from '@/db/schema'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg', // or "mysql", "sqlite"
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [nextCookies()], // make sure this is the last plugin in the array
})

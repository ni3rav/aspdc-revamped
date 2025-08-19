import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { env } from '@/lib/env'

export async function middleware(request: NextRequest) {
    // Keep Supabase session up-to-date
    const response = await updateSession(request)

    // Create a Supabase client using the updated request/response
    const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Get the current user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // If no user is logged in, redirect to login
    if (!user) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*', // Only run for /admin and its children
    ],
}

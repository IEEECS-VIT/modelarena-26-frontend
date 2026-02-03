import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (!code) {
        return NextResponse.redirect(`${origin}/?error=no_code`)
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.session) {
        console.error('Session exchange error:', error)
        return NextResponse.redirect(`${origin}/?error=auth_failed`)
    }

    // Verify user exists in backend database
    if (!API_URL) {
        console.error('Backend API URL not configured')
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/?error=${encodeURIComponent('Backend not configured')}`)
    }

    try {
        const response = await fetch(`${API_URL}/user`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${data.session.access_token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            // User not registered on VTOP - sign them out
            const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }))
            const errorMessage = encodeURIComponent(errorData.error || 'Authentication failed')
            await supabase.auth.signOut()
            return NextResponse.redirect(`${origin}/?error=${errorMessage}`)
        }

        // User verified! Redirect to dashboard
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'

        if (isLocalEnv) {
            return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
            return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
            return NextResponse.redirect(`${origin}${next}`)
        }
    } catch (error) {
        console.error('Backend verification error:', error)
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/?error=verification_failed`)
    }
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/theme'
  const safeNext =
    next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')
      ? new URL(next, requestUrl.origin)
      : new URL('/theme', requestUrl.origin)

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const destination = safeNext.pathname === '/express'
        ? new URL('/theme', requestUrl.origin)
        : safeNext
      return NextResponse.redirect(destination)
    }
  }

  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
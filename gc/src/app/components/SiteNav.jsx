'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseBrowser'

export default function SiteNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsSignedIn(Boolean(user && !user.is_anonymous))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session?.user && !session.user.is_anonymous))
    })

    return () => subscription.unsubscribe()
  }, [])

  if (pathname === '/' || pathname === '/login') return null

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/theme')
    router.refresh()
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 md:px-10">
      <Link href="/theme" className="text-sm tracking-[0.2em] text-gray-300 hover:text-white">
        GRIEF CARTOGRAPHER
      </Link>
      {isSignedIn ? (
        <button
          type="button"
          onClick={handleSignOut}
          className="border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-400 hover:text-white"
        >
          Log out
        </button>
      ) : (
        <Link
          href={`/login?next=${encodeURIComponent(pathname || '/theme')}`}
          className="border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-400 hover:text-white"
        >
          Log in
        </Link>
      )}
    </header>
  )
}
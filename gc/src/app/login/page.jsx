'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseBrowser'

const SIGNUP_COOLDOWN_MS = 60_000
const SIGNUP_COOLDOWN_KEY = 'signup_confirmation_cooldown_until'

function getRequestedNextPath() {
  const requestedNext = new URLSearchParams(window.location.search).get('next')
  return requestedNext?.startsWith('/') && !requestedNext.startsWith('//') && !requestedNext.startsWith('/\\')
    ? requestedNext
    : '/theme'
}

function continueAfterLogin(router, user, nextPath) {
  const completedInterview = user?.user_metadata?.interview_completed === true
  router.replace(
    completedInterview
      ? nextPath
      : `/interview?next=${encodeURIComponent(nextPath)}`
  )
  router.refresh()
}

export default function LoginPage() {
  const [accessMode, setAccessMode] = useState('choose')
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [signupCooldownUntil, setSignupCooldownUntil] = useState(() => {
    if (typeof window === 'undefined') return 0
    return Number(window.localStorage.getItem(SIGNUP_COOLDOWN_KEY) || 0)
  })
  const [signupCooldownRemaining, setSignupCooldownRemaining] = useState(0)
  const router = useRouter()

  const continueAsReviewer = () => {
    const nextUrl = new URL(getRequestedNextPath(), window.location.origin)
    nextUrl.searchParams.set('mode', 'reviewer')
    router.replace(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`)
    router.refresh()
  }

  useEffect(() => {
    if (!signupCooldownUntil) return

    const updateCooldown = () => {
      const remainingSeconds = Math.max(0, Math.ceil((signupCooldownUntil - Date.now()) / 1000))
      setSignupCooldownRemaining(remainingSeconds)

      if (remainingSeconds === 0) {
        setSignupCooldownUntil(0)
        window.localStorage.removeItem(SIGNUP_COOLDOWN_KEY)
      }
    }

    updateCooldown()
    const intervalId = window.setInterval(updateCooldown, 1000)
    return () => window.clearInterval(intervalId)
  }, [signupCooldownUntil])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (mode === 'recovery') {
      setLoading(true)
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=%2Freset-password`,
        })

        if (error) {
          setError(error.message)
          return
        }

        setMessage('If an account exists for that email, we’ve sent a password reset link.')
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to send the reset email.')
      } finally {
        setLoading(false)
      }

      return
    }

    if (mode === 'signup' && signupCooldownUntil > Date.now()) {
      const remainingSeconds = Math.max(1, Math.ceil((signupCooldownUntil - Date.now()) / 1000))
      setError(`Please wait ${remainingSeconds} seconds before requesting another confirmation email.`)
      return
    }

    setLoading(true)
    let authResult
    try {
      const supabase = createClient()

      authResult =
        mode === 'signin'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=%2Ftheme`,
              },
            })
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? 'Unable to connect to the authentication service. Check your internet connection and try again.'
          : requestError instanceof Error
            ? requestError.message
            : 'Unable to complete the authentication request.'
      )
      return
    } finally {
      setLoading(false)
    }

    const { data, error } = authResult

    if (error) {
      setError(error.message)
      return
    }

    if (mode === 'signup' && !data.session) {
      const cooldownUntil = Date.now() + SIGNUP_COOLDOWN_MS
      setSignupCooldownUntil(cooldownUntil)
      setSignupCooldownRemaining(Math.ceil(SIGNUP_COOLDOWN_MS / 1000))
      window.localStorage.setItem(SIGNUP_COOLDOWN_KEY, String(cooldownUntil))
      setMessage('Check your email to verify your account, then return here to log in.')
      return
    }

    continueAfterLogin(router, data.user, getRequestedNextPath())
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="w-full max-w-sm canvas-border rounded-lg p-8">
        {accessMode === 'choose' ? (
          <>
            <h1 className="text-2xl font-light mb-8 text-center">Choose how to continue</h1>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setAccessMode('signin')}
                className="w-full py-2 rounded transition-colors"
                style={{ border: '1px solid rgba(237,237,237,0.3)' }}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={continueAsReviewer}
                className="w-full py-2 rounded transition-colors"
                style={{ border: '1px solid rgba(237,237,237,0.3)' }}
              >
                Reviewer mode
              </button>
              <p className="text-sm text-center text-gray-400">
                Reviewer mode skips sign-in and the questionnaire.
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-light mb-8 text-center">
              {mode === 'signin'
                ? 'Log in'
                : mode === 'signup'
                  ? 'Create an account'
                  : 'Reset your password'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border-b py-2 px-1 focus:outline-none transition-colors"
            style={{ borderColor: 'rgba(237,237,237,0.2)' }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(237,237,237,0.6)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(237,237,237,0.2)')}
          />
          {mode !== 'recovery' && (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-transparent border-b py-2 px-1 pr-10 focus:outline-none transition-colors"
                style={{ borderColor: 'rgba(237,237,237,0.2)' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(237,237,237,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(237,237,237,0.2)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 2l20 20" />
                    <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" />
                    <path d="M9.88 5.08A10.94 10.94 0 0 1 12 5c4.97 0 9 4.25 10 7-.7 1.38-2.4 3.84-5.04 5.24" />
                    <path d="M6.61 6.61A16.47 16.47 0 0 0 2 12c1 2.75 5.03 7 10 7 1.48 0 2.88-.25 4.14-.7" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {mode === 'signin' && (
            <button
              type="button"
              onClick={() => {
                setMode('recovery')
                setError(null)
                setMessage(null)
              }}
              className="text-sm underline opacity-60 hover:opacity-90 transition-opacity"
            >
              Forgot password?
            </button>
          )}

          {error && (
            <p className="text-sm" style={{ color: '#f87171' }}>
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-gray-400" role="status">
              {message}
            </p>
          )}
          {mode === 'signup' && signupCooldownRemaining > 0 && (
            <p className="text-sm text-gray-400" role="status">
              Please wait {signupCooldownRemaining} seconds before requesting another confirmation email.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || (mode === 'signup' && signupCooldownRemaining > 0)}
            className="w-full mt-4 py-2 rounded transition-colors disabled:opacity-50"
            style={{ border: '1px solid rgba(237,237,237,0.3)' }}
          >
            {loading
              ? 'Please wait...'
              : mode === 'recovery'
                ? 'Send reset link'
                : mode === 'signin'
                  ? 'Log in'
                  : signupCooldownRemaining > 0
                    ? `Wait ${signupCooldownRemaining}s`
                    : 'Sign up'}
          </button>
            </form>

            {mode !== 'recovery' && (
              <button
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup')
                  setError(null)
                  setMessage(null)
                }}
                className="mt-6 text-sm underline block mx-auto opacity-60 hover:opacity-90 transition-opacity"
              >
                {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
              </button>
            )}
            {mode === 'recovery' && (
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError(null)
                  setMessage(null)
                }}
                className="mt-6 text-sm underline block mx-auto opacity-60 hover:opacity-90 transition-opacity"
              >
                Back to log in
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setAccessMode('choose')
                setError(null)
                setMessage(null)
              }}
              className="mt-6 text-sm underline block mx-auto opacity-60 hover:opacity-90 transition-opacity"
            >
              Back to access options
            </button>
          </>
        )}
      </div>
    </div>
  )
}
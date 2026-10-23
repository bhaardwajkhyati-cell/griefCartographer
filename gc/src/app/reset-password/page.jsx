'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseBrowser'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      const completedInterview = user?.user_metadata?.interview_completed === true
      router.replace(completedInterview ? '/theme' : '/interview?next=%2Ftheme')
      router.refresh()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update the password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="w-full max-w-sm canvas-border rounded-lg p-8">
        <h1 className="text-2xl font-light mb-3 text-center">Choose a new password</h1>
        <p className="text-sm text-gray-400 mb-8 text-center">
          Enter and confirm your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full bg-transparent border-b py-2 px-1 focus:outline-none transition-colors"
            style={{ borderColor: 'rgba(237,237,237,0.2)' }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full bg-transparent border-b py-2 px-1 focus:outline-none transition-colors"
            style={{ borderColor: 'rgba(237,237,237,0.2)' }}
          />

          {error && (
            <p className="text-sm" style={{ color: '#f87171' }} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2 rounded transition-colors disabled:opacity-50"
            style={{ border: '1px solid rgba(237,237,237,0.3)' }}
          >
            {loading ? 'Please wait...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}

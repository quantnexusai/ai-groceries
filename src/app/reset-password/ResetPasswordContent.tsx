'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const { resetPassword, updatePassword } = useAuth()

  // If there's a recovery token in the URL, show the new-password form
  const hasRecoveryToken =
    searchParams.get('type') === 'recovery' || searchParams.has('token')

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const { error } = await updatePassword(newPassword)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  // Success state — request sent
  if (success && !hasRecoveryToken) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-leaf-100 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-leaf-600" />
        </div>
        <h1 className="font-display font-bold text-xl text-earth-600 mb-2">
          Check Your Email
        </h1>
        <p className="text-sm text-orchard-400 font-body mb-6">
          We&apos;ve sent a password reset link to <strong className="text-earth-500">{email}</strong>.
          Click the link in the email to set a new password.
        </p>
        <Link href="/auth" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    )
  }

  // Success state — password updated
  if (success && hasRecoveryToken) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-leaf-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-leaf-600" />
        </div>
        <h1 className="font-display font-bold text-xl text-earth-600 mb-2">
          Password Updated
        </h1>
        <p className="text-sm text-orchard-400 font-body mb-6">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>
        <Link href="/auth" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-sunbeam-100 flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-6 h-6 text-sunbeam-600" />
        </div>
        <h1 className="font-display font-bold text-xl text-earth-600 mb-1">
          {hasRecoveryToken ? 'Set New Password' : 'Reset Password'}
        </h1>
        <p className="text-sm text-orchard-400 font-body">
          {hasRecoveryToken
            ? 'Enter your new password below.'
            : 'Enter your email and we\'ll send you a reset link.'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-body">{error}</p>
        </div>
      )}

      {/* Request Reset Form */}
      {!hasRecoveryToken && (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="field-label">
              Email Address
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Sending reset link...' : 'Send Reset Link'}
          </button>

          <p className="text-center text-sm text-orchard-400 font-body">
            Remember your password?{' '}
            <Link
              href="/auth"
              className="text-leaf-600 hover:text-leaf-700 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}

      {/* Update Password Form */}
      {hasRecoveryToken && (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="field-label">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="input"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="field-label">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="input"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Updating password...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  )
}

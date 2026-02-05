'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth-context'

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp, isDemo } = useAuth()
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setError('')
  }

  const switchTab = (next: 'signin' | 'signup') => {
    setTab(next)
    setError('')
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        reset()
        router.push('/')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signUp(email, password, firstName, lastName)
      if (error) {
        setError(error.message)
      } else {
        reset()
        router.push('/')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sunbeam-50">
        <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
          {/* Logo / Branding */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <div className="w-10 h-10 rounded-xl bg-leaf-100 flex items-center justify-center group-hover:bg-leaf-200 transition-colors duration-500">
                <Leaf className="w-5 h-5 text-earth-500" />
              </div>
              <span className="font-display font-semibold text-xl text-earth-600">
                AI Groceries
              </span>
            </Link>
            <p className="text-sm text-orchard-400 font-body">
              {tab === 'signin'
                ? 'Welcome back. Sign in to your account.'
                : 'Create an account to start shopping.'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Tabs */}
            <div className="flex gap-6 mb-8 border-b border-orchard-100">
              <button
                onClick={() => switchTab('signin')}
                className={`pb-3 font-body font-semibold text-sm uppercase tracking-wider transition-all duration-300 border-b-2 ${
                  tab === 'signin'
                    ? 'text-earth-600 border-leaf-500'
                    : 'text-orchard-400 border-transparent hover:text-earth-500'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchTab('signup')}
                className={`pb-3 font-body font-semibold text-sm uppercase tracking-wider transition-all duration-300 border-b-2 ${
                  tab === 'signup'
                    ? 'text-earth-600 border-leaf-500'
                    : 'text-orchard-400 border-transparent hover:text-earth-500'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Demo notice */}
            {isDemo && (
              <div className="mb-4 p-3 bg-sunbeam-100 border border-sunbeam-200 rounded-xl">
                <p className="text-xs text-earth-500 font-body">
                  Running in demo mode. Authentication is simulated.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-body">{error}</p>
              </div>
            )}

            {/* Sign In Form */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="signin-email" className="field-label">
                    Email
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="signin-password" className="field-label">
                    Password
                  </label>
                  <input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="input"
                    required
                  />
                </div>

                <div className="text-right">
                  <Link
                    href="/reset-password"
                    className="text-sm text-leaf-600 hover:text-leaf-700 font-body transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Sign Up Form */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="signup-first" className="field-label">
                      First Name
                    </label>
                    <input
                      id="signup-first"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-last" className="field-label">
                      Last Name
                    </label>
                    <input
                      id="signup-last"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-email" className="field-label">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="field-label">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
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
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
              </form>
            )}

            {/* Footer link */}
            <p className="mt-6 text-center text-sm text-orchard-400 font-body">
              {tab === 'signin' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => switchTab('signup')}
                    className="text-leaf-600 hover:text-leaf-700 font-semibold transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => switchTab('signin')}
                    className="text-leaf-600 hover:text-leaf-700 font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

'use client'

import { ReactNode } from 'react'
import { LogIn } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import { useAuth } from '@/lib/auth-context'

export default function MyAccountLayout({ children }: { children: ReactNode }) {
  const { user, loading, isDemo } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {isDemo && <DemoBanner />}
      <Header />

      <main className="flex-1">
        {!user && !isDemo ? (
          <div className="max-w-md mx-auto px-4 py-24 text-center">
            <div className="card p-8">
              <LogIn className="w-12 h-12 text-orchard-200 mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold text-earth-600 mb-2">
                Sign in to view your account
              </h2>
              <p className="text-sm text-orchard-300 font-body mb-6">
                Access your profile, order history, and delivery preferences.
              </p>
              <Link href="/" className="btn-primary inline-flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {children}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

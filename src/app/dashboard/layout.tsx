'use client'

import { useAuth } from '@/lib/auth-context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, isDemo } = useAuth()

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen">
          <div className="section max-w-7xl mx-auto">
            <div className="card animate-slow-pulse h-96" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const isAdmin = isDemo || profile?.admin

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="pt-24 min-h-screen">
          <div className="section max-w-2xl mx-auto text-center">
            <div className="card p-12">
              <ShieldAlert className="w-16 h-16 text-orchard-300 mx-auto mb-6" />
              <h1 className="font-display text-display-sm text-earth-600 mb-4">Access Denied</h1>
              <p className="font-body text-orchard-400 mb-8">
                This area is restricted to platform administrators.
              </p>
              <Link href="/" className="btn-primary">
                Return Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      {isDemo && <DemoBanner />}
      <Header />
      <main className="pt-24 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}

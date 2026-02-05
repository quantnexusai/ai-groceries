'use client'

import { Suspense } from 'react'
import ResetPasswordContent from './ResetPasswordContent'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-sunbeam-50">
        <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
          <Suspense
            fallback={
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <p className="text-sm text-orchard-400 font-body">Loading...</p>
              </div>
            }
          >
            <ResetPasswordContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}

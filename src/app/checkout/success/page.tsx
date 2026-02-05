'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ShoppingBag, User } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/lib/cart-context'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || searchParams.get('session_id') || '---'
  const { clearCart } = useCart()

  // Clear cart on mount
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-leaf-100 flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-leaf-500" />
      </div>

      {/* Heading */}
      <h1 className="font-display font-semibold text-3xl lg:text-4xl text-earth-600 mb-3">
        Order Confirmed!
      </h1>

      {/* Order Number */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunbeam-50 border border-sunbeam-200 mb-4">
        <span className="text-xs text-orchard-400 font-body uppercase tracking-wider">
          Order
        </span>
        <span className="text-sm font-body font-semibold text-earth-600">
          {orderNumber}
        </span>
      </div>

      {/* Message */}
      <p className="text-orchard-400 font-body text-sm max-w-md mb-10 leading-relaxed">
        Your groceries are being prepared. You will receive a notification when
        your order is picked up for delivery. Thank you for shopping local!
      </p>

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/myaccount" className="btn-primary">
          <User className="w-4 h-4" />
          View My Orders
        </Link>
        <Link href="/stores" className="btn-secondary">
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-cream-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-leaf-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <SuccessContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  )
}

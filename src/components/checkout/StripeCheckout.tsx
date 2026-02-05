'use client'

import { useState } from 'react'
import { Loader2, CreditCard } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { isStripeConfigured } from '@/lib/stripe'
import { formatCurrency } from '@/lib/utils'

interface StripeCheckoutProps {
  amount: number
  disabled: boolean
  onCheckout: () => void
}

export default function StripeCheckout({
  amount,
  disabled,
  onCheckout,
}: StripeCheckoutProps) {
  const { isDemo } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading || disabled) return

    // Demo mode: simulate checkout
    if (isDemo || !isStripeConfigured()) {
      setLoading(true)
      // Simulate a brief processing delay
      await new Promise((resolve) => setTimeout(resolve, 1200))
      onCheckout()
      setLoading(false)
      return
    }

    // Real mode: call Stripe checkout session endpoint
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        setLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(false)
    }
  }

  const buttonLabel = isDemo || !isStripeConfigured()
    ? 'Complete Order (Demo)'
    : `Pay ${formatCurrency(amount)}`

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className="btn-primary w-full"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4" />
      )}
      {loading ? 'Processing...' : buttonLabel}
    </button>
  )
}

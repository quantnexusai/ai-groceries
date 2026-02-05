'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { formatCurrency } from '@/lib/utils'

interface CartSummaryProps {
  storeId?: string
}

const PLATFORM_FEE = 5.0

export default function CartSummary({ storeId }: CartSummaryProps) {
  const { subtotal, getStoreSubtotal, itemCount } = useCart()

  const displaySubtotal = storeId ? getStoreSubtotal(storeId) : subtotal
  const total = displaySubtotal + PLATFORM_FEE
  const checkoutHref = storeId
    ? `/checkout?store=${storeId}`
    : '/checkout'

  if (itemCount === 0) return null

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-lg text-earth-600 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-body">
          <span className="text-orchard-400">Subtotal</span>
          <span className="text-earth-500 font-medium">
            {formatCurrency(displaySubtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm font-body">
          <span className="text-orchard-400">Platform fee</span>
          <span className="text-earth-500 font-medium">
            {formatCurrency(PLATFORM_FEE)}
          </span>
        </div>

        <div className="border-t border-orchard-100 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-body font-semibold text-earth-600">Total</span>
            <span className="font-display font-semibold text-lg text-earth-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      <Link href={checkoutHref} className="btn-primary w-full mt-6 text-center block">
        Proceed to Checkout
      </Link>
    </div>
  )
}

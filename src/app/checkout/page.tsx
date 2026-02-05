'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AddressForm from '@/components/checkout/AddressForm'
import DeliverySlotPicker from '@/components/checkout/DeliverySlotPicker'
import DeliveryNotes from '@/components/cart/DeliveryNotes'
import OrderSummary from '@/components/checkout/OrderSummary'
import StripeCheckout from '@/components/checkout/StripeCheckout'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { generateOrderNumber } from '@/lib/utils'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

const PLATFORM_FEE = 5.0

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const storeId = searchParams.get('store')
  const { items, subtotal, getItemsByStore, getStoreSubtotal, clearCart, clearStoreItems } = useCart()
  const { isDemo } = useAuth()

  // Form state
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [notes, setNotes] = useState('')

  // Determine which items to check out
  const checkoutItems = useMemo(() => {
    if (storeId) {
      const groups = getItemsByStore()
      return groups[storeId] || []
    }
    return items
  }, [storeId, items, getItemsByStore])

  const checkoutSubtotal = storeId ? getStoreSubtotal(storeId) : subtotal
  const total = checkoutSubtotal + PLATFORM_FEE

  const isFormValid = address.trim() && phone.trim() && deliveryDate && deliveryTime

  const handleDemoCheckout = () => {
    const orderNumber = generateOrderNumber()

    // Clear the appropriate items
    if (storeId) {
      clearStoreItems(storeId)
    } else {
      clearCart()
    }

    router.push(`/checkout/success?order=${orderNumber}`)
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-sunbeam-50 flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-orchard-300" />
        </div>
        <h2 className="font-display font-semibold text-xl text-earth-500 mb-2">
          Nothing to check out
        </h2>
        <p className="text-sm text-orchard-400 font-body mb-8 max-w-sm">
          Add some items to your basket before proceeding to checkout.
        </p>
        <Link href="/stores" className="btn-primary">
          Browse Stores
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Forms */}
      <div className="lg:col-span-2 space-y-8">
        {/* Delivery Address */}
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-earth-600 mb-4">
            Delivery Details
          </h2>
          <AddressForm
            address={address}
            onChange={setAddress}
            phone={phone}
            onPhoneChange={setPhone}
          />
        </div>

        {/* Delivery Slot */}
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-earth-600 mb-4">
            Choose a Delivery Slot
          </h2>
          <DeliverySlotPicker
            selectedDate={deliveryDate}
            selectedTime={deliveryTime}
            onDateChange={setDeliveryDate}
            onTimeChange={setDeliveryTime}
          />
        </div>

        {/* Delivery Notes */}
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-earth-600 mb-4">
            Additional Notes
          </h2>
          <DeliveryNotes notes={notes} onChange={setNotes} />
        </div>
      </div>

      {/* Right Column: Summary & Payment */}
      <div className="space-y-6">
        <div className="sticky top-24 space-y-6">
          <OrderSummary items={checkoutItems} platformFee={PLATFORM_FEE} />

          <StripeCheckout
            amount={total}
            disabled={!isFormValid}
            onCheckout={handleDemoCheckout}
          />

          {!isFormValid && (
            <p className="text-xs text-orchard-400 font-body text-center">
              Please fill in your address, phone, and select a delivery slot to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <h1 className="font-display font-semibold text-3xl lg:text-4xl text-earth-600 mb-8">
            Checkout
          </h1>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-leaf-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <CheckoutContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  )
}

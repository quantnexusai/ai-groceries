'use client'

import Link from 'next/link'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import CartItemRow from '@/components/cart/CartItemRow'
import CartSummary from '@/components/cart/CartSummary'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
  const { items, itemCount, getItemsByStore, getStoreSubtotal } = useCart()
  const { isDemo } = useAuth()

  const storeGroups = getItemsByStore()
  const storeIds = Object.keys(storeGroups)

  return (
    <>
      {isDemo && <DemoBanner />}
      <Header />

      <main className="min-h-screen bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          {/* Heading */}
          <h1 className="font-display font-semibold text-3xl lg:text-4xl text-earth-600 mb-8">
            Your Basket
          </h1>

          {itemCount === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-sunbeam-50 flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-orchard-300" />
              </div>
              <h2 className="font-display font-semibold text-xl text-earth-500 mb-2">
                Your basket is empty
              </h2>
              <p className="text-sm text-orchard-400 font-body mb-8 max-w-sm">
                Explore local stores and add fresh groceries to your basket. Your items will appear here.
              </p>
              <Link href="/stores" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            /* Cart Content */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Items grouped by store */}
              <div className="lg:col-span-2 space-y-8">
                {storeIds.map((storeId) => {
                  const storeItems = storeGroups[storeId]
                  const storeName = storeItems[0]?.store_name || 'Store'
                  const storeSubtotal = getStoreSubtotal(storeId)

                  return (
                    <div key={storeId} className="card">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-orchard-100">
                        <h2 className="font-display font-semibold text-lg text-earth-600">
                          {storeName}
                        </h2>
                        <span className="text-sm text-orchard-400 font-body">
                          {storeItems.length} {storeItems.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>

                      <div>
                        {storeItems.map((item) => (
                          <CartItemRow key={item.item_id} item={item} />
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3">
                        <span className="text-sm text-orchard-400 font-body">
                          Store subtotal
                        </span>
                        <span className="text-sm font-semibold text-earth-600 font-body">
                          {formatCurrency(storeSubtotal)}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {/* Continue Shopping */}
                <Link
                  href="/stores"
                  className="inline-flex items-center gap-2 text-sm text-earth-400 hover:text-earth-600 font-body font-medium transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Right Sidebar: Summary (desktop) */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <CartSummary />
                </div>
              </div>

              {/* Mobile Summary (bottom) */}
              <div className="lg:hidden">
                <CartSummary />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

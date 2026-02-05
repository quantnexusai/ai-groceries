import { formatCurrency } from '@/lib/utils'
import type { CartItem } from '@/lib/types'

interface OrderSummaryProps {
  items: CartItem[]
  platformFee: number
}

export default function OrderSummary({ items, platformFee }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => {
    const price =
      item.sale_price && item.sale_price > 0 ? item.sale_price : item.price
    return sum + price * item.quantity
  }, 0)

  const total = subtotal + platformFee

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-lg text-earth-600 mb-4">
        Order Summary
      </h3>

      {/* Item list */}
      <div className="space-y-2 mb-4">
        {items.map((item) => {
          const price =
            item.sale_price && item.sale_price > 0 ? item.sale_price : item.price
          return (
            <div
              key={item.item_id}
              className="flex items-center justify-between text-sm font-body"
            >
              <span className="text-earth-500 truncate mr-2">
                {item.name}{' '}
                <span className="text-orchard-400">x{item.quantity}</span>
              </span>
              <span className="text-earth-500 font-medium flex-shrink-0">
                {formatCurrency(price * item.quantity)}
              </span>
            </div>
          )
        })}
      </div>

      <div className="border-t border-orchard-100 pt-3 space-y-2">
        <div className="flex items-center justify-between text-sm font-body">
          <span className="text-orchard-400">Subtotal</span>
          <span className="text-earth-500 font-medium">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm font-body">
          <span className="text-orchard-400">Platform fee</span>
          <span className="text-earth-500 font-medium">
            {formatCurrency(platformFee)}
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
    </div>
  )
}

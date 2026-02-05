'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatCurrency, formatWeight } from '@/lib/utils'
import type { CartItem } from '@/lib/types'

interface CartItemRowProps {
  item: CartItem
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart()

  const effectivePrice =
    item.sale_price && item.sale_price > 0 ? item.sale_price : item.price

  return (
    <div className="flex items-center gap-4 py-4 border-b border-orchard-50">
      {/* Image Placeholder */}
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-sunbeam-50 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl text-orchard-200">🥬</span>
        </div>
      )}

      {/* Item Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-body font-semibold text-sm text-earth-600 truncate">
          {item.name}
        </h3>
        <p className="text-xs text-orchard-400 font-body mt-0.5">
          {item.store_name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {item.sale_price && item.sale_price > 0 ? (
            <>
              <span className="text-sm font-semibold text-leaf-600 font-body">
                {formatCurrency(item.sale_price)}
              </span>
              <span className="text-xs text-orchard-300 line-through font-body">
                {formatCurrency(item.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-earth-500 font-body">
              {formatCurrency(item.price)}
            </span>
          )}
          <span className="text-xs text-orchard-300 font-body">
            {formatWeight(item.weight, item.measure_type)}
          </span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => updateQuantity(item.item_id, item.quantity - 1)}
          className="w-8 h-8 rounded-lg bg-sunbeam-50 text-earth-400 hover:bg-sunbeam-100 hover:text-earth-600 flex items-center justify-center transition-colors duration-300"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-earth-600 font-body">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.item_id, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
          className="w-8 h-8 rounded-lg bg-sunbeam-50 text-earth-400 hover:bg-sunbeam-100 hover:text-earth-600 flex items-center justify-center transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Line Total */}
      <div className="text-right flex-shrink-0 w-20">
        <p className="text-sm font-semibold text-earth-600 font-body">
          {formatCurrency(effectivePrice * item.quantity)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.item_id)}
        className="p-2 rounded-lg text-orchard-300 hover:text-red-500 hover:bg-red-50 transition-colors duration-300 flex-shrink-0"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

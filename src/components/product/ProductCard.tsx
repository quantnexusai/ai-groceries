'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatCurrency, getEffectivePrice, formatWeight } from '@/lib/utils'
import type { GroceryItem } from '@/lib/types'

interface ProductCardProps {
  item: GroceryItem
}

export default function ProductCard({ item }: ProductCardProps) {
  const { addItem } = useCart()
  const [animating, setAnimating] = useState(false)
  const effectivePrice = getEffectivePrice(item)
  const isOutOfStock = item.stock === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock) return

    addItem({
      item_id: item.id,
      store_id: item.store_id,
      store_name: item.store?.name || '',
      name: item.name,
      price: item.price,
      sale_price: item.sale ? item.sale_price : null,
      image_url: item.image_url,
      quantity: 1,
      stock: item.stock,
      measure_type: item.measure_type,
      weight: item.weight || 0,
    })

    setAnimating(true)
    setTimeout(() => setAnimating(false), 600)
  }

  return (
    <div className={`card-hover group relative ${animating ? 'animate-soft-drop' : ''}`}>
      <Link href={`/item/${item.id}`} className="block">
        {/* Image Area */}
        <div className="relative bg-sunbeam-50 rounded-xl h-48 flex items-center justify-center mb-4 overflow-hidden">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <Package className="w-10 h-10 text-orchard-300 group-hover:text-orchard-400 transition-colors duration-500" />
          )}

          {/* Sale Badge */}
          {item.sale && (
            <span className="absolute top-3 right-3 badge-fresh text-xs font-semibold">
              Sale
            </span>
          )}
        </div>

        {/* Item Info */}
        <h3 className="font-display font-medium text-earth-600 mb-1 line-clamp-2">
          {item.name}
        </h3>

        {item.store?.name && (
          <p className="text-sm text-orchard-400 mb-2">{item.store.name}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          {item.sale && item.sale_price && item.sale_price > 0 ? (
            <>
              <span className="font-body font-bold text-leaf-600">
                {formatCurrency(item.sale_price)}
              </span>
              <span className="text-sm text-orchard-300 line-through">
                {formatCurrency(item.price)}
              </span>
            </>
          ) : (
            <span className="font-body font-bold text-earth-600">
              {formatCurrency(item.price)}
            </span>
          )}
        </div>

        {/* Weight */}
        <p className="text-xs text-orchard-400 mb-3">
          {formatWeight(item.weight, item.measure_type)}
        </p>
      </Link>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full flex items-center justify-center gap-2 rounded-full py-2 px-4 text-sm font-body font-semibold transition-all duration-500 ease-harvest ${
          isOutOfStock
            ? 'bg-orchard-100 text-orchard-300 cursor-not-allowed'
            : 'btn-primary btn-sm'
        }`}
      >
        {isOutOfStock ? (
          <>
            <ShoppingBag className="w-4 h-4" />
            Out of Stock
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Plus, ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import type { GroceryItem } from '@/lib/types'

interface AddToCartButtonProps {
  item: GroceryItem
  quantity?: number
  className?: string
}

export default function AddToCartButton({ item, quantity = 1, className = '' }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [animating, setAnimating] = useState(false)
  const [added, setAdded] = useState(false)
  const isOutOfStock = item.stock === 0

  const handleClick = () => {
    if (isOutOfStock) return

    addItem({
      item_id: item.id,
      store_id: item.store_id,
      store_name: item.store?.name || '',
      name: item.name,
      price: item.price,
      sale_price: item.sale ? item.sale_price : null,
      image_url: item.image_url,
      quantity,
      stock: item.stock,
      measure_type: item.measure_type,
      weight: item.weight || 0,
    })

    setAnimating(true)
    setAdded(true)
    setTimeout(() => setAnimating(false), 600)
    setTimeout(() => setAdded(false), 2000)
  }

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`btn bg-orchard-100 text-orchard-300 cursor-not-allowed ${className}`}
      >
        <ShoppingBag className="w-5 h-5" />
        Out of Stock
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`btn-primary ${animating ? 'animate-soft-drop' : ''} ${className}`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Added!
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  )
}

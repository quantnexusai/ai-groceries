'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type { CartItem } from './types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  clearStoreItems: (storeId: string) => void
  itemCount: number
  subtotal: number
  getItemsByStore: () => Record<string, CartItem[]>
  getStoreSubtotal: (storeId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'ai-groceries-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, loaded])

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.item_id === item.item_id)
      if (existing) {
        return prev.map(i =>
          i.item_id === item.item_id
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
            : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.item_id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.item_id === itemId
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const clearStoreItems = useCallback((storeId: string) => {
    setItems(prev => prev.filter(i => i.store_id !== storeId))
  }, [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const subtotal = items.reduce((sum, i) => {
    const price = i.sale_price && i.sale_price > 0 ? i.sale_price : i.price
    return sum + price * i.quantity
  }, 0)

  const getItemsByStore = useCallback(() => {
    return items.reduce<Record<string, CartItem[]>>((groups, item) => {
      const key = item.store_id
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
      return groups
    }, {})
  }, [items])

  const getStoreSubtotal = useCallback((storeId: string) => {
    return items
      .filter(i => i.store_id === storeId)
      .reduce((sum, i) => {
        const price = i.sale_price && i.sale_price > 0 ? i.sale_price : i.price
        return sum + price * i.quantity
      }, 0)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearStoreItems,
        itemCount,
        subtotal,
        getItemsByStore,
        getStoreSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

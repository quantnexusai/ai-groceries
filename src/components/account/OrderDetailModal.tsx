'use client'

import { X, RotateCcw, MapPin, Clock, MessageSquare } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { demoItems } from '@/lib/demo-data'
import { useAuth } from '@/lib/auth-context'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order, OrderItem } from '@/lib/types'

interface DisplayOrder {
  id: string
  order_number?: string
  store_name?: string
  status_name?: string
  status_color?: string
  total?: number
  subtotal?: number
  platform_fee?: number
  delivery_address?: string
  delivery_time?: string
  notes?: string | null
  created_at?: string
  store_id?: string
  instruction?: string
  items?: Array<{
    id: string
    item_id: string | null
    item_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
  [key: string]: unknown
}

interface OrderDetailModalProps {
  order: DisplayOrder
  items: OrderItem[]
  isOpen: boolean
  onClose: () => void
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const { addItem } = useCart()
  const { isDemo } = useAuth()

  if (!isOpen) return null

  const orderNumber = order.order_number || order.id
  const storeName = (order.store_name as string) || 'Store'
  const statusName = (order.status_name as string) || 'Unknown'
  const statusColor = (order.status_color as string) || '#6B7280'
  const orderDate = (order.created_at as string) || (order.date as string) || ''
  const subtotal = (order.subtotal as number) || 0
  const platformFee = (order.platform_fee as number) || 0
  const total = (order.total as number) || 0
  const deliveryAddress = (order.delivery_address as string) || ''
  const deliveryTime = (order.delivery_time as string) || ''
  const notes = (order.notes as string) || (order.instruction as string) || ''
  const displayItems = (order.items || []) as Array<{
    id: string
    item_id: string | null
    item_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>

  const handleRepeatOrder = () => {
    displayItems.forEach((oi) => {
      if (!oi.item_id) return

      const catalogItem = isDemo ? demoItems.find((i) => i.id === oi.item_id) : null

      if (isDemo && catalogItem) {
        addItem({
          item_id: catalogItem.id,
          store_id: catalogItem.store_id,
          store_name: storeName,
          name: catalogItem.name,
          price: catalogItem.price,
          sale_price: catalogItem.sale ? catalogItem.sale_price : null,
          image_url: catalogItem.image_url,
          quantity: oi.quantity,
          stock: catalogItem.stock,
          measure_type: catalogItem.measure_type,
          weight: catalogItem.weight || 0,
        })
      } else {
        addItem({
          item_id: oi.item_id!,
          store_id: '',
          store_name: storeName,
          name: oi.item_name,
          price: oi.unit_price,
          sale_price: null,
          image_url: '',
          quantity: oi.quantity,
          stock: 999,
          measure_type: 'unit',
          weight: 0,
        })
      }
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-earth-600/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-soft-drop max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-sunbeam-200/60 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-earth-600">
              Order {orderNumber}
            </h2>
            <p className="text-xs text-orchard-300 font-body mt-0.5">
              {storeName} &middot; {orderDate ? formatDate(orderDate) : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-medium text-white"
              style={{ backgroundColor: statusColor }}
            >
              {statusName}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-orchard-300 hover:text-earth-600 hover:bg-sunbeam-50 transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Items */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-orchard-300 mb-3">
              Items
            </h3>
            <div className="space-y-2.5">
              {displayItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm font-body">
                  <div className="flex items-center gap-2 text-earth-500">
                    <span className="text-orchard-300 w-6 text-right">{item.quantity}x</span>
                    <span>{item.item_name}</span>
                  </div>
                  <span className="text-earth-600 font-medium">
                    {formatCurrency(item.total_price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-sunbeam-200/60 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-orchard-300 font-body">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-orchard-300 font-body">
              <span>Platform Fee</span>
              <span>{formatCurrency(platformFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-body font-semibold text-earth-600 pt-1 border-t border-sunbeam-200/60">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="border-t border-sunbeam-200/60 pt-4 space-y-3">
            <h3 className="font-body text-xs font-semibold uppercase tracking-wider text-orchard-300 mb-2">
              Delivery Details
            </h3>

            {deliveryAddress && (
              <div className="flex items-start gap-2.5 text-sm font-body text-earth-500">
                <MapPin className="w-4 h-4 text-orchard-300 flex-shrink-0 mt-0.5" />
                <span>{deliveryAddress}</span>
              </div>
            )}

            {deliveryTime && (
              <div className="flex items-start gap-2.5 text-sm font-body text-earth-500">
                <Clock className="w-4 h-4 text-orchard-300 flex-shrink-0 mt-0.5" />
                <span>{deliveryTime}</span>
              </div>
            )}

            {notes && (
              <div className="flex items-start gap-2.5 text-sm font-body text-earth-500">
                <MessageSquare className="w-4 h-4 text-orchard-300 flex-shrink-0 mt-0.5" />
                <span>{notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-sunbeam-200/60 bg-sunbeam-50/30">
          <button
            onClick={handleRepeatOrder}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Repeat Order
          </button>
        </div>
      </div>
    </div>
  )
}

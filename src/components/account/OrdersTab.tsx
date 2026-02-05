'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, RotateCcw, Package } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { supabase } from '@/lib/supabase'
import { demoOrders, demoOrderItems, demoStores, demoItems, demoOrderStatuses } from '@/lib/demo-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order, OrderItem } from '@/lib/types'
import OrderDetailModal from './OrderDetailModal'

interface DisplayOrder {
  id: string
  order_number: string
  store_name: string
  status_name: string
  status_color: string
  date: string
  total: number
  subtotal: number
  platform_fee: number
  delivery_address: string
  delivery_time: string
  notes: string | null
  item_count: number
  items: DisplayOrderItem[]
  [key: string]: unknown
}

interface DisplayOrderItem {
  id: string
  item_id: string | null
  item_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export default function OrdersTab() {
  const { user, isDemo } = useAuth()
  const { addItem } = useCart()
  const [orders, setOrders] = useState<DisplayOrder[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [modalOrder, setModalOrder] = useState<DisplayOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo) {
      const mapped: DisplayOrder[] = demoOrders
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((o) => {
          const store = demoStores.find((s) => s.id === o.store_id)
          const status = demoOrderStatuses.find((s) => s.id === o.status_id)
          const items = demoOrderItems
            .filter((oi) => oi.order_id === o.id)
            .map((oi) => ({
              id: oi.id,
              item_id: oi.item_id,
              item_name: oi.item_name,
              quantity: oi.quantity,
              unit_price: oi.unit_price || oi.price_at_purchase || 0,
              total_price: oi.total_price || (oi.unit_price || oi.price_at_purchase || 0) * oi.quantity,
            }))

          return {
            id: o.id,
            order_number: `GR-${o.id.replace('order-', '').padStart(4, '0')}`,
            store_name: store?.name || 'Unknown Store',
            status_name: status?.name || 'Unknown',
            status_color: status?.color || '#6B7280',
            date: o.created_at,
            total: o.total || o.total_price || 0,
            subtotal: o.subtotal,
            platform_fee: o.platform_fee,
            delivery_address: o.delivery_address,
            delivery_time: o.delivery_date || '',
            notes: o.notes || null,
            item_count: items.reduce((sum, i) => sum + i.quantity, 0),
            items,
          }
        })
      setOrders(mapped)
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      if (!user) return
      try {
        const { data } = await supabase
          .from('orders')
          .select('*, order_items(*), stores(name), order_statuses(name, color)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (data) {
          const mapped: DisplayOrder[] = data.map((o: Record<string, unknown>) => {
            const orderItems = (o.order_items as Record<string, unknown>[]) || []
            return {
              id: o.id as string,
              order_number: (o.order_number as string) || `GR-${(o.id as string).slice(0, 6)}`,
              store_name: ((o.stores as Record<string, unknown>)?.name as string) || 'Store',
              status_name: ((o.order_statuses as Record<string, unknown>)?.name as string) || 'Unknown',
              status_color: ((o.order_statuses as Record<string, unknown>)?.color as string) || '#6B7280',
              date: o.created_at as string,
              total: (o.total as number) || 0,
              subtotal: (o.subtotal as number) || 0,
              platform_fee: (o.platform_fee as number) || 0,
              delivery_address: (o.delivery_address as string) || '',
              delivery_time: (o.delivery_date as string) || '',
              notes: (o.notes as string) || null,
              item_count: orderItems.reduce((sum: number, i: Record<string, unknown>) => sum + (i.quantity as number || 0), 0),
              items: orderItems.map((i: Record<string, unknown>) => ({
                id: i.id as string,
                item_id: (i.item_id as string) || null,
                item_name: (i.item_name as string) || '',
                quantity: (i.quantity as number) || 0,
                unit_price: (i.unit_price as number) || 0,
                total_price: (i.total_price as number) || 0,
              })),
            }
          })
          setOrders(mapped)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, isDemo])

  const handleRepeatOrder = (order: DisplayOrder) => {
    order.items.forEach((oi) => {
      if (!oi.item_id) return

      const catalogItem = isDemo
        ? demoItems.find((i) => i.id === oi.item_id)
        : null

      if (isDemo && catalogItem) {
        addItem({
          item_id: catalogItem.id,
          store_id: catalogItem.store_id,
          store_name: order.store_name,
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
          item_id: oi.item_id,
          store_id: '',
          store_name: order.store_name,
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
  }

  if (loading) {
    return (
      <div className="card p-12 text-center">
        <div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-orchard-300 font-body mt-4">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Package className="w-12 h-12 text-orchard-200 mx-auto mb-4" />
        <h3 className="font-display text-lg font-semibold text-earth-600 mb-2">No orders yet</h3>
        <p className="text-sm text-orchard-300 font-body">
          Once you place your first order, it will appear here.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => {
          const expanded = expandedId === order.id
          return (
            <div key={order.id} className="card overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => setExpandedId(expanded ? null : order.id)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-sunbeam-50/50 transition-colors duration-300"
              >
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-body font-semibold text-sm text-earth-600">
                      {order.order_number}
                    </span>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-medium text-white"
                      style={{ backgroundColor: order.status_color }}
                    >
                      {order.status_name}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-orchard-300 font-body">
                    <span>{order.store_name}</span>
                    <span>{formatDate(order.date)}</span>
                    <span>{order.item_count} item{order.item_count !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body font-semibold text-earth-600 text-sm">
                    {formatCurrency(order.total)}
                  </span>
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 text-orchard-300" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-orchard-300" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {expanded && (
                <div className="px-5 pb-5 border-t border-sunbeam-200/60">
                  <div className="pt-4 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm font-body"
                      >
                        <div className="flex items-center gap-2 text-earth-500">
                          <span className="text-orchard-300">{item.quantity}x</span>
                          <span>{item.item_name}</span>
                        </div>
                        <span className="text-earth-600 font-medium">
                          {formatCurrency(item.total_price)}
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-sunbeam-200/60 pt-3 space-y-1">
                      <div className="flex justify-between text-xs text-orchard-300 font-body">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-orchard-300 font-body">
                        <span>Platform Fee</span>
                        <span>{formatCurrency(order.platform_fee)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-body font-semibold text-earth-600 pt-1">
                        <span>Total</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setModalOrder(order)}
                        className="btn-ghost btn-sm text-xs"
                      >
                        View Full Details
                      </button>
                      <button
                        onClick={() => handleRepeatOrder(order)}
                        className="btn-secondary btn-sm text-xs flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Repeat Order
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Order Detail Modal */}
      {modalOrder && (
        <OrderDetailModal
          order={modalOrder}
          items={modalOrder.items as unknown as OrderItem[] || []}
          isOpen={!!modalOrder}
          onClose={() => setModalOrder(null)}
        />
      )}
    </>
  )
}

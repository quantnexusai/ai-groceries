'use client'

import { useState, useEffect } from 'react'
import { Eye, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import {
  demoOrders,
  demoOrderItems,
  demoStores,
  demoOrderStatuses,
} from '@/lib/demo-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import OrderDetailModal from '@/components/account/OrderDetailModal'
import type { Order, OrderItem } from '@/lib/types'

interface AdminOrder {
  id: string
  order_number: string
  buyer_name: string
  store_name: string
  status_name: string
  status_id: string
  status_color: string
  date: string
  total: number
  subtotal: number
  platform_fee: number
  delivery_address: string
  delivery_time: string
  notes: string | null
  items: {
    id: string
    item_id: string | null
    item_name: string
    quantity: number
    unit_price: number
    total_price: number
  }[]
  [key: string]: unknown
}

const STATUS_OPTIONS = ['All', 'New', 'Assembled', 'Picked Up', 'Delivered', 'Canceled']

export default function AdminOrdersTab() {
  const { isDemo } = useAuth()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  useEffect(() => {
    if (isDemo) {
      const mapped: AdminOrder[] = demoOrders
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
            buyer_name: 'Maria Hernandez',
            store_name: store?.name || 'Store',
            status_name: status?.name || 'Unknown',
            status_id: o.status_id || '',
            status_color: status?.color || '#6B7280',
            date: o.created_at,
            total: o.total || o.total_price || 0,
            subtotal: o.subtotal,
            platform_fee: o.platform_fee,
            delivery_address: o.delivery_address,
            delivery_time: o.delivery_date || '',
            notes: o.notes ?? null,
            items,
          }
        })
      setOrders(mapped)
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        const { data } = await supabase
          .from('orders')
          .select('*, order_items(*), stores(name), order_statuses(name, color), profiles(full_name)')
          .order('created_at', { ascending: false })

        if (data) {
          const mapped: AdminOrder[] = data.map((o: Record<string, unknown>) => {
            const orderItems = (o.order_items as Record<string, unknown>[]) || []
            return {
              id: o.id as string,
              order_number: (o.order_number as string) || `GR-${(o.id as string).slice(0, 6)}`,
              buyer_name: ((o.profiles as Record<string, unknown>)?.full_name as string) || 'Customer',
              store_name: ((o.stores as Record<string, unknown>)?.name as string) || 'Store',
              status_name: ((o.order_statuses as Record<string, unknown>)?.name as string) || 'Unknown',
              status_id: (o.status_id as string) || '',
              status_color: ((o.order_statuses as Record<string, unknown>)?.color as string) || '#6B7280',
              date: o.created_at as string,
              total: (o.total as number) || 0,
              subtotal: (o.subtotal as number) || 0,
              platform_fee: (o.platform_fee as number) || 0,
              delivery_address: (o.delivery_address as string) || '',
              delivery_time: (o.delivery_date as string) || '',
              notes: (o.notes as string) || null,
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
  }, [isDemo])

  const handleStatusChange = async (orderId: string, newStatusName: string) => {
    const statusObj = demoOrderStatuses.find(
      (s) => s.name.toLowerCase() === newStatusName.toLowerCase()
    )
    if (!statusObj) return

    if (isDemo) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status_name: statusObj.name, status_id: statusObj.id, status_color: statusObj.color }
            : o
        )
      )
      return
    }

    try {
      await supabase.from('orders').update({ status_id: statusObj.id }).eq('id', orderId)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status_name: statusObj.name, status_id: statusObj.id, status_color: statusObj.color }
            : o
        )
      )
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const filteredOrders =
    statusFilter === 'All'
      ? orders
      : orders.filter((o) => o.status_name.toLowerCase() === statusFilter.toLowerCase())

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filter */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-orchard-300 font-body">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </p>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pr-8 text-sm appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orchard-300 pointer-events-none" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-sunbeam-200/60">
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Store</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sunbeam-200/40">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-sunbeam-50/50 transition-colors duration-200">
                    <td className="px-6 py-3.5 text-sm font-body font-medium text-earth-600">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-body text-earth-500">
                      {order.buyer_name}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-body text-earth-500">
                      {order.store_name}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="relative inline-block">
                        <select
                          value={order.status_name}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="appearance-none text-xs font-body font-medium text-white px-3 py-1 pr-6 rounded-full cursor-pointer outline-none"
                          style={{ backgroundColor: order.status_color }}
                        >
                          {demoOrderStatuses.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/80 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-body text-orchard-300">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-body font-medium text-earth-600 text-right">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-ghost btn-sm inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-orchard-300 font-body">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          items={selectedOrder.items as unknown as OrderItem[]}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  ShoppingBag,
  DollarSign,
  Store,
  Users,
  Save,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import {
  demoOrders,
  demoOrderItems,
  demoStores,
  demoPlatformFee,
  demoOrderStatuses,
} from '@/lib/demo-data'
import { formatCurrency, formatDate } from '@/lib/utils'

interface StatCard {
  label: string
  value: string
  icon: React.ElementType
  color: string
}

export default function OverviewTab() {
  const { isDemo } = useAuth()
  const [stats, setStats] = useState<StatCard[]>([])
  const [recentOrders, setRecentOrders] = useState<
    { id: string; order_number: string; buyer: string; store: string; status: string; statusColor: string; date: string; total: number }[]
  >([])
  const [currentFee, setCurrentFee] = useState(0)
  const [newFee, setNewFee] = useState('')
  const [feeSaving, setFeeSaving] = useState(false)
  const [feeMessage, setFeeMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo) {
      const totalRevenue = demoOrders.reduce((sum, o) => sum + (o.total || o.total_price || 0), 0)
      setStats([
        { label: 'Total Orders', value: String(demoOrders.length), icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
        { label: 'Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'bg-leaf-100 text-leaf-600' },
        { label: 'Active Stores', value: String(demoStores.filter((s) => s.active).length), icon: Store, color: 'bg-sunbeam-100 text-sunbeam-600' },
        { label: 'Customers', value: '2', icon: Users, color: 'bg-purple-100 text-purple-600' },
      ])

      const recent = demoOrders
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((o) => {
          const store = demoStores.find((s) => s.id === o.store_id)
          const status = demoOrderStatuses.find((s) => s.id === o.status_id)
          return {
            id: o.id,
            order_number: `GR-${o.id.replace('order-', '').padStart(4, '0')}`,
            buyer: 'Maria Hernandez',
            store: store?.name || 'Store',
            status: status?.name || 'Unknown',
            statusColor: status?.color || '#6B7280',
            date: o.created_at,
            total: o.total || o.total_price || 0,
          }
        })
      setRecentOrders(recent)
      setCurrentFee(demoPlatformFee.fee)
      setNewFee(String(demoPlatformFee.fee))
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      try {
        const [ordersRes, storesRes, customersRes, feeRes] = await Promise.all([
          supabase.from('orders').select('id, total, created_at, store_id, user_id, status_id, delivery_address'),
          supabase.from('stores').select('id, name, active'),
          supabase.from('profiles').select('id').eq('admin', false),
          supabase.from('platform_fees').select('*').order('updated_at', { ascending: false }).limit(1),
        ])

        const orders = ordersRes.data || []
        const stores = storesRes.data || []
        const customers = customersRes.data || []
        const fee = feeRes.data?.[0]

        const totalRevenue = orders.reduce((sum: number, o: Record<string, unknown>) => sum + ((o.total as number) || 0), 0)

        setStats([
          { label: 'Total Orders', value: String(orders.length), icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
          { label: 'Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'bg-leaf-100 text-leaf-600' },
          { label: 'Active Stores', value: String(stores.filter((s: Record<string, unknown>) => s.active).length), icon: Store, color: 'bg-sunbeam-100 text-sunbeam-600' },
          { label: 'Customers', value: String(customers.length), icon: Users, color: 'bg-purple-100 text-purple-600' },
        ])

        if (fee) {
          setCurrentFee(fee.fee)
          setNewFee(String(fee.fee))
        }
      } catch (error) {
        console.error('Error fetching overview:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isDemo])

  const handleFeeSave = async () => {
    const parsed = parseFloat(newFee)
    if (isNaN(parsed) || parsed < 0) {
      setFeeMessage('Please enter a valid fee amount.')
      return
    }

    setFeeSaving(true)
    setFeeMessage('')

    if (isDemo) {
      setCurrentFee(parsed)
      setFeeMessage('Platform fee updated (demo mode).')
      setFeeSaving(false)
      setTimeout(() => setFeeMessage(''), 3000)
      return
    }

    try {
      const { error } = await supabase
        .from('platform_fees')
        .update({ fee: parsed, updated_at: new Date().toISOString() })
        .eq('id', 'fee-1')

      if (error) throw error
      setCurrentFee(parsed)
      setFeeMessage('Platform fee updated successfully.')
    } catch {
      setFeeMessage('Failed to update platform fee.')
    } finally {
      setFeeSaving(false)
      setTimeout(() => setFeeMessage(''), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-display font-semibold text-earth-600">
                {stat.value}
              </p>
              <p className="text-xs text-orchard-300 font-body mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Platform Fee + AI Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Fee */}
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold text-earth-600 mb-4">
            Platform Fee
          </h3>
          <p className="text-sm text-orchard-300 font-body mb-4">
            Current fee: <span className="font-semibold text-earth-600">{formatCurrency(currentFee)}</span> per order
          </p>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orchard-300" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                className="input pl-9"
                placeholder="5.00"
              />
            </div>
            <button
              onClick={handleFeeSave}
              disabled={feeSaving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {feeSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
          {feeMessage && (
            <p className="text-xs font-body mt-2 text-leaf-600">{feeMessage}</p>
          )}
        </div>

        {/* AI Inventory Alerts */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-sunbeam-500" />
            <h3 className="font-display text-lg font-semibold text-earth-600">
              AI Inventory Alerts
            </h3>
          </div>
          <div className="surface p-5 rounded-xl text-center">
            <Sparkles className="w-10 h-10 text-orchard-200 mx-auto mb-3" />
            <p className="text-sm font-body text-earth-500 font-medium mb-1">
              Predictive Inventory Alerts
            </p>
            <p className="text-xs text-orchard-300 font-body">
              Connect the Claude API to enable AI-powered predictive inventory alerts.
              Get notified before items run out based on historical sales patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-sunbeam-200/60">
          <h3 className="font-display text-lg font-semibold text-earth-600">
            Recent Orders
          </h3>
        </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-sunbeam-200/40">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-sunbeam-50/50 transition-colors duration-200">
                  <td className="px-6 py-3.5 text-sm font-body font-medium text-earth-600">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-body text-earth-500">
                    {order.buyer}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-body text-earth-500">
                    {order.store}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-medium text-white"
                      style={{ backgroundColor: order.statusColor }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm font-body text-orchard-300">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-body font-medium text-earth-600 text-right">
                    {formatCurrency(order.total)}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-orchard-300 font-body">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

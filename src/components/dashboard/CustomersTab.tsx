'use client'

import { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { demoOrders } from '@/lib/demo-data'
import { formatDate } from '@/lib/utils'

interface CustomerRow {
  id: string
  name: string
  email: string
  zip: string
  order_count: number
  joined: string
}

// Demo customers for demo mode
const demoCustomers: CustomerRow[] = [
  {
    id: 'demo-user-id',
    name: 'Maria Hernandez',
    email: 'maria@aigroceries.com',
    zip: '10001',
    order_count: demoOrders.filter((o) => o.user_id === 'demo-user-id').length,
    joined: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'demo-cust-2',
    name: 'James Chen',
    email: 'james.chen@example.com',
    zip: '10002',
    order_count: 3,
    joined: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'demo-cust-3',
    name: 'Aisha Williams',
    email: 'aisha.w@example.com',
    zip: '10003',
    order_count: 7,
    joined: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'demo-cust-4',
    name: 'Tom Nakamura',
    email: 'tom.n@example.com',
    zip: '10001',
    order_count: 1,
    joined: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'demo-cust-5',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    zip: '10004',
    order_count: 5,
    joined: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
]

export default function CustomersTab() {
  const { isDemo } = useAuth()
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo) {
      setCustomers(demoCustomers)
      setLoading(false)
      return
    }

    const fetchCustomers = async () => {
      try {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .eq('admin', false)
          .order('created_at', { ascending: false })

        if (profiles) {
          // Fetch order counts
          const { data: orderCounts } = await supabase
            .from('orders')
            .select('user_id')

          const countMap: Record<string, number> = {}
          if (orderCounts) {
            orderCounts.forEach((o: Record<string, unknown>) => {
              const uid = o.user_id as string
              countMap[uid] = (countMap[uid] || 0) + 1
            })
          }

          const rows: CustomerRow[] = profiles.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            name: (p.full_name as string) || 'Unnamed',
            email: (p.email as string) || '',
            zip: (p.zip_code as string) || '',
            order_count: countMap[p.id as string] || 0,
            joined: (p.created_at as string) || '',
          }))

          setCustomers(rows)
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [isDemo])

  const filtered = searchQuery.trim()
    ? customers.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customers

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-orchard-300 font-body">
          {filtered.length} customer{filtered.length !== 1 ? 's' : ''}
        </p>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orchard-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="input pl-9 text-sm"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-sunbeam-200/60">
                <th className="px-6 py-3 text-left text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Email</th>
                <th className="px-6 py-3 text-center text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">ZIP</th>
                <th className="px-6 py-3 text-center text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Orders</th>
                <th className="px-6 py-3 text-right text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sunbeam-200/40">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-sunbeam-50/50 transition-colors duration-200">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-leaf-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-body font-semibold text-earth-600">
                          {customer.name
                            .split(' ')
                            .map((n) => n.charAt(0))
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm font-body font-medium text-earth-600">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm font-body text-orchard-300">
                    {customer.email}
                  </td>
                  <td className="px-6 py-3.5 text-center text-sm font-body text-earth-500">
                    {customer.zip || '--'}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="badge-earth text-xs">{customer.order_count}</span>
                  </td>
                  <td className="px-6 py-3.5 text-right text-sm font-body text-orchard-300">
                    {customer.joined ? formatDate(customer.joined) : '--'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users className="w-10 h-10 text-orchard-200 mx-auto mb-3" />
                    <p className="text-sm text-orchard-300 font-body">
                      {searchQuery ? 'No customers match your search.' : 'No customers yet.'}
                    </p>
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

'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Sparkles, Package, TrendingDown } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { demoItems, demoStores } from '@/lib/demo-data'

interface AlertItem {
  id: string
  name: string
  store_name: string
  stock: number
  reorder_suggestion: string
}

export default function InventoryAlerts() {
  const { isDemo } = useAuth()
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(true)
  const [aiConnected] = useState(false)

  useEffect(() => {
    if (isDemo) {
      const lowStock = demoItems
        .filter((i) => i.stock < 30)
        .sort((a, b) => a.stock - b.stock)
        .map((i) => {
          const store = demoStores.find((s) => s.id === i.store_id)
          let suggestion = 'Reorder soon'
          if (i.stock < 10) suggestion = 'Critical — reorder immediately'
          else if (i.stock < 20) suggestion = 'Low stock — reorder within 2 days'
          else suggestion = 'Monitor — reorder within the week'

          return {
            id: i.id,
            name: i.name,
            store_name: store?.name || 'Store',
            stock: i.stock,
            reorder_suggestion: suggestion,
          }
        })
      setAlerts(lowStock)
      setLoading(false)
      return
    }

    const fetchAlerts = async () => {
      try {
        const { data } = await supabase
          .from('items')
          .select('id, name, stock, store_id, stores(name)')
          .lt('stock', 30)
          .order('stock', { ascending: true })

        if (data) {
          const mapped: AlertItem[] = data.map((i: Record<string, unknown>) => {
            const stock = i.stock as number
            let suggestion = 'Monitor — reorder within the week'
            if (stock < 10) suggestion = 'Critical — reorder immediately'
            else if (stock < 20) suggestion = 'Low stock — reorder within 2 days'

            return {
              id: i.id as string,
              name: i.name as string,
              store_name: ((i.stores as Record<string, unknown>)?.name as string) || 'Store',
              stock,
              reorder_suggestion: suggestion,
            }
          })
          setAlerts(mapped)
        }
      } catch (error) {
        console.error('Error fetching inventory alerts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [isDemo])

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-sunbeam-200/60 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-sunbeam-500" />
        <h3 className="font-display text-lg font-semibold text-earth-600">
          Inventory Alerts
        </h3>
        {alerts.length > 0 && (
          <span className="badge-warning text-xs ml-auto">{alerts.length} alert{alerts.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="p-8 text-center">
          <Package className="w-10 h-10 text-orchard-200 mx-auto mb-3" />
          <p className="text-sm text-orchard-300 font-body">
            All items are well-stocked. No alerts at this time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-sunbeam-200/40">
          {alerts.map((alert) => (
            <div key={alert.id} className="px-6 py-4 flex items-center gap-4 hover:bg-sunbeam-50/50 transition-colors duration-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                alert.stock < 10
                  ? 'bg-red-100 text-red-600'
                  : alert.stock < 20
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-sunbeam-100 text-sunbeam-600'
              }`}>
                <TrendingDown className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-earth-600 truncate">
                  {alert.name}
                </p>
                <p className="text-xs text-orchard-300 font-body">
                  {alert.store_name}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-body font-semibold ${
                  alert.stock < 10 ? 'text-red-600' : alert.stock < 20 ? 'text-amber-600' : 'text-sunbeam-600'
                }`}>
                  {alert.stock} left
                </p>
                <p className="text-xs text-orchard-300 font-body">
                  {alert.reorder_suggestion}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Prediction Section */}
      <div className="px-6 py-5 border-t border-sunbeam-200/60 bg-sunbeam-50/30">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-sunbeam-500" />
          <h4 className="text-sm font-body font-semibold text-earth-600">AI Predictions</h4>
        </div>
        {aiConnected ? (
          <div className="space-y-2">
            <p className="text-sm text-earth-500 font-body">
              Based on historical trends, the following items are predicted to run out within 48 hours:
            </p>
            <ul className="text-sm text-orchard-300 font-body list-disc list-inside space-y-1">
              <li>Butter Croissants (4-pack) - estimated stockout: Saturday 11:00 AM</li>
              <li>King Crab Legs - estimated stockout: Friday 6:00 PM</li>
            </ul>
          </div>
        ) : (
          <div className="surface p-4 rounded-xl text-center">
            <p className="text-sm text-orchard-300 font-body">
              Connect the Claude API to enable predictive analytics.
              AI will forecast stock-out dates based on sales velocity, seasonal patterns, and demand trends.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

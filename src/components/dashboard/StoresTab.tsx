'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, ToggleLeft, ToggleRight, Star, MapPin } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { demoStores, demoItems } from '@/lib/demo-data'
import type { Store } from '@/lib/types'
import StoreForm from './StoreForm'

export default function StoresTab() {
  const { isDemo } = useAuth()
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (isDemo) {
      setStores(demoStores as unknown as Store[])
      setLoading(false)
      return
    }

    const fetchStores = async () => {
      try {
        const { data } = await supabase.from('stores').select('*').order('created_at', { ascending: false })
        if (data) setStores(data)
      } catch (error) {
        console.error('Error fetching stores:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [isDemo])

  const getItemCount = (storeId: string): number => {
    if (isDemo) {
      return demoItems.filter((i) => i.store_id === storeId).length
    }
    return 0
  }

  const handleToggleActive = async (store: Store) => {
    const updated = { ...store, active: !store.active }

    if (isDemo) {
      setStores((prev) => prev.map((s) => (s.id === store.id ? updated : s)))
      return
    }

    try {
      await supabase.from('stores').update({ active: !store.active }).eq('id', store.id)
      setStores((prev) => prev.map((s) => (s.id === store.id ? updated : s)))
    } catch (error) {
      console.error('Error toggling store:', error)
    }
  }

  const handleSaveStore = (storeData: Partial<Store>) => {
    if (editingStore) {
      const updated = { ...editingStore, ...storeData } as Store
      setStores((prev) => prev.map((s) => (s.id === editingStore.id ? updated : s)))
      setEditingStore(null)
    } else {
      const newStore: Store = {
        id: `store-${Date.now()}`,
        name: storeData.name || 'New Store',
        address: storeData.address || '',
        logo_url: '',
        serviced_zips: storeData.serviced_zips || [],
        departments: storeData.departments || [],
        active: storeData.active ?? true,
        description: storeData.description || '',
        rating: 0,
        review_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setStores((prev) => [newStore, ...prev])
      setShowAddForm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-leaf-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (showAddForm || editingStore) {
    return (
      <StoreForm
        store={editingStore || undefined}
        onSave={handleSaveStore}
        onCancel={() => {
          setShowAddForm(false)
          setEditingStore(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-orchard-300 font-body">
          {stores.length} store{stores.length !== 1 ? 's' : ''} registered
        </p>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary btn-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Store
        </button>
      </div>

      {/* Stores Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-sunbeam-200/60">
                <th className="px-6 py-3 text-left text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Store</th>
                <th className="px-6 py-3 text-left text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Address</th>
                <th className="px-6 py-3 text-center text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Status</th>
                <th className="px-6 py-3 text-center text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Items</th>
                <th className="px-6 py-3 text-center text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Rating</th>
                <th className="px-6 py-3 text-right text-xs font-body font-semibold uppercase tracking-wider text-orchard-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sunbeam-200/40">
              {stores.map((store) => {
                const s = store as unknown as Record<string, unknown>
                const name = (s.name as string) || ''
                const address = (s.address as string) || ''
                const active = s.active as boolean
                const rating = (s.rating as number) || 0
                const reviewCount = (s.review_count as number) || 0
                return (
                  <tr key={store.id} className="hover:bg-sunbeam-50/50 transition-colors duration-200">
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-body font-medium text-earth-600">{name}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-orchard-300 font-body">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{address || 'No address'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleActive(store)}
                        className="inline-flex items-center gap-1.5"
                        title={active ? 'Deactivate' : 'Activate'}
                      >
                        {active ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-leaf-500" />
                            <span className="badge-success text-xs">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-orchard-300" />
                            <span className="badge-warning text-xs">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-center text-sm font-body text-earth-500">
                      {getItemCount(store.id)}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1 text-sm font-body">
                        <Star className="w-3.5 h-3.5 text-sunbeam-500 fill-sunbeam-500" />
                        <span className="text-earth-600 font-medium">{rating.toFixed(1)}</span>
                        <span className="text-orchard-300 text-xs">({reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setEditingStore(store)}
                        className="btn-ghost btn-sm inline-flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-orchard-300 font-body">
                    No stores registered yet. Click &quot;Add Store&quot; to get started.
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

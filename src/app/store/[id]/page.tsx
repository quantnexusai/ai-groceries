'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import StoreHeader from '@/components/store/StoreHeader'
import ProductGrid from '@/components/product/ProductGrid'
import ProductSortFilter from '@/components/product/ProductSortFilter'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { demoStores, demoItems, demoDepartments } from '@/lib/demo-data'
import type { Store, GroceryItem, DepartmentType } from '@/lib/types'

export default function StorePage() {
  const params = useParams()
  const storeId = params.id as string
  const { isDemo } = useAuth()

  const [store, setStore] = useState<Store | null>(null)
  const [items, setItems] = useState<GroceryItem[]>([])
  const [departments, setDepartments] = useState<DepartmentType[]>([])
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      if (isDemo) {
        const foundStore = demoStores.find((s) => s.id === storeId) || null
        setStore(foundStore)
        const storeItems = demoItems.filter((i) => i.store_id === storeId)
        setItems(storeItems)
        setDepartments(demoDepartments)
        setLoading(false)
        return
      }

      try {
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeId)
          .single()
        setStore(storeData)

        const { data: itemsData } = await supabase
          .from('grocery_items')
          .select('*')
          .eq('store_id', storeId)
          .eq('visible', true)
        setItems(itemsData || [])

        const { data: deptData } = await supabase
          .from('department_types')
          .select('*')
          .order('sort_order')
        setDepartments(deptData || [])
      } catch (error) {
        console.error('Error fetching store data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isDemo, storeId])

  // Filter items by department
  let filteredItems = selectedDept
    ? items.filter((i) => i.department_type_id === selectedDept)
    : items

  // Sort items
  filteredItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'on-sale':
        return (b.sale ? 1 : 0) - (a.sale ? 1 : 0)
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-earth-400 animate-spin" />
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="font-display text-2xl text-earth-500 mb-2">Store not found</h1>
          <p className="text-orchard-400">
            The store you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Store Header */}
        <div className="mb-8">
          <StoreHeader store={store} />
        </div>

        {/* Filters & Sort */}
        <div className="mb-8">
          <ProductSortFilter
            departments={departments}
            selectedDept={selectedDept}
            sortBy={sortBy}
            onDeptChange={setSelectedDept}
            onSortChange={setSortBy}
          />
        </div>

        {/* Products */}
        <ProductGrid items={filteredItems} />
      </div>
    </div>
  )
}

'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, MapPin, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import StoreGrid from '@/components/store/StoreGrid'
import DepartmentFilter from '@/components/store/DepartmentFilter'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { demoStores, demoDepartments } from '@/lib/demo-data'
import type { Store, DepartmentType } from '@/lib/types'

function StoresLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-10 w-64 bg-sunbeam-50 rounded-xl animate-pulse mb-6" />
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-sunbeam-50 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="h-32 bg-sunbeam-50 rounded-xl animate-pulse mb-4" />
              <div className="h-5 w-40 bg-sunbeam-50 rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-sunbeam-50 rounded animate-pulse mb-3" />
              <div className="h-4 w-24 bg-sunbeam-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StoresContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isDemo } = useAuth()
  const zip = searchParams.get('zip')

  const [stores, setStores] = useState<Store[]>([])
  const [departments, setDepartments] = useState<DepartmentType[]>([])
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [zipInput, setZipInput] = useState('')

  useEffect(() => {
    async function fetchStores() {
      setLoading(true)

      if (isDemo) {
        let filtered = demoStores
        if (zip) {
          filtered = demoStores.filter((s) =>
            s.serviced_zips.includes(zip)
          )
        }
        setStores(filtered)
        setDepartments(demoDepartments)
        setLoading(false)
        return
      }

      try {
        let query = supabase.from('stores').select('*').eq('active', true)
        if (zip) {
          query = query.contains('serviced_zips', [zip])
        }
        const { data: storeData } = await query.order('name')
        setStores(storeData || [])

        const { data: deptData } = await supabase
          .from('department_types')
          .select('*')
          .order('sort_order')
        setDepartments(deptData || [])
      } catch (error) {
        console.error('Error fetching stores:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [isDemo, zip])

  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (zipInput.trim()) {
      router.push(`/stores?zip=${zipInput.trim()}`)
    }
  }

  // Filter stores by selected department
  const filteredStores = selectedDept
    ? stores.filter((s) => s.departments?.includes(selectedDept))
    : stores

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-earth-600 mb-2">
            {zip ? (
              <>
                Stores near <span className="text-leaf-600">{zip}</span>
              </>
            ) : (
              'All Stores'
            )}
          </h1>
          <p className="text-orchard-400 font-body">
            {zip
              ? 'Fresh groceries delivered from stores in your neighborhood.'
              : 'Enter your ZIP code to find stores that deliver to you.'}
          </p>
        </div>

        {/* ZIP Search (prominent when no zip) */}
        {!zip && (
          <div className="card mb-8 max-w-lg">
            <form onSubmit={handleZipSearch} className="flex gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orchard-300" />
                <input
                  type="text"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  placeholder="Enter your ZIP code"
                  className="input pl-12"
                  maxLength={10}
                />
              </div>
              <button type="submit" className="btn-primary">
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>
        )}

        {/* Department Filter */}
        {departments.length > 0 && (
          <div className="mb-8">
            <DepartmentFilter
              departments={departments}
              selected={selectedDept}
              onSelect={setSelectedDept}
            />
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-earth-400 animate-spin" />
          </div>
        ) : (
          <StoreGrid stores={filteredStores} />
        )}
      </div>
    </div>
  )
}

export default function StoresPage() {
  return (
    <Suspense fallback={<StoresLoadingSkeleton />}>
      <StoresContent />
    </Suspense>
  )
}

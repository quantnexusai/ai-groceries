import { MapPin } from 'lucide-react'
import StoreCard from './StoreCard'
import type { Store } from '@/lib/types'

interface StoreGridProps {
  stores: Store[]
}

export default function StoreGrid({ stores }: StoreGridProps) {
  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sunbeam-50 flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-orchard-300" />
        </div>
        <h3 className="font-display text-lg text-earth-500 mb-2">
          No stores found in your area
        </h3>
        <p className="text-sm text-orchard-400 max-w-md">
          Try searching with a different ZIP code or browse all available stores.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  )
}

import { Store as StoreIcon, Star, MapPin, Truck } from 'lucide-react'
import type { Store } from '@/lib/types'

interface StoreHeaderProps {
  store: Store
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  return (
    <div className="bg-white border border-orchard-50/50 rounded-2xl p-6 lg:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Logo Placeholder */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-earth-50 rounded-2xl flex items-center justify-center flex-shrink-0">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={store.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <StoreIcon className="w-12 h-12 text-earth-300" />
          )}
        </div>

        {/* Store Details */}
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-earth-600 mb-2">
            {store.name}
          </h1>

          {/* Address */}
          {store.address && (
            <div className="flex items-center gap-2 text-orchard-400 text-sm mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{store.address}</span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(store.rating)
                      ? 'text-sunbeam-500 fill-sunbeam-500'
                      : 'text-orchard-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-earth-500 font-body font-medium">
              {store.rating.toFixed(1)}
            </span>
            <span className="text-sm text-orchard-400">
              ({store.review_count} review{store.review_count !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Department badges */}
          {store.departments && store.departments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {store.departments.map((dept) => (
                <span key={dept} className="badge-fresh">
                  {dept}
                </span>
              ))}
            </div>
          )}

          {/* Delivery info */}
          {store.serviced_zips && store.serviced_zips.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-orchard-400">
              <Truck className="w-4 h-4 flex-shrink-0 text-leaf-500" />
              <span>
                Delivers to: {store.serviced_zips.slice(0, 5).join(', ')}
                {store.serviced_zips.length > 5 && ` +${store.serviced_zips.length - 5} more`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

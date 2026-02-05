'use client'

import Link from 'next/link'
import { Store as StoreIcon, Star } from 'lucide-react'
import { truncate } from '@/lib/utils'
import type { Store } from '@/lib/types'

interface StoreCardProps {
  store: Store
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <Link href={`/store/${store.id}`} className="block">
      <div className="card-hover group cursor-pointer">
        {/* Logo Placeholder */}
        <div className="bg-earth-50 rounded-xl h-32 flex items-center justify-center mb-4 overflow-hidden">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={store.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <StoreIcon className="w-10 h-10 text-earth-300 group-hover:text-earth-400 transition-colors duration-500" />
          )}
        </div>

        {/* Store Info */}
        <h3 className="font-display font-semibold text-lg text-earth-600 mb-1">
          {store.name}
        </h3>

        {store.description && (
          <p className="text-sm text-orchard-400 mb-3 leading-relaxed">
            {truncate(store.description, 100)}
          </p>
        )}

        {/* Rating & Reviews */}
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
          <span className="text-xs text-orchard-400 font-body">
            ({store.review_count} review{store.review_count !== 1 ? 's' : ''})
          </span>
        </div>

        {/* Shop Now CTA */}
        <span className="text-sm font-body font-semibold text-earth-500 group-hover:text-leaf-600 transition-colors duration-500">
          Shop Now &rarr;
        </span>
      </div>
    </Link>
  )
}

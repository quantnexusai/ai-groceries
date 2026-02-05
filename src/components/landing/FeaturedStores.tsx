'use client'

import Link from 'next/link'
import { Store, Star } from 'lucide-react'
import { demoStores } from '@/lib/demo-data'
import ScrollReveal from '@/components/ScrollReveal'

export default function FeaturedStores() {
  const stores = demoStores.slice(0, 3)

  return (
    <section className="section max-w-6xl mx-auto">
      <ScrollReveal>
        <h2 className="font-display text-display-md text-earth text-center mb-14">
          Featured Stores
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stores.map((store, i) => (
          <ScrollReveal key={store.id}>
            <div className="card-hover flex flex-col items-center text-center h-full">
              {/* Store logo placeholder */}
              <div className="w-16 h-16 rounded-full bg-earth-100 flex items-center justify-center mb-4">
                <Store className="h-7 w-7 text-earth-500" />
              </div>

              {/* Store name */}
              <h3 className="font-display text-xl text-earth-600 mb-2">
                {store.name}
              </h3>

              {/* Description */}
              <p className="font-body text-orchard-400 text-sm leading-relaxed mb-4 flex-1">
                {store.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s < Math.round(store.rating)
                        ? 'text-sunbeam-600 fill-sunbeam-600'
                        : 'text-orchard-200'
                    }`}
                  />
                ))}
                <span className="text-xs text-orchard-400 font-body ml-1">
                  ({store.review_count})
                </span>
              </div>

              {/* CTA */}
              <Link
                href={`/store/${store.id}`}
                className="btn-primary btn-sm"
              >
                Shop Now
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

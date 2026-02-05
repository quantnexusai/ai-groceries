'use client'

import { Apple, Cherry, Carrot, Citrus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { demoItems } from '@/lib/demo-data'
import ScrollReveal from '@/components/ScrollReveal'

const seasonalIcons = [Apple, Cherry, Carrot, Citrus]

export default function WhatsInSeason() {
  const items = demoItems.slice(0, 4)

  return (
    <section className="section max-w-6xl mx-auto">
      <ScrollReveal>
        <div className="text-center mb-14">
          <h2 className="font-display text-display-md text-earth mb-3">
            What&apos;s In Season
          </h2>
          <p className="font-body text-orchard-500 text-lg">
            Curated by nature, delivered by us
          </p>
        </div>
      </ScrollReveal>

      {/* Magazine-style grid: large left + 3 smaller right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured large card */}
        {items[0] && (
          <ScrollReveal>
            <div className="card-hover h-full flex flex-col">
              <div className="bg-sunbeam-100 rounded-xl h-64 flex items-center justify-center mb-4">
                {(() => {
                  const Icon = seasonalIcons[0]
                  return <Icon className="h-16 w-16 text-leaf-400" />
                })()}
              </div>
              <h3 className="font-display text-display-sm text-earth-600 mb-2">
                {items[0].name}
              </h3>
              <p className="font-body text-orchard-400 text-sm leading-relaxed mb-4 flex-1">
                {items[0].description}
              </p>
              <p className="font-body font-semibold text-earth-500 text-lg">
                {formatCurrency(items[0].price)}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Three smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
          {items.slice(1, 4).map((item, i) => {
            const Icon = seasonalIcons[i + 1]
            return (
              <ScrollReveal key={item.id}>
                <div className="card-hover flex items-center gap-5">
                  <div className="bg-sunbeam-100 rounded-xl h-24 w-24 flex-shrink-0 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-leaf-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-earth-600 mb-1">
                      {item.name}
                    </h3>
                    <p className="font-body text-orchard-400 text-sm leading-relaxed line-clamp-2 mb-1">
                      {item.description}
                    </p>
                    <p className="font-body font-semibold text-earth-500">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

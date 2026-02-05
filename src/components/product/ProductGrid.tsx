import { Package } from 'lucide-react'
import ProductCard from './ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import type { GroceryItem } from '@/lib/types'

interface ProductGridProps {
  items: GroceryItem[]
}

export default function ProductGrid({ items }: ProductGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sunbeam-50 flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-orchard-300" />
        </div>
        <h3 className="font-display text-lg text-earth-500 mb-2">
          No products found
        </h3>
        <p className="text-sm text-orchard-400 max-w-md">
          Try adjusting your filters or check back later for new items.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {items.map((item, index) => (
        <ScrollReveal key={item.id} className={`stagger-${Math.min(index + 1, 5)}`}>
          <ProductCard item={item} />
        </ScrollReveal>
      ))}
    </div>
  )
}

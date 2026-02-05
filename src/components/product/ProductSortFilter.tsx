'use client'

import { ArrowDownUp } from 'lucide-react'
import DepartmentFilter from '@/components/store/DepartmentFilter'
import type { DepartmentType } from '@/lib/types'

interface ProductSortFilterProps {
  departments: DepartmentType[]
  selectedDept: string | null
  sortBy: string
  onDeptChange: (id: string | null) => void
  onSortChange: (sort: string) => void
}

export default function ProductSortFilter({
  departments,
  selectedDept,
  sortBy,
  onDeptChange,
  onSortChange,
}: ProductSortFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Department Filter */}
      <div className="flex-1 min-w-0">
        <DepartmentFilter
          departments={departments}
          selected={selectedDept}
          onSelect={onDeptChange}
        />
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ArrowDownUp className="w-4 h-4 text-orchard-400" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white border border-orchard-200 rounded-xl px-3 py-2 text-sm font-body text-earth-500
                     focus:ring-2 focus:ring-leaf-400 focus:border-leaf-400 outline-none
                     transition-all duration-300 cursor-pointer appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239D8B7A' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25em 1.25em',
          }}
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="on-sale">On Sale</option>
        </select>
      </div>
    </div>
  )
}

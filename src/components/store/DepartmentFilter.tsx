'use client'

import {
  LayoutGrid,
  Apple,
  Beef,
  Milk,
  Wheat,
  Snowflake,
  Wine,
  Cookie,
  Pill,
  Flower2,
  Baby,
  Dog,
  SprayCan,
  type LucideIcon,
} from 'lucide-react'
import type { DepartmentType } from '@/lib/types'

interface DepartmentFilterProps {
  departments: DepartmentType[]
  selected: string | null
  onSelect: (id: string | null) => void
}

const iconMap: Record<string, LucideIcon> = {
  apple: Apple,
  beef: Beef,
  milk: Milk,
  wheat: Wheat,
  snowflake: Snowflake,
  wine: Wine,
  cookie: Cookie,
  pill: Pill,
  flower2: Flower2,
  baby: Baby,
  dog: Dog,
  spraycan: SprayCan,
}

function getDepartmentIcon(iconName: string): LucideIcon {
  return iconMap[iconName.toLowerCase()] || LayoutGrid
}

export default function DepartmentFilter({ departments, selected, onSelect }: DepartmentFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {/* All chip */}
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap transition-all duration-500 ease-harvest ${
          selected === null
            ? 'bg-earth-500 text-white shadow-sm'
            : 'bg-sunbeam-50 text-earth-400 border border-orchard-100 hover:bg-sunbeam-100'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        All
      </button>

      {/* Department chips */}
      {departments.map((dept) => {
        const Icon = getDepartmentIcon(dept.icon)
        const isActive = selected === dept.id
        return (
          <button
            key={dept.id}
            onClick={() => onSelect(isActive ? null : dept.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap transition-all duration-500 ease-harvest ${
              isActive
                ? 'bg-earth-500 text-white shadow-sm'
                : 'bg-sunbeam-50 text-earth-400 border border-orchard-100 hover:bg-sunbeam-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {dept.name}
          </button>
        )
      })}
    </div>
  )
}

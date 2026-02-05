'use client'

import { LayoutDashboard, Store, ClipboardList, Users } from 'lucide-react'

const tabs = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'stores', label: 'Stores', icon: Store },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'customers', label: 'Customers', icon: Users },
]

interface DashboardNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function DashboardNav({ activeTab, onTabChange }: DashboardNavProps) {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-sunbeam-200/60 mb-8">
      {tabs.map((t) => {
        const Icon = t.icon
        const active = activeTab === t.id
        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-body font-medium whitespace-nowrap transition-all duration-300 border-b-2 -mb-[1px] ${
              active
                ? 'tab-active border-leaf-500 text-earth-600'
                : 'tab border-transparent text-orchard-300 hover:text-earth-500 hover:border-orchard-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}

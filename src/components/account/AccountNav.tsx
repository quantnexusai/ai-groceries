'use client'

import { User, ShoppingBag } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
]

interface AccountNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function AccountNav({ activeTab, onTabChange }: AccountNavProps) {
  return (
    <>
      {/* Desktop: vertical nav */}
      <nav className="hidden md:flex flex-col gap-1">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-all duration-300 text-left ${
                active
                  ? 'tab-active bg-leaf-100 text-earth-600'
                  : 'tab text-earth-400 hover:bg-sunbeam-50 hover:text-earth-600'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {t.label}
            </button>
          )
        })}
      </nav>

      {/* Mobile: horizontal tabs */}
      <nav className="flex md:hidden gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body font-medium whitespace-nowrap transition-all duration-300 ${
                active
                  ? 'tab-active bg-leaf-100 text-earth-600'
                  : 'tab text-earth-400 hover:bg-sunbeam-50 hover:text-earth-600'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {t.label}
            </button>
          )
        })}
      </nav>
    </>
  )
}

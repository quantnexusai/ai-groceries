'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function DemoBanner() {
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  return (
    <div className="relative bg-sunbeam-200 border-b border-leaf-400 px-4 py-2 text-center">
      <p className="text-sm font-body text-earth-600">
        You&apos;re viewing AI Groceries in demo mode. Connect Supabase to enable all features.
      </p>
      <button
        onClick={() => setHidden(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-earth-400 hover:text-earth-600 hover:bg-sunbeam-300 transition-colors duration-300"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

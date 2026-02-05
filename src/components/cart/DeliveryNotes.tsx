'use client'

import { useState } from 'react'
import { Package } from 'lucide-react'

interface DeliveryNotesProps {
  notes: string
  onChange: (notes: string) => void
}

export default function DeliveryNotes({ notes, onChange }: DeliveryNotesProps) {
  const [minimumPackaging, setMinimumPackaging] = useState(false)

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="delivery-notes" className="label">
          Delivery Instructions
        </label>
        <textarea
          id="delivery-notes"
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Special instructions for the delivery driver or product assembler..."
          className="textarea"
          rows={3}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={minimumPackaging}
          onChange={(e) => setMinimumPackaging(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-orchard-200 text-leaf-500 focus:ring-leaf-400 transition-colors duration-300"
        />
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-leaf-500" />
            <span className="text-sm font-body font-medium text-earth-500 group-hover:text-earth-600 transition-colors duration-300">
              Request minimum packaging
            </span>
          </div>
          <p className="text-xs text-orchard-400 font-body mt-1 leading-relaxed">
            We will use as little packaging as possible, opting for paper bags and
            reusable containers where available.
          </p>
        </div>
      </label>
    </div>
  )
}

'use client'

import { MapPin, X } from 'lucide-react'

interface ProvenanceDrawerProps {
  isOpen: boolean
  onClose: () => void
  story: string
  farm: string
  location: string
}

export default function ProvenanceDrawer({
  isOpen,
  onClose,
  story,
  farm,
  location,
}: ProvenanceDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-slide-up max-h-[70vh] flex flex-col">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-orchard-200" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-orchard-400 hover:text-earth-600 transition-colors"
          aria-label="Close drawer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="px-6 pb-8 overflow-y-auto flex-1">
          <h3 className="font-display text-display-sm text-earth-600 mb-4">
            The Story
          </h3>

          <p className="font-body text-orchard-500 leading-relaxed mb-6">
            {story}
          </p>

          <div className="border-t border-orchard-100 pt-5">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-leaf-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body font-semibold text-earth-600">{farm}</p>
                <p className="font-body text-sm text-orchard-400">{location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

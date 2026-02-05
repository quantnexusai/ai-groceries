'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf } from 'lucide-react'
import BokehGradient from '@/components/BokehGradient'
import ScrollReveal from '@/components/ScrollReveal'

export default function HeroSection() {
  const [zip, setZip] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (zip.trim()) {
      router.push(`/stores?zip=${encodeURIComponent(zip.trim())}`)
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Bokeh background */}
      <BokehGradient />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-leaf-50 rounded-full">
            <Leaf className="h-4 w-4 text-leaf-500" />
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-leaf-700">
              What&apos;s In Season
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <h1 className="font-display text-display-xl text-earth leading-none mb-6">
            The freshest ingredients,
            <br />
            delivered with intelligence
          </h1>
        </ScrollReveal>

        <ScrollReveal>
          <p className="font-body text-lg text-orchard-500 max-w-xl mx-auto mb-10 leading-relaxed">
            AI-powered grocery delivery that knows what you need before you do
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="Enter your ZIP code"
              className="input text-center sm:text-left flex-1"
              maxLength={10}
            />
            <button type="submit" className="btn-primary btn-lg whitespace-nowrap">
              Find Stores
            </button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  )
}

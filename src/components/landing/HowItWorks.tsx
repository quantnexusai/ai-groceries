'use client'

import { MapPin, ShoppingBag, Truck } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

const steps = [
  {
    number: 1,
    icon: MapPin,
    title: 'Find Your Store',
    description: 'Enter your ZIP code to discover stores near you',
  },
  {
    number: 2,
    icon: ShoppingBag,
    title: 'Fill Your Basket',
    description: 'Browse fresh produce, dairy, bakery and more',
  },
  {
    number: 3,
    icon: Truck,
    title: 'Choose Delivery',
    description: 'Pick a 2-hour window that works for your schedule',
  },
]

export default function HowItWorks() {
  return (
    <section className="section bg-sunbeam-50">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-display-md text-earth text-center mb-16">
            How It Works
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <ScrollReveal key={step.number}>
                <div className="text-center">
                  {/* Number badge */}
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-leaf-500 text-white font-body font-bold text-sm mb-5">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <Icon className="h-10 w-10 text-earth-400" />
                  </div>

                  {/* Text */}
                  <h3 className="font-display text-xl text-earth-600 mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-orchard-500 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

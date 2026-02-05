'use client'

import { useAuth } from '@/lib/auth-context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import HeroSection from '@/components/landing/HeroSection'
import WhatsInSeason from '@/components/landing/WhatsInSeason'
import HowItWorks from '@/components/landing/HowItWorks'
import FeaturedStores from '@/components/landing/FeaturedStores'
import CTASection from '@/components/landing/CTASection'

export default function HomePage() {
  const { isDemo } = useAuth()

  return (
    <>
      {isDemo && <DemoBanner />}
      <Header />
      <main>
        <HeroSection />
        <WhatsInSeason />
        <HowItWorks />
        <FeaturedStores />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

'use client'

import { useState } from 'react'
import DashboardNav from '@/components/dashboard/DashboardNav'
import OverviewTab from '@/components/dashboard/OverviewTab'
import StoresTab from '@/components/dashboard/StoresTab'
import OrdersTab from '@/components/dashboard/OrdersTab'
import CustomersTab from '@/components/dashboard/CustomersTab'
import ScrollReveal from '@/components/ScrollReveal'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="section">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-orchard-400 mb-3">Administration</p>
          <h1 className="font-display text-display-md md:text-display-lg text-earth-600 mb-8">
            Dashboard
          </h1>
        </ScrollReveal>

        <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'stores' && <StoresTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'customers' && <CustomersTab />}
        </div>
      </div>
    </div>
  )
}

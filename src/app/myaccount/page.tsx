'use client'

import { useState } from 'react'
import AccountNav from '@/components/account/AccountNav'
import ProfileTab from '@/components/account/ProfileTab'
import OrdersTab from '@/components/account/OrdersTab'

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div>
      <h1 className="display-md font-display text-earth-600 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar / Tab Bar */}
        <aside>
          <AccountNav activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        {/* Content */}
        <div className="min-w-0">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'orders' && <OrdersTab />}
        </div>
      </div>
    </div>
  )
}

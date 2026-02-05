'use client'

import { useEffect, useState } from 'react'
import { MapPin, Phone } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface AddressFormProps {
  address: string
  onChange: (addr: string) => void
  phone: string
  onPhoneChange: (ph: string) => void
}

export default function AddressForm({
  address,
  onChange,
  phone,
  onPhoneChange,
}: AddressFormProps) {
  const { profile } = useAuth()
  const [initialized, setInitialized] = useState(false)

  // Pre-fill from profile on first load
  useEffect(() => {
    if (profile && !initialized) {
      if (!address && profile.address) {
        onChange(profile.address)
      }
      if (!phone && profile.phone) {
        onPhoneChange(profile.phone)
      }
      setInitialized(true)
    }
  }, [profile, initialized, address, phone, onChange, onPhoneChange])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="delivery-address" className="label">
          Delivery Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orchard-300" />
          <input
            id="delivery-address"
            type="text"
            value={address}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your delivery address"
            className="input pl-11"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone-number" className="label">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orchard-300" />
          <input
            id="phone-number"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(555) 123-4567"
            className="input pl-11"
            required
          />
        </div>
      </div>
    </div>
  )
}

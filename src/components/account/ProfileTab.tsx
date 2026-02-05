'use client'

import { useState } from 'react'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function ProfileTab() {
  const { profile, updateProfile } = useAuth()

  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    zip: profile?.zip || '',
    address: profile?.address || '',
    gender: profile?.gender || '',
    date_of_birth: profile?.date_of_birth || '',
    order_comment: profile?.order_comment || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await updateProfile(form)
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to save changes.' })
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 4000)
    }
  }

  return (
    <div className="card p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-earth-600 mb-6">
        Personal Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="label">First Name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              className="input"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="label">Last Name</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              className="input"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Phone & ZIP row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="label">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="input"
              placeholder="(555) 000-0000"
            />
          </div>
          <div>
            <label htmlFor="zip" className="label">ZIP Code</label>
            <input
              id="zip"
              name="zip"
              type="text"
              value={form.zip}
              onChange={handleChange}
              className="input"
              placeholder="10001"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="label">Delivery Address</label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            className="input"
            placeholder="123 Main St, Apt 4B"
          />
        </div>

        {/* Gender & DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gender" className="label">Gender</label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input"
            >
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="date_of_birth" className="label">Date of Birth</label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Default Delivery Notes */}
        <div>
          <label htmlFor="order_comment" className="label">Default Delivery Notes</label>
          <textarea
            id="order_comment"
            name="order_comment"
            value={form.order_comment}
            onChange={handleChange}
            rows={3}
            className="textarea"
            placeholder="E.g., Leave with doorman, ring twice, etc."
          />
          <p className="text-xs text-orchard-300 mt-1 font-body">
            These notes will be pre-filled on every new order.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-body ${
              message.type === 'success'
                ? 'bg-leaf-100 text-leaf-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {message.text}
          </div>
        )}

        {/* Save */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Save, X, Upload } from 'lucide-react'
import { demoDepartments } from '@/lib/demo-data'
import type { Store } from '@/lib/types'

interface StoreFormProps {
  store?: Store
  onSave: (store: Partial<Store>) => void
  onCancel: () => void
}

export default function StoreForm({ store, onSave, onCancel }: StoreFormProps) {
  const storeRecord = store as unknown as Record<string, unknown> | undefined

  const [form, setForm] = useState({
    name: (storeRecord?.name as string) || '',
    address: (storeRecord?.address as string) || '',
    description: (storeRecord?.description as string) || '',
    serviced_zips_input: ((storeRecord?.serviced_zips as string[]) || []).join(', '),
    selected_departments: (storeRecord?.department_type_ids as string[]) || (storeRecord?.departments as string[]) || [],
    active: storeRecord?.active !== false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = () => {
    setForm((prev) => ({ ...prev, active: !prev.active }))
  }

  const handleDepartmentToggle = (deptId: string) => {
    setForm((prev) => ({
      ...prev,
      selected_departments: prev.selected_departments.includes(deptId)
        ? prev.selected_departments.filter((d) => d !== deptId)
        : [...prev.selected_departments, deptId],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const zips = form.serviced_zips_input
      .split(',')
      .map((z) => z.trim())
      .filter(Boolean)

    onSave({
      name: form.name,
      address: form.address,
      description: form.description,
      serviced_zips: zips,
      departments: form.selected_departments,
      active: form.active,
    } as Partial<Store>)
  }

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-earth-600">
          {store ? 'Edit Store' : 'Add New Store'}
        </h2>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg text-orchard-300 hover:text-earth-600 hover:bg-sunbeam-50 transition-colors duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="store-name" className="label">Store Name</label>
          <input
            id="store-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Greenleaf Market"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="store-address" className="label">Address</label>
          <input
            id="store-address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            className="input"
            placeholder="123 Main Street, New York, NY"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="store-description" className="label">Description</label>
          <textarea
            id="store-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="textarea"
            placeholder="Describe what makes this store unique..."
          />
        </div>

        {/* Serviced ZIPs */}
        <div>
          <label htmlFor="store-zips" className="label">Serviced ZIP Codes</label>
          <input
            id="store-zips"
            name="serviced_zips_input"
            type="text"
            value={form.serviced_zips_input}
            onChange={handleChange}
            className="input"
            placeholder="10001, 10002, 10003"
          />
          <p className="text-xs text-orchard-300 font-body mt-1">
            Comma-separated list of ZIP codes this store delivers to.
          </p>
        </div>

        {/* Departments */}
        <div>
          <label className="label">Departments</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {demoDepartments.map((dept) => (
              <label
                key={dept.id}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-300 text-sm font-body ${
                  form.selected_departments.includes(dept.id)
                    ? 'border-leaf-400 bg-leaf-50 text-earth-600'
                    : 'border-orchard-100 bg-white text-orchard-300 hover:border-orchard-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.selected_departments.includes(dept.id)}
                  onChange={() => handleDepartmentToggle(dept.id)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    form.selected_departments.includes(dept.id)
                      ? 'border-leaf-500 bg-leaf-500'
                      : 'border-orchard-200'
                  }`}
                >
                  {form.selected_departments.includes(dept.id) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {dept.name}
              </label>
            ))}
          </div>
        </div>

        {/* Logo Upload Placeholder */}
        <div>
          <label className="label">Store Logo</label>
          <div className="surface p-6 rounded-xl border-2 border-dashed border-orchard-100 text-center cursor-pointer hover:border-leaf-400 transition-colors duration-300">
            <Upload className="w-8 h-8 text-orchard-200 mx-auto mb-2" />
            <p className="text-sm text-orchard-300 font-body">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-orchard-200 font-body mt-1">
              PNG, JPG up to 2MB
            </p>
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-body font-medium text-earth-600">Active Status</p>
            <p className="text-xs text-orchard-300 font-body">
              Inactive stores are hidden from customers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
              form.active ? 'bg-leaf-500' : 'bg-orchard-200'
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                form.active ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {store ? 'Update Store' : 'Create Store'}
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Save, X, Upload, Sparkles, DollarSign } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getSampleAIResponse } from '@/lib/demo-data'
import type { GroceryItem, DepartmentType } from '@/lib/types'

interface ItemFormProps {
  item?: GroceryItem
  storeId: string
  departments: DepartmentType[]
  onSave: (item: Partial<GroceryItem>) => void
  onCancel: () => void
}

export default function ItemForm({ item, storeId, departments, onSave, onCancel }: ItemFormProps) {
  const { isDemo } = useAuth()

  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    details: item?.details || '',
    warnings: item?.warnings || '',
    ingredients: item?.ingredients || '',
    price: item?.price ? String(item.price) : '',
    on_sale: item?.sale || false,
    sale_price: item?.sale_price ? String(item.sale_price) : '',
    department_type_id: item?.department_type_id || '',
    measure_type: item?.measure_type || 'unit',
    weight_grams: item?.weight ? String(item.weight) : '',
    stock: item?.stock ? String(item.stock) : '',
    visible: item?.visible !== false,
    provenance_story: item?.provenance_story || '',
    provenance_farm: item?.provenance_farm || '',
    provenance_location: item?.provenance_location || '',
  })

  const [aiDescription, setAiDescription] = useState('')
  const [aiSalePrice, setAiSalePrice] = useState('')
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [generatingPrice, setGeneratingPrice] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleToggle = (field: 'on_sale' | 'visible') => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleGenerateDescription = async () => {
    setGeneratingDesc(true)

    if (isDemo) {
      await new Promise((r) => setTimeout(r, 1200))
      const response = getSampleAIResponse(`product description for ${form.name}`)
      setAiDescription(response)
      setGeneratingDesc(false)
      return
    }

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Write a compelling product description for a grocery item called "${form.name}". Current description: "${form.description}". It costs $${form.price}. Keep it under 100 words, appealing and sensory.`,
          feature: 'item_description',
        }),
      })
      const data = await res.json()
      setAiDescription(data.response || 'Could not generate description.')
    } catch {
      setAiDescription('Failed to connect to AI service.')
    } finally {
      setGeneratingDesc(false)
    }
  }

  const handleSuggestSalePrice = async () => {
    setGeneratingPrice(true)

    if (isDemo) {
      await new Promise((r) => setTimeout(r, 800))
      const original = parseFloat(form.price) || 10
      const suggested = (original * 0.82).toFixed(2)
      setAiSalePrice(`Suggested sale price: $${suggested} (18% discount). This discount level typically drives a 25-30% increase in unit sales based on similar items in this category.`)
      setGeneratingPrice(false)
      return
    }

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Suggest a sale price for "${form.name}" currently priced at $${form.price}. Consider market trends and provide a brief rationale.`,
          feature: 'pricing_suggestion',
        }),
      })
      const data = await res.json()
      setAiSalePrice(data.response || 'Could not generate suggestion.')
    } catch {
      setAiSalePrice('Failed to connect to AI service.')
    } finally {
      setGeneratingPrice(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      store_id: storeId,
      name: form.name,
      description: form.description,
      details: form.details,
      warnings: form.warnings,
      ingredients: form.ingredients,
      price: parseFloat(form.price) || 0,
      sale: form.on_sale,
      sale_price: form.on_sale ? parseFloat(form.sale_price) || 0 : 0,
      department_type_id: form.department_type_id || null,
      measure_type: form.measure_type,
      weight: form.weight_grams ? parseInt(form.weight_grams) : 0,
      stock: parseInt(form.stock) || 0,
      provenance_story: form.provenance_story,
      provenance_farm: form.provenance_farm,
      provenance_location: form.provenance_location,
    } as Partial<GroceryItem>)
  }

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-earth-600">
          {item ? 'Edit Item' : 'Add New Item'}
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
          <label htmlFor="item-name" className="label">Item Name</label>
          <input
            id="item-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="e.g., Organic Avocados"
            required
          />
        </div>

        {/* Description + AI Generate */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="item-description" className="label mb-0">Description</label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generatingDesc || !form.name}
              className="btn-ghost btn-sm flex items-center gap-1.5 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {generatingDesc ? 'Generating...' : 'Generate AI Description'}
            </button>
          </div>
          <textarea
            id="item-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="textarea"
            placeholder="A compelling description of this item..."
          />
          {aiDescription && (
            <div className="mt-2 p-3 bg-sunbeam-50 rounded-xl border border-sunbeam-200/60">
              <p className="text-xs text-orchard-300 font-body mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Suggestion
              </p>
              <p className="text-sm text-earth-500 font-body">{aiDescription}</p>
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, description: aiDescription }))
                  setAiDescription('')
                }}
                className="text-xs text-leaf-600 font-body font-medium mt-2 hover:underline"
              >
                Use this description
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <label htmlFor="item-details" className="label">Details</label>
          <textarea
            id="item-details"
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={2}
            className="textarea"
            placeholder="Additional product details..."
          />
        </div>

        {/* Warnings & Ingredients Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="item-warnings" className="label">Warnings</label>
            <input
              id="item-warnings"
              name="warnings"
              type="text"
              value={form.warnings}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Contains nuts"
            />
          </div>
          <div>
            <label htmlFor="item-ingredients" className="label">Ingredients</label>
            <input
              id="item-ingredients"
              name="ingredients"
              type="text"
              value={form.ingredients}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Oats, honey, almonds"
            />
          </div>
        </div>

        {/* Price + Sale */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="item-price" className="label">Price ($)</label>
            <input
              id="item-price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="input"
              placeholder="9.99"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label mb-0">On Sale</label>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('on_sale')}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 mt-1.5 ${
                form.on_sale ? 'bg-leaf-500' : 'bg-orchard-200'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  form.on_sale ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
          {form.on_sale && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="item-sale-price" className="label mb-0">Sale Price ($)</label>
                <button
                  type="button"
                  onClick={handleSuggestSalePrice}
                  disabled={generatingPrice || !form.price}
                  className="btn-ghost btn-sm flex items-center gap-1 text-xs"
                >
                  <DollarSign className="w-3 h-3" />
                  {generatingPrice ? 'Thinking...' : 'AI Suggest'}
                </button>
              </div>
              <input
                id="item-sale-price"
                name="sale_price"
                type="number"
                step="0.01"
                min="0"
                value={form.sale_price}
                onChange={handleChange}
                className="input"
                placeholder="7.99"
              />
            </div>
          )}
        </div>

        {/* AI Sale Price Suggestion */}
        {aiSalePrice && (
          <div className="p-3 bg-sunbeam-50 rounded-xl border border-sunbeam-200/60">
            <p className="text-xs text-orchard-300 font-body mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> AI Pricing Suggestion
            </p>
            <p className="text-sm text-earth-500 font-body">{aiSalePrice}</p>
          </div>
        )}

        {/* Department + Measure */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="item-dept" className="label">Department</label>
            <select
              id="item-dept"
              name="department_type_id"
              value={form.department_type_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="item-measure" className="label">Measure Type</label>
            <select
              id="item-measure"
              name="measure_type"
              value={form.measure_type}
              onChange={handleChange}
              className="input"
            >
              <option value="unit">Per Unit</option>
              <option value="weight">By Weight</option>
            </select>
          </div>
          {form.measure_type === 'weight' && (
            <div>
              <label htmlFor="item-weight" className="label">Weight (g)</label>
              <input
                id="item-weight"
                name="weight_grams"
                type="number"
                min="0"
                value={form.weight_grams}
                onChange={handleChange}
                className="input"
                placeholder="454"
              />
            </div>
          )}
        </div>

        {/* Stock + Visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="item-stock" className="label">Stock</label>
            <input
              id="item-stock"
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className="input"
              placeholder="100"
            />
          </div>
          <div>
            <label className="label">Visible to Customers</label>
            <button
              type="button"
              onClick={() => handleToggle('visible')}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 mt-1.5 ${
                form.visible ? 'bg-leaf-500' : 'bg-orchard-200'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  form.visible ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Provenance Section */}
        <div className="border-t border-sunbeam-200/60 pt-6">
          <h3 className="font-display text-lg font-semibold text-earth-600 mb-4">
            Provenance Story
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="item-farm" className="label">Farm / Producer</label>
                <input
                  id="item-farm"
                  name="provenance_farm"
                  type="text"
                  value={form.provenance_farm}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Del Sol Family Farms"
                />
              </div>
              <div>
                <label htmlFor="item-location" className="label">Location</label>
                <input
                  id="item-location"
                  name="provenance_location"
                  type="text"
                  value={form.provenance_location}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Carpinteria, CA"
                />
              </div>
            </div>
            <div>
              <label htmlFor="item-story" className="label">Story</label>
              <textarea
                id="item-story"
                name="provenance_story"
                value={form.provenance_story}
                onChange={handleChange}
                rows={4}
                className="textarea"
                placeholder="Tell the story behind this product — where it comes from, how it is made, what makes it special..."
              />
            </div>
          </div>
        </div>

        {/* Image Upload Placeholder */}
        <div>
          <label className="label">Product Image</label>
          <div className="surface p-6 rounded-xl border-2 border-dashed border-orchard-100 text-center cursor-pointer hover:border-leaf-400 transition-colors duration-300">
            <Upload className="w-8 h-8 text-orchard-200 mx-auto mb-2" />
            <p className="text-sm text-orchard-300 font-body">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-orchard-200 font-body mt-1">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {item ? 'Update Item' : 'Create Item'}
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

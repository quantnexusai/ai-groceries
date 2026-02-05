'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  Star,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  MapPin,
  Sprout,
  X,
} from 'lucide-react'
import Header from '@/components/Header'
import AddToCartButton from '@/components/product/AddToCartButton'
import QuantitySelector from '@/components/product/QuantitySelector'
import SaleBadge from '@/components/product/SaleBadge'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { demoItems, demoStores, demoReviews } from '@/lib/demo-data'
import { formatCurrency, formatWeight, formatDate } from '@/lib/utils'
import type { GroceryItem, Review } from '@/lib/types'

function ProvenanceDrawer({
  item,
  open,
  onClose,
}: {
  item: GroceryItem
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-earth-600/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto animate-soft-drop">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-earth-600">
              The Story Behind This Item
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-orchard-400 hover:text-earth-600 hover:bg-sunbeam-50 transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {item.provenance_farm && (
              <div>
                <h3 className="label">Farm / Source</h3>
                <p className="text-earth-500 font-body">{item.provenance_farm}</p>
              </div>
            )}

            {item.provenance_location && (
              <div>
                <h3 className="label">Location</h3>
                <div className="flex items-center gap-2 text-earth-500 font-body">
                  <MapPin className="w-4 h-4 text-leaf-500" />
                  {item.provenance_location}
                </div>
              </div>
            )}

            {item.provenance_story && (
              <div>
                <h3 className="label">Story</h3>
                <p className="text-earth-500 font-body leading-relaxed whitespace-pre-wrap">
                  {item.provenance_story}
                </p>
              </div>
            )}

            {!item.provenance_farm && !item.provenance_location && !item.provenance_story && (
              <div className="text-center py-8">
                <Sprout className="w-10 h-10 text-orchard-300 mx-auto mb-3" />
                <p className="text-orchard-400 text-sm">
                  Provenance details are not yet available for this item.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="font-display font-bold text-xl text-earth-600 mb-6">
        Store Reviews
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="avatar avatar-sm">
                {review.reviewer
                  ? `${review.reviewer.first_name?.charAt(0) || ''}${review.reviewer.last_name?.charAt(0) || ''}`
                  : '?'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-body font-medium text-earth-500">
                  {review.reviewer
                    ? `${review.reviewer.first_name} ${review.reviewer.last_name}`
                    : 'Anonymous'}
                </p>
                <p className="text-xs text-orchard-400">{formatDate(review.created_at)}</p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < (review.rate || review.rating || 0)
                        ? 'text-sunbeam-500 fill-sunbeam-500'
                        : 'text-orchard-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            {(review.message || review.comment) && (
              <p className="text-sm text-earth-500 font-body leading-relaxed">
                {review.message || review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ItemDetailPage() {
  const params = useParams()
  const itemId = params.id as string
  const { isDemo } = useAuth()

  const [item, setItem] = useState<GroceryItem | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showDetails, setShowDetails] = useState(false)
  const [showWarnings, setShowWarnings] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)
  const [showProvenance, setShowProvenance] = useState(false)

  useEffect(() => {
    async function fetchItem() {
      setLoading(true)

      if (isDemo) {
        const found = demoItems.find((i) => i.id === itemId) || null
        if (found) {
          const store = demoStores.find((s) => s.id === found.store_id)
          setItem({ ...found, store })
          const storeReviews = demoReviews.filter((r) => r.store_id === found.store_id)
          setReviews(storeReviews)
        } else {
          setItem(null)
        }
        setLoading(false)
        return
      }

      try {
        const { data: itemData } = await supabase
          .from('grocery_items')
          .select('*, store:stores(*)')
          .eq('id', itemId)
          .single()
        setItem(itemData)

        if (itemData?.store_id) {
          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*, reviewer:profiles(*)')
            .eq('store_id', itemData.store_id)
            .order('created_at', { ascending: false })
            .limit(10)
          setReviews(reviewsData || [])
        }
      } catch (error) {
        console.error('Error fetching item:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [isDemo, itemId])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-earth-400 animate-spin" />
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="font-display text-2xl text-earth-500 mb-2">Product not found</h1>
          <p className="text-orchard-400 mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/stores" className="btn-secondary">
            Browse Stores
          </Link>
        </div>
      </div>
    )
  }

  const isOutOfStock = item.stock === 0

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Back link */}
        {item.store && (
          <Link
            href={`/store/${item.store_id}`}
            className="inline-flex items-center gap-2 text-sm text-orchard-400 hover:text-earth-500 transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {item.store.name}
          </Link>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image */}
          <div className="bg-sunbeam-50 rounded-2xl h-72 sm:h-96 flex items-center justify-center relative overflow-hidden">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <Package className="w-16 h-16 text-orchard-300" />
            )}

            {item.sale && item.sale_price && item.sale_price > 0 && (
              <div className="absolute top-4 right-4">
                <SaleBadge originalPrice={item.price} salePrice={item.sale_price} />
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div>
            {/* Store name */}
            {item.store && (
              <Link
                href={`/store/${item.store_id}`}
                className="text-sm text-leaf-600 font-body font-medium hover:text-leaf-700 transition-colors duration-300"
              >
                {item.store.name}
              </Link>
            )}

            {/* Item name */}
            <h1 className="font-display font-bold text-2xl lg:text-3xl text-earth-600 mt-1 mb-4">
              {item.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              {item.sale && item.sale_price && item.sale_price > 0 ? (
                <>
                  <span className="text-2xl font-body font-bold text-leaf-600">
                    {formatCurrency(item.sale_price)}
                  </span>
                  <span className="text-lg text-orchard-300 line-through">
                    {formatCurrency(item.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-body font-bold text-earth-600">
                  {formatCurrency(item.price)}
                </span>
              )}
              <span className="text-sm text-orchard-400">
                {formatWeight(item.weight, item.measure_type)}
              </span>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-earth-500 font-body leading-relaxed mb-6">
                {item.description}
              </p>
            )}

            {/* Collapsible sections */}
            <div className="space-y-0 mb-6 border border-orchard-100 rounded-xl overflow-hidden divide-y divide-orchard-100">
              {item.details && (
                <div>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-body font-medium text-earth-500 hover:bg-sunbeam-50 transition-colors duration-300"
                  >
                    Details
                    {showDetails ? (
                      <ChevronUp className="w-4 h-4 text-orchard-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-orchard-400" />
                    )}
                  </button>
                  {showDetails && (
                    <div className="px-4 pb-3 text-sm text-earth-500 font-body leading-relaxed whitespace-pre-wrap">
                      {item.details}
                    </div>
                  )}
                </div>
              )}

              {item.warnings && (
                <div>
                  <button
                    onClick={() => setShowWarnings(!showWarnings)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-body font-medium text-earth-500 hover:bg-sunbeam-50 transition-colors duration-300"
                  >
                    Warnings
                    {showWarnings ? (
                      <ChevronUp className="w-4 h-4 text-orchard-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-orchard-400" />
                    )}
                  </button>
                  {showWarnings && (
                    <div className="px-4 pb-3 text-sm text-amber-700 font-body leading-relaxed whitespace-pre-wrap">
                      {item.warnings}
                    </div>
                  )}
                </div>
              )}

              {item.ingredients && (
                <div>
                  <button
                    onClick={() => setShowIngredients(!showIngredients)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-body font-medium text-earth-500 hover:bg-sunbeam-50 transition-colors duration-300"
                  >
                    Ingredients
                    {showIngredients ? (
                      <ChevronUp className="w-4 h-4 text-orchard-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-orchard-400" />
                    )}
                  </button>
                  {showIngredients && (
                    <div className="px-4 pb-3 text-sm text-earth-500 font-body leading-relaxed whitespace-pre-wrap">
                      {item.ingredients}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              {isOutOfStock ? (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-body font-medium text-red-600">
                    Out of Stock
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-leaf-500" />
                  <span className="text-sm font-body font-medium text-leaf-700">
                    In Stock ({item.stock} available)
                  </span>
                </>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <QuantitySelector
                  quantity={quantity}
                  max={item.stock}
                  onChange={setQuantity}
                />
                <AddToCartButton
                  item={item}
                  quantity={quantity}
                  className="flex-1"
                />
              </div>
            )}

            {/* Learn the Story button */}
            {(item.provenance_story || item.provenance_farm || item.provenance_location) && (
              <button
                onClick={() => setShowProvenance(true)}
                className="btn-secondary w-full"
              >
                <Sprout className="w-5 h-5" />
                Learn the Story
              </button>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection reviews={reviews} />
      </div>

      {/* Provenance Drawer */}
      <ProvenanceDrawer
        item={item}
        open={showProvenance}
        onClose={() => setShowProvenance(false)}
      />
    </div>
  )
}

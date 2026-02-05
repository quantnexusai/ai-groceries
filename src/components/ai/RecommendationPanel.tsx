'use client'

import { useState, useEffect } from 'react'
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getSampleAIResponse } from '@/lib/demo-data'
import type { CartItem, GroceryItem } from '@/lib/types'

interface RecommendationPanelProps {
  cartItems?: CartItem[]
  currentItem?: GroceryItem
}

export default function RecommendationPanel({ cartItems, currentItem }: RecommendationPanelProps) {
  const { isDemo } = useAuth()
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true)

    if (isDemo) {
      // Simulate a brief delay for demo mode
      await new Promise((resolve) => setTimeout(resolve, 800))
      setResponse(getSampleAIResponse('recommend'))
      setLoading(false)
      setHasLoaded(true)
      return
    }

    try {
      const message = currentItem
        ? `I'm looking at "${currentItem.name}" (${currentItem.description}). What else would go well with it?`
        : cartItems && cartItems.length > 0
          ? `I have these items in my cart: ${cartItems.map((i) => i.name).join(', ')}. What else should I add?`
          : 'What seasonal items would you recommend right now?'

      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'recommendation',
          message,
          data: {
            cartItems: cartItems?.map((i) => ({ name: i.name, price: i.price })),
            currentItem: currentItem
              ? { name: currentItem.name, price: currentItem.price, department: currentItem.department_type_id }
              : undefined,
          },
        }),
      })

      const data = await res.json()
      if (data.error) {
        setResponse(getSampleAIResponse('recommend'))
      } else {
        setResponse(data.response)
      }
    } catch {
      setResponse(getSampleAIResponse('recommend'))
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  useEffect(() => {
    if (!hasLoaded) {
      fetchRecommendations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sunbeam-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sunbeam-600" />
          </div>
          <h3 className="font-display font-semibold text-earth-600 text-lg">
            AI Recommendations
          </h3>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="btn-ghost text-sm flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Suggestions
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-orchard-400 font-body text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Finding the best picks for you...</span>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-sunbeam-100 rounded-full animate-pulse w-full" />
            <div className="h-4 bg-sunbeam-100 rounded-full animate-pulse w-5/6" />
            <div className="h-4 bg-sunbeam-100 rounded-full animate-pulse w-4/6" />
            <div className="h-4 bg-sunbeam-100 rounded-full animate-pulse w-full" />
            <div className="h-4 bg-sunbeam-100 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      ) : response ? (
        <p className="text-sm text-earth-500 font-body leading-relaxed whitespace-pre-line">
          {response}
        </p>
      ) : null}
    </div>
  )
}

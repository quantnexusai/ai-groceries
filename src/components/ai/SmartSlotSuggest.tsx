'use client'

import { useState, useEffect } from 'react'
import { Clock, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getSampleAIResponse } from '@/lib/demo-data'

interface SmartSlotSuggestProps {
  deliveryDate: string
  onSelectSlot?: (slot: string) => void
}

export default function SmartSlotSuggest({ deliveryDate, onSelectSlot }: SmartSlotSuggestProps) {
  const { isDemo } = useAuth()
  const [response, setResponse] = useState('')
  const [recommendedSlot, setRecommendedSlot] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const parseRecommendedSlot = (text: string): string => {
    // Try to extract a time slot pattern like "10:00 AM - 12:00 PM"
    const slotMatch = text.match(/\d{1,2}:\d{2}\s*(?:AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM)/i)
    return slotMatch ? slotMatch[0] : ''
  }

  const fetchSlotSuggestion = async () => {
    setLoading(true)

    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const text = getSampleAIResponse('delivery slot')
      setResponse(text)
      setRecommendedSlot(parseRecommendedSlot(text))
      setLoading(false)
      setHasLoaded(true)
      return
    }

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'delivery_slot',
          message: `I need a delivery on ${deliveryDate}. What is the best time slot?`,
          data: { deliveryDate },
        }),
      })

      const data = await res.json()
      const text = data.error ? getSampleAIResponse('delivery slot') : data.response
      setResponse(text)
      setRecommendedSlot(parseRecommendedSlot(text))
    } catch {
      const fallback = getSampleAIResponse('delivery slot')
      setResponse(fallback)
      setRecommendedSlot(parseRecommendedSlot(fallback))
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  useEffect(() => {
    if (!hasLoaded && deliveryDate) {
      fetchSlotSuggestion()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryDate])

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 mt-2 text-orchard-400">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="text-xs font-body">Finding the best delivery slot...</span>
      </div>
    )
  }

  if (!hasLoaded || !response) return null

  return (
    <div className="mt-2 space-y-1.5">
      {/* Recommended badge */}
      {recommendedSlot && (
        <button
          onClick={() => onSelectSlot?.(recommendedSlot)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                   bg-leaf-50 border border-leaf-200 text-leaf-700
                   hover:bg-leaf-100 transition-colors duration-300 group"
        >
          <Sparkles className="w-3 h-3" />
          <span className="text-xs font-body font-semibold">Recommended:</span>
          <span className="text-xs font-body">{recommendedSlot}</span>
        </button>
      )}

      {/* Hint text */}
      <div className="flex items-start gap-1.5">
        <Clock className="w-3 h-3 text-orchard-300 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-orchard-400 font-body leading-relaxed">
          {response.length > 200 ? response.substring(0, 200) + '...' : response}
        </p>
      </div>
    </div>
  )
}

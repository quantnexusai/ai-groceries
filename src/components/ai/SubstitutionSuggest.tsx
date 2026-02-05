'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getSampleAIResponse } from '@/lib/demo-data'

interface SubstitutionSuggestProps {
  itemName: string
  onSelect?: (suggestion: string) => void
}

export default function SubstitutionSuggest({ itemName, onSelect }: SubstitutionSuggestProps) {
  const { isDemo } = useAuth()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [rawResponse, setRawResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const parseSuggestions = (text: string): string[] => {
    // Try to parse numbered or bulleted lists from the AI response
    const lines = text.split('\n').filter((line) => line.trim())
    const listItems = lines.filter(
      (line) =>
        /^\d+[\.\)]\s/.test(line.trim()) ||
        /^[-*]\s/.test(line.trim()) ||
        /^[A-Z]/.test(line.trim())
    )
    return listItems.length > 0 ? listItems.map((l) => l.replace(/^[\d\.\)\-\*]\s*/, '').trim()) : []
  }

  const fetchSubstitutions = async () => {
    setLoading(true)

    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const response = getSampleAIResponse('substitution')
      setRawResponse(response)
      const parsed = parseSuggestions(response)
      setSuggestions(parsed)
      setLoading(false)
      setHasLoaded(true)
      return
    }

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'substitution',
          message: `The item "${itemName}" is currently out of stock. Please suggest 3-4 good substitutes. List each suggestion on its own line with a brief reason.`,
          data: { outOfStockItem: itemName },
        }),
      })

      const data = await res.json()
      const text = data.error ? getSampleAIResponse('substitution') : data.response
      setRawResponse(text)
      const parsed = parseSuggestions(text)
      setSuggestions(parsed)
    } catch {
      const fallback = getSampleAIResponse('substitution')
      setRawResponse(fallback)
      setSuggestions(parseSuggestions(fallback))
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  useEffect(() => {
    if (!hasLoaded && itemName) {
      fetchSubstitutions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemName])

  return (
    <div className="card border-l-4 border-l-sunbeam-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sunbeam-100 flex items-center justify-center">
            <RefreshCw className="w-3.5 h-3.5 text-sunbeam-600" />
          </div>
          <h4 className="font-display font-semibold text-earth-600">
            Smart Substitutions
          </h4>
        </div>
        {hasLoaded && (
          <button
            onClick={fetchSubstitutions}
            disabled={loading}
            className="text-xs text-leaf-600 hover:text-leaf-700 font-body font-medium transition-colors"
          >
            Refresh
          </button>
        )}
      </div>

      <p className="text-xs text-orchard-400 font-body mb-3">
        <span className="font-semibold text-earth-500">{itemName}</span> is out of stock.
        Here are some alternatives:
      </p>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-2 py-3 text-orchard-400 font-body text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Finding substitutes...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <ul className="space-y-2">
          {suggestions.map((suggestion, idx) => (
            <li key={idx}>
              <button
                onClick={() => onSelect?.(suggestion)}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-sunbeam-50 hover:bg-leaf-50
                         border border-transparent hover:border-leaf-200
                         transition-all duration-300 group flex items-center justify-between"
              >
                <span className="text-sm text-earth-500 font-body">{suggestion}</span>
                {onSelect && (
                  <ArrowRight className="w-3.5 h-3.5 text-orchard-300 group-hover:text-leaf-500 transition-colors flex-shrink-0 ml-2" />
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : rawResponse ? (
        <p className="text-sm text-earth-500 font-body leading-relaxed whitespace-pre-line">
          {rawResponse}
        </p>
      ) : null}
    </div>
  )
}

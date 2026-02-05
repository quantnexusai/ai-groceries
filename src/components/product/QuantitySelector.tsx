import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  quantity: number
  max: number
  onChange: (qty: number) => void
}

export default function QuantitySelector({ quantity, max, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center gap-0 border border-orchard-200 rounded-full bg-sunbeam-50 overflow-hidden">
      <button
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center text-earth-500 hover:bg-sunbeam-100 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-10 h-10 flex items-center justify-center text-sm font-body font-semibold text-earth-600 select-none">
        {quantity}
      </span>

      <button
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center text-earth-500 hover:bg-sunbeam-100 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

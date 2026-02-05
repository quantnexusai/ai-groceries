interface BokehGradientProps {
  className?: string
}

export default function BokehGradient({ className = '' }: BokehGradientProps) {
  return (
    <div className={`pointer-events-none overflow-hidden absolute inset-0 ${className}`}>
      {/* Circle 1 — warm sunbeam */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sunbeam-200/40 blur-3xl animate-bokeh-drift"
      />

      {/* Circle 2 — soft leaf */}
      <div
        className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-leaf-200/30 blur-3xl animate-bokeh-drift"
        style={{ animationDelay: '7s' }}
      />

      {/* Circle 3 — gentle sunbeam */}
      <div
        className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-full bg-sunbeam-200/30 blur-3xl animate-bokeh-drift"
        style={{ animationDelay: '14s' }}
      />
    </div>
  )
}

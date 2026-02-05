import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-earth text-cream-100">
      {/* Bokeh overlays — green-tinted */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-earth-400/20 blur-3xl animate-bokeh-drift"
        />
        <div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-leaf-700/15 blur-3xl animate-bokeh-drift"
          style={{ animationDelay: '10s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-earth-300/10 blur-3xl animate-bokeh-drift"
          style={{ animationDelay: '5s' }}
        />
      </div>

      <div className="relative z-10 section max-w-3xl mx-auto text-center">
        <h2 className="font-display text-display-lg text-cream-100 mb-6">
          Groceries, reimagined
        </h2>

        <p className="font-body text-lg text-sunbeam-200 leading-relaxed max-w-xl mx-auto mb-10">
          Join thousands of families who&apos;ve discovered a smarter way to shop
          for fresh food.
        </p>

        <Link
          href="/stores"
          className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm uppercase tracking-wider py-4 px-10 rounded-full bg-sunbeam-400 text-earth-800 hover:bg-sunbeam-300 transition-all duration-500 ease-harvest"
        >
          Start Shopping
        </Link>
      </div>
    </section>
  )
}

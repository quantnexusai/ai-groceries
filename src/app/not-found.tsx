import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-7xl font-display font-bold text-sunbeam-400 mb-4">404</p>
          <h1 className="text-display-sm font-display text-earth-500 mb-4">
            The shelf is empty
          </h1>
          <p className="text-orchard-400 font-body text-lg mb-8">
            We couldn&apos;t find what you were looking for. It may have been moved or no longer exists.
          </p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

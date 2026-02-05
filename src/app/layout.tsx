import type { Metadata } from 'next'
import { Fraunces, Quicksand } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Groceries — Fresh, Intelligent, Delivered',
  description: 'An AI-powered grocery delivery platform connecting you with local stores. Fresh produce, smart recommendations, and seamless delivery — straight to your door.',
  keywords: ['grocery', 'delivery', 'AI', 'fresh', 'local', 'produce', 'organic', 'marketplace'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${quicksand.variable}`}>
      <body className="font-body bg-cream-100 text-earth antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

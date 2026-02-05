'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Leaf, ShoppingBag, User, Menu, X, Search } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import AuthModal from '@/components/AuthModal'

const navLinks = [
  { href: '/stores', label: 'Stores' },
  { href: '/stores?fresh=true', label: "What's Fresh" },
  { href: '/#how-it-works', label: 'How It Works' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [zipCode, setZipCode] = useState('')

  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (zipCode.trim()) {
      router.push(`/stores?zip=${zipCode.trim()}`)
      setZipCode('')
    }
  }

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false
    return pathname === href || pathname.startsWith(href.split('?')[0])
  }

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : null

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-sunbeam-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-leaf-100 flex items-center justify-center group-hover:bg-leaf-200 transition-colors duration-500 ease-harvest">
                <Leaf className="w-5 h-5 text-earth-500" />
              </div>
              <span className="font-display font-semibold text-lg text-earth-600 hidden sm:block">
                AI Groceries
              </span>
            </Link>

            {/* Center Nav (hidden on mobile) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive(link.href) ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Zip Search (hidden on mobile) */}
              <form onSubmit={handleZipSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orchard-300" />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter ZIP"
                    className="pl-9 pr-3 py-2 w-32 text-sm bg-sunbeam-50 border border-orchard-100 rounded-full
                             text-earth-500 placeholder:text-orchard-300
                             focus:ring-2 focus:ring-leaf-400 focus:border-leaf-400 outline-none
                             transition-all duration-300 ease-harvest font-body
                             focus:w-40"
                  />
                </div>
              </form>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-earth-400 hover:text-earth-600 hover:bg-sunbeam-50 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-leaf-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center animate-soft-drop">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <Link
                  href="/dashboard"
                  className="w-9 h-9 rounded-full bg-leaf-100 text-earth-600 flex items-center justify-center text-xs font-semibold font-body hover:bg-leaf-200 transition-colors duration-300"
                >
                  {userInitials}
                </Link>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="p-2 rounded-xl text-earth-400 hover:text-earth-600 hover:bg-sunbeam-50 transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-earth-400 hover:text-earth-600 hover:bg-sunbeam-50 transition-all duration-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sunbeam-200/50 bg-white/95 backdrop-blur-xl animate-soft-drop">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
              {/* Mobile Zip Search */}
              <form onSubmit={handleZipSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orchard-300" />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter your ZIP code"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-sunbeam-50 border border-orchard-100 rounded-xl
                             text-earth-500 placeholder:text-orchard-300
                             focus:ring-2 focus:ring-leaf-400 focus:border-leaf-400 outline-none
                             font-body"
                  />
                </div>
                <button type="submit" className="btn-primary btn-sm">
                  Search
                </button>
              </form>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-colors duration-300 ${
                      isActive(link.href)
                        ? 'bg-leaf-100 text-earth-600'
                        : 'text-earth-400 hover:bg-sunbeam-50 hover:text-earth-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth */}
              {!user && (
                <button
                  onClick={() => {
                    setShowAuth(true)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full btn-primary text-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {showAuth && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />}
    </>
  )
}

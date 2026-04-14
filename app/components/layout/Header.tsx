'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/app/lib/hooks/useCart'
import { useAuth } from '@/app/lib/hooks/useAuth'
import { useWishlist } from '@/app/lib/hooks/useWishlist'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { cartItems } = useCart()
  const { user } = useAuth()
  const { wishlistItems } = useWishlist()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { href: '/collections', label: 'Collections' },
    { href: '/products', label: 'Shop' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'backdrop-blur-[20px] bg-surface/80 border-b border-outline-variant/10 py-3'
        : 'bg-transparent py-6'
    }`}>
      <div className="flex justify-between items-center w-full px-8 lg:px-16 max-w-screen-2xl mx-auto">

        {/* Left: Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-body font-semibold uppercase tracking-[0.2em] text-on-surface hover:text-primary transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Center: Wordmark */}
        <Link
          href="/"
          className={`absolute left-1/2 -translate-x-1/2 font-headline tracking-tighter text-on-surface transition-all duration-300 ${
            isScrolled ? 'text-2xl' : 'text-3xl'
          }`}
        >
          Elegant Finds
        </Link>

        {/* Right: Icons */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-on-surface hover:text-primary transition-colors"
            aria-label="Search"
          >
            <span className="material-symbols-outlined font-light text-[22px]">search</span>
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="text-on-surface hover:text-primary transition-colors relative"
            aria-label="Wishlist"
          >
            <span className="material-symbols-outlined font-light text-[22px]">favorite</span>
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="text-on-surface hover:text-primary transition-colors relative"
            aria-label="Cart"
          >
            <span className="material-symbols-outlined font-light text-[22px]">shopping_bag</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href={user ? '/account' : '/auth/login'}
            className="text-on-surface hover:text-primary transition-colors"
            aria-label="Account"
          >
            <span className="material-symbols-outlined font-light text-[22px]">account_circle</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-on-surface"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined font-light">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 backdrop-blur-[20px] bg-surface/95 border-b border-outline-variant/10 py-6 px-8"
          >
            <div className="max-w-3xl mx-auto relative">
              <form onSubmit={handleSearch} className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary font-light">search</span>
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-b border-outline-variant/20 py-3 text-xl font-headline tracking-tight focus:border-primary outline-none transition-colors placeholder:text-on-surface-variant/30"
                  placeholder="Search curated collection..."
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined font-light">close</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 bg-surface md:hidden flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-2xl font-headline tracking-tighter text-on-surface">Elegant Finds</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <span className="material-symbols-outlined text-3xl font-light">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-5xl font-headline tracking-tighter text-on-surface hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-10 border-t border-outline-variant/10 flex gap-8">
              <Link href="/wishlist" className="text-sm font-body text-on-surface-variant" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
              <Link href={user ? '/account' : '/auth/login'} className="text-sm font-body text-on-surface-variant" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
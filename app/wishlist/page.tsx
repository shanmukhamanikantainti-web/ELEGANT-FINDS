'use client'

import { useWishlist } from '@/app/lib/hooks/useWishlist'
import { useCart } from '@/app/lib/hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="max-w-md w-full px-8 text-center pb-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            {/* Atmospheric blob */}
            <div className="relative mb-16 inline-block">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[80px] scale-[2]"></div>
              <div className="w-32 h-32 bg-surface-container-low rounded-[40px] flex items-center justify-center mx-auto relative shadow-luxe border border-outline-variant/10">
                <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>favorite</span>
              </div>
            </div>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-6">Your Curation Space</p>
            <h1 className="text-5xl font-headline text-on-surface mb-6 tracking-tighter">
              Wishlist<br /><span className="italic font-light text-primary">is Empty.</span>
            </h1>
            <p className="text-base text-on-surface-variant font-body mb-12 leading-relaxed opacity-60">
              Save your favorite pieces to your wishlist and revisit them anytime.
            </p>
            <Link
              href="/products"
              className="cta-glow px-12 py-5 rounded-full text-white font-body font-semibold text-sm inline-block"
            >
              Discover the Edit
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface pt-40 pb-40">
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-16">

        {/* Page Header */}
        <header className="mb-24">
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-6">Your Curation Space</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h1 className="text-7xl md:text-8xl font-headline tracking-tighter text-on-surface leading-[0.85]">
              My<br /><span className="italic font-light text-primary">Wishlist.</span>
            </h1>
            <div className="px-8 py-4 bg-surface-container-low rounded-full border border-outline-variant/10">
              <span className="text-[10px] font-body font-bold uppercase tracking-[0.3em] text-on-surface-variant/60">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'Piece' : 'Pieces'} Saved
              </span>
            </div>
          </div>
        </header>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.07, ease: [0.33, 1, 0.68, 1] }}
                className={`group relative bg-surface-container-lowest rounded-[32px] overflow-hidden shadow-luxe border border-outline-variant/5 hover:-translate-y-2 transition-all duration-500 ${
                  index % 3 === 1 ? 'lg:mt-8' : ''
                }`}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden p-3">
                  <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-surface-container-low">
                    <Image
                      src={item.product?.images?.[0] || '/images/placeholders/product.jpg'}
                      alt={item.product?.name || 'Wishlist item'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                    />
                    {/* Category tag */}
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-body font-bold uppercase tracking-widest bg-surface/90 backdrop-blur-sm text-on-surface-variant px-3 py-1.5 rounded-full">
                        {item.product?.category?.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/products/${item.product?.slug}`}
                    className="block text-lg font-headline text-on-surface hover:text-primary transition-colors tracking-tighter mb-1"
                  >
                    {item.product?.name}
                  </Link>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-headline text-primary tracking-tighter">
                      ${item.product?.price?.toFixed(2)}
                    </span>
                    {item.product?.compare_price && (
                      <span className="text-sm font-body text-on-surface-variant/40 line-through">
                        ${item.product.compare_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(item.product?.id, 1)}
                      className="flex-1 cta-glow text-white py-3 rounded-[14px] text-[11px] font-body font-semibold uppercase tracking-widest"
                    >
                      Add to Bag
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-12 h-12 rounded-[14px] bg-surface-container-low flex items-center justify-center text-on-surface-variant/40 hover:bg-error/5 hover:text-error transition-all"
                      aria-label="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined font-light text-lg">close</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Continue Shopping */}
        <div className="mt-24 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 text-sm font-body font-semibold uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined font-light text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Continue Exploring
          </Link>
        </div>
      </div>
    </div>
  )
}
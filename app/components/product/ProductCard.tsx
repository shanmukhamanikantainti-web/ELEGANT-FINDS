'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@/lib/utils/constants'
import { useCart } from '@/app/lib/hooks/useCart'
import { useWishlist } from '@/app/lib/hooks/useWishlist'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist()

  const hasDiscount = product.compare_price != null && product.compare_price > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0
  const isInList = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const variant = product.variants?.[0] || { size: 'one-size', color: 'default', material: '' }
    addToCart(product, variant)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1800)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInList) {
      const item = wishlistItems.find((w) => w.product_id === product.id)
      if (item) removeFromWishlist(item.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="group relative bg-surface-container-lowest rounded-[28px] overflow-hidden shadow-luxe border border-outline-variant/5 hover:-translate-y-2 transition-all duration-500">
      {/* Image Frame (Stitch: 12px internal padding) */}
      <div className="p-3 pb-0">
        <Link href={`/products/${product.slug}`} className="block relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-surface-container-low">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-surface-container animate-pulse rounded-[20px]" />
            )}
            <Image
              src={product.images[0] || '/images/placeholders/product.jpg'}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
            />

            {/* Glass overlay on hover */}
            <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/10 transition-colors duration-500 rounded-[20px]" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {hasDiscount && (
                <span className="bg-primary text-white text-[9px] font-body font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  -{discountPct}%
                </span>
              )}
              {!product.in_stock && (
                <span className="bg-on-surface/80 text-surface text-[9px] font-body font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Sold Out
                </span>
              )}
            </div>

            {/* Wishlist button (always right) */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full backdro-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 ${
                isInList
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/80 text-on-surface hover:bg-primary hover:text-white'
              }`}
              aria-label="Toggle wishlist"
            >
              <span
                className="material-symbols-outlined text-[18px] font-light"
                style={isInList ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                favorite
              </span>
            </button>

            {/* Quick Add — appears on hover */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-[14px] text-[11px] font-body font-bold uppercase tracking-widest transition-all duration-300 ${
                  addedToCart
                    ? 'bg-primary text-white'
                    : 'bg-surface/90 backdrop-blur-sm text-on-surface hover:bg-primary hover:text-white'
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm font-light">check</span>
                    Added
                  </span>
                ) : (
                  'Quick Add'
                )}
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="px-5 py-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-headline tracking-tight text-on-surface group-hover:text-primary transition-colors leading-snug mb-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-headline text-primary tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm font-body text-on-surface-variant/30 line-through">
                ${product.compare_price?.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[9px] font-body font-bold uppercase tracking-widest text-on-surface-variant/40">
            {product.category?.replace(/-/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  )
}
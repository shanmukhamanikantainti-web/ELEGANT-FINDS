'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/app/lib/hooks/useCart'
import { useWishlist } from '@/app/lib/hooks/useWishlist'
import ProductCard from '@/app/components/product/ProductCard'
import { Product, ProductVariant } from '@/lib/utils/constants'

function ProductDetailContent() {
  const params = useParams()
  const { slug } = params
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`)
        if (!res.ok) throw new Error(res.status === 404 ? 'Product not found' : 'Failed to fetch product')
        const data = await res.json()
        setProduct(data.product)
        if (data.product.variants?.length > 0) setSelectedVariant(data.product.variants[0])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchProduct()
  }, [slug])

  useEffect(() => {
    async function fetchRelatedProducts() {
      if (!product) return
      try {
        const res = await fetch(`/api/products?category=${product.category}`)
        if (res.ok) {
          const data = await res.json()
          setRelatedProducts(data.products.filter((p: Product) => p.id !== product.id).slice(0, 4))
        }
      } catch (err) {
        console.error('Related products fetch fail')
      }
    }
    fetchRelatedProducts()
  }, [product])

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      for (let i = 0; i < quantity; i++) addToCart(product, selectedVariant)
    }
  }

  const handleToggleWishlist = () => {
    if (!product) return
    if (isInWishlist(product.id)) {
      const item = wishlistItems.find(w => w.product_id === product.id)
      if (item) removeFromWishlist(item.id)
    } else {
      addToWishlist(product)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-primary/10 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-primary/40">Revealing Creation</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-6 font-light">inventory_2</span>
        <h1 className="text-4xl font-headline text-on-surface mb-4">Creation Not Found</h1>
        <p className="text-on-surface-variant font-body mb-8 max-w-md">{error || 'This selection has been archived from our collection.'}</p>
        <Link href="/products" className="bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:shadow-primary/20 transition-all">
          Explore Collection
        </Link>
      </div>
    )
  }

  const hasDiscount = product.compare_price && product.compare_price > product.price

  return (
    <div className="min-h-screen bg-surface pt-32">
      <div className="max-w-screen-2xl mx-auto px-8 pb-32">
        {/* Breadcrumb - Clean, No-Line */}
        <nav className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">Atelier</Link>
          <span className="text-on-surface-variant/20">/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Archive</Link>
          <span className="text-on-surface-variant/20">/</span>
          <span className="text-on-surface">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Gallery - Digital Atelier Style */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] bg-surface-container-low rounded-[40px] overflow-hidden custom-shadow group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                  className="w-full h-full"
                >
                  <Image
                    src={product.images?.[selectedImage] || '/images/placeholders/product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              <button 
                onClick={handleToggleWishlist}
                className={`absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                  isInWishlist(product.id) ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white/80 text-on-surface hover:bg-white'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl ${isInWishlist(product.id) ? 'fill-[1]' : ''}`}>favorite</span>
              </button>

              {hasDiscount && (
                <div className="absolute bottom-8 left-8 bg-primary/95 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full backdrop-blur-sm shadow-xl">
                  Limited Curation
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-6">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 rounded-[20px] overflow-hidden transition-all duration-500 scale-95 hover:scale-100 ${
                    selectedImage === idx ? 'ring-2 ring-primary ring-offset-4 ring-offset-surface' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info - Tonal & Refined */}
          <div className="py-8">
            <div className="mb-10">
              <span className="text-primary text-sm font-bold uppercase tracking-[0.4em] mb-4 block">{product.category.replace('-', ' ')}</span>
              <h1 className="text-5xl md:text-6xl font-headline tracking-tighter text-on-surface mb-8 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <span className="text-4xl font-body font-bold text-primary">${product.price.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-xl text-on-surface-variant/30 line-through font-body">${product.compare_price?.toFixed(2)}</span>
                )}
              </div>
            </div>

            <p className="text-lg text-on-surface-variant font-body leading-relaxed mb-12 max-w-xl">
              {product.description}
            </p>

            {/* Configurator */}
            <div className="space-y-10 mb-12">
              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Composition selection</span>
                  <div className="flex flex-wrap gap-4">
                    {product.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-6 py-4 rounded-[16px] font-body text-sm transition-all duration-300 ${
                          selectedVariant === v 
                            ? 'bg-on-surface text-surface shadow-lg' 
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        {v.color} / {v.material}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Desired Quantity</span>
                <div className="flex items-center gap-2 p-2 bg-surface-container-low rounded-[20px] w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-[14px] flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined font-light">remove</span>
                  </button>
                  <span className="w-16 text-center text-xl font-body font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-[14px] flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined font-light">add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-[2] bg-primary text-white py-6 rounded-[24px] font-bold uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all disabled:opacity-50 cta-glow flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                {product.in_stock ? 'Acquire Piece' : 'Awaiting Curation'}
              </button>
              <button 
                onClick={handleToggleWishlist}
                className={`flex-1 py-6 rounded-[24px] font-bold uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 border-2 ${
                  isInWishlist(product.id) ? 'bg-primary/5 border-primary text-primary' : 'bg-surface-container-low border-transparent text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className={`material-symbols-outlined ${isInWishlist(product.id) ? 'fill-[1]' : ''}`}>favorite</span>
                {isInWishlist(product.id) ? 'Curated' : 'Curate'}
              </button>
            </div>

            {/* Logistics - Digital Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 bg-surface-container-low rounded-[32px]">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-1 uppercase tracking-wider">White Glove Delivery</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Complimentary artisanal transit on all curations.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface mb-1 uppercase tracking-wider">Artisan Verified</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Authenticity guaranteed with a legacy certification.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Curations */}
        {relatedProducts.length > 0 && (
          <section className="mt-40">
            <div className="flex items-end justify-between mb-16 px-4">
              <div>
                <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] block mb-4">You May Enjoy</span>
                <h2 className="text-5xl font-headline tracking-tighter text-on-surface">Similar Curations</h2>
              </div>
              <Link href="/products" className="text-primary font-bold uppercase tracking-widest text-xs border-b-2 border-primary pb-1 hover:border-primary-variant transition-all">
                The Full Collection
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-primary/10 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-primary/40">Revealing Creation</p>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  )
}

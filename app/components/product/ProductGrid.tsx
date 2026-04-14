'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import { Product } from '@/lib/utils/constants'

interface ProductGridProps {
  categoryFilter?: string
}

// Fallback mock data when database is not set up
const fallbackProducts: Product[] = [
  {
    id: 1,
    name: 'Atelier Pearl Drops',
    slug: 'pearl-drop-earrings',
    description: 'Bespoke freshwater pearls set in 18k rose gold.',
    price: 450.00,
    compare_price: 520.00,
    category: 'Earrings',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop'],
    variants: [{ size: 'one-size', color: 'rose', material: 'gold' }],
    in_stock: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Crystal Pavé Set',
    slug: 'crystal-hair-clip-set',
    description: 'Precision cut crystals in a hand-polished setting.',
    price: 280.00,
    compare_price: null,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop'],
    variants: [{ size: 'set', color: 'clear', material: 'crystal' }],
    in_stock: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Heritage Chain',
    slug: 'rose-gold-bracelet',
    description: 'Signature linked chain in solid rose gold.',
    price: 890.00,
    compare_price: 1100.00,
    category: 'Bracelets',
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop'],
    variants: [{ size: '6.5"', color: 'rose', material: 'gold' }],
    in_stock: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Emerald Solitaire',
    slug: 'emerald-stud-earrings',
    description: 'Deep forest emeralds in a minimal bezel setting.',
    price: 650.00,
    compare_price: null,
    category: 'Earrings',
    images: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&auto=format&fit=crop'],
    variants: [{ size: '8mm', color: 'emerald', material: 'silver' }],
    in_stock: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
]

export default function ProductGrid({ categoryFilter }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams()
        if (categoryFilter) params.append('category', categoryFilter)

        const res = await fetch(`/api/products?${params.toString()}`)
        if (!res.ok) throw new Error('API failed')

        const data = await res.json()
        if (data.products?.length > 0) {
          setProducts(data.products)
        } else {
          throw new Error('No products')
        }
      } catch (err) {
        let filtered = fallbackProducts
        if (categoryFilter) {
          filtered = fallbackProducts.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase())
        }
        setProducts(filtered)
      } finally {
        setTimeout(() => setLoading(false), 800)
      }
    }
    fetchProducts()
  }, [categoryFilter])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-700">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-primary/10 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-primary/40">Curating Collection</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-40 px-8 text-center"
      >
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-6 font-light">
          search_off
        </span>
        <h3 className="text-3xl font-headline text-on-surface mb-2">No Curations Found</h3>
        <p className="text-on-surface-variant font-body mb-8">
          The requested category is currently being curated for our next collection.
        </p>
        <button 
          onClick={() => window.location.href = '/products'}
          className="text-primary font-bold uppercase tracking-widest text-sm border-b-2 border-primary pb-1 hover:text-primary-variant hover:border-primary-variant transition-all"
        >
          View All Products
        </button>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <ProductCard product={product} priority={index < 6} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, ArrowLeft } from 'lucide-react'
import ProductCard from '@/app/components/product/ProductCard'
import { Product } from '@/lib/utils/constants'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(!!query)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    async function searchProducts() {
      if (!query.trim()) {
        setProducts([])
        setLoading(false)
        setHasSearched(false)
        return
      }

      setLoading(true)
      setHasSearched(true)

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        } else {
          console.error('Search failed')
          setProducts([])
        }
      } catch (err) {
        console.error('Search error:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [query])

  return (
    <div className="section-padding bg-white min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/products"
            className="inline-flex items-center text-burgundy-700 hover:text-burgundy-800 transition-colors mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Shop
          </Link>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-playfair text-charcoal-800 mb-4">
              Search <span className="text-burgundy-700">Results</span>
            </h1>
            {query && (
              <p className="font-cormorant text-lg text-charcoal-600">
                {loading ? 'Searching...' : `Showing results for "${query}"`}
              </p>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-16">
          <form
            action="/search"
            method="GET"
            className="relative"
          >
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for products..."
              className="w-full px-6 py-4 pr-14 border-2 border-rose-200 focus:border-burgundy-700 outline-none transition-colors font-cormorant text-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-charcoal-600 hover:text-burgundy-700"
            >
              <Search size={24} />
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-cormorant text-lg text-charcoal-600">
              Searching for &quot;{query}&quot;...
            </p>
          </div>
        ) : hasSearched && products.length === 0 ? (
          <div className="text-center py-20">
            <Search size={80} className="mx-auto text-charcoal-300 mb-6" />
            <h2 className="text-2xl font-playfair text-charcoal-800 mb-4">
              No Results Found
            </h2>
            <p className="font-cormorant text-lg text-charcoal-600 mb-8">
              We couldn&apos;t find any products matching &quot;{query}&quot;.
              Try different keywords or browse our categories.
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Suggest Categories */}
        {!loading && products.length === 0 && query && (
          <div className="mt-16 border-t border-rose-200 pt-12">
            <h3 className="text-2xl font-playfair text-charcoal-800 mb-6 text-center">
              Explore Our Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['earrings', 'hair-clips', 'bracelets', 'necklaces', 'rings', 'accessories'].map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${cat}`}
                  className="p-6 bg-sand-50 hover:bg-burgundy-50 hover:border-burgundy-700 border-2 border-transparent text-center transition-all"
                >
                  <p className="font-playfair text-charcoal-800 capitalize">
                    {cat.replace('-', ' ')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-20 text-center">
        <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

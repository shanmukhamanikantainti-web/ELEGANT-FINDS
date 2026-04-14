'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, Package, Search, Filter } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  compare_price: number | null
  in_stock: boolean
  featured: boolean
  images: string[]
  category?: {
    name: string
    slug: string
  }
  category_slug?: string
  created_at: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/admin/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        } else {
          setError('Failed to fetch products')
        }
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete product')
      }

      setProducts(products.filter(p => p.id !== productId))
    } catch (err) {
      alert('Failed to delete product')
      console.error(err)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-1">
            Products
          </h1>
          <p className="text-charcoal-400 font-cormorant">
            {products.length} products in your catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-700 hover:bg-burgundy-600 text-white rounded-xl font-cormorant uppercase tracking-wider text-sm transition-colors"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-charcoal-800/50 border border-gold-900/30 rounded-xl text-white placeholder:text-charcoal-500 focus:outline-none focus:border-gold-500/50 transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 bg-charcoal-800/50 border border-gold-900/30 rounded-xl text-charcoal-300 hover:text-white hover:border-gold-900/50 transition-colors">
          <Filter size={18} />
          Filters
        </button>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-charcoal-800/50 border border-gold-900/20 rounded-2xl overflow-hidden"
      >
        {error ? (
          <div className="p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-charcoal-700 text-white rounded-lg hover:bg-charcoal-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="text-charcoal-600 mx-auto mb-4" />
            <h3 className="text-white font-playfair text-xl mb-2">No products found</h3>
            <p className="text-charcoal-400 font-cormorant mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Start by adding your first product'}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-700 hover:bg-burgundy-600 text-white rounded-xl font-cormorant uppercase tracking-wider text-sm transition-colors"
              >
                <Plus size={18} />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-900/20">
                  <th className="px-6 py-4 text-left text-xs font-cormorant uppercase tracking-wider text-charcoal-400">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-cormorant uppercase tracking-wider text-charcoal-400">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-cormorant uppercase tracking-wider text-charcoal-400">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-cormorant uppercase tracking-wider text-charcoal-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-cormorant uppercase tracking-wider text-charcoal-400">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-cormorant uppercase tracking-wider text-charcoal-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-900/10">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-charcoal-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-charcoal-700 rounded-xl overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-charcoal-500">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-charcoal-500 text-sm">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gold-500 font-cormorant font-semibold text-lg">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-charcoal-500 text-sm line-through">
                            ${product.compare_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-charcoal-700/50 text-charcoal-300 text-xs rounded-full capitalize">
                        {product.category_slug?.replace('-', ' ') || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          product.in_stock
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.featured && (
                          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gold-500/20 text-gold-500">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-charcoal-400 text-sm">
                        {new Date(product.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="p-2.5 text-charcoal-400 hover:text-white hover:bg-charcoal-700 rounded-lg transition-colors"
                          title="View on store"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2.5 text-charcoal-400 hover:text-gold-500 hover:bg-charcoal-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 text-charcoal-400 hover:text-red-400 hover:bg-charcoal-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
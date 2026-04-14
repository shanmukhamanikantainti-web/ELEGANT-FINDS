'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Button from '@/app/components/ui/Button'
import { useAdminProtection } from '@/app/lib/hooks/useAdmin'

interface ProductData {
  id: number
  name: string
  slug: string
  description: string
  price: number
  compare_price: number | null
  category_id: number
  images: string[]
  variants: Array<{ size: string; color: string; material: string }>
  in_stock: boolean
  featured: boolean
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const { isAdmin, checking } = useAdminProtection()

  const [product, setProduct] = useState<ProductData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!checking && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, checking, router])

  useEffect(() => {
    if (!isAdmin || checking) return

    async function fetchData() {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/products/${productId}`),
          fetch('/api/categories'),
        ])

        if (productRes.ok) {
          const productData = await productRes.json()
          setProduct(productData.product)
        } else {
          setError('Failed to load product')
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData.categories || [])
        }
      } catch (err) {
        setError('Failed to load data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (productId && isAdmin) {
      fetchData()
    }
  }, [productId, isAdmin, checking])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setError(null)
    setIsSubmitting(true)

    try {
      const updateData = {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compare_price: product.compare_price,
        category_id: product.category_id,
        images: product.images,
        variants: product.variants,
        in_stock: product.in_stock,
        featured: product.featured,
      }

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      alert('Product updated successfully!')
      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete product')
      }

      alert('Product deleted successfully!')
      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (checking || loading) {
    return (
      <div className="section-padding bg-sand-50 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  if (error || !product) {
    return (
      <div className="section-padding bg-sand-50 min-h-screen">
        <div className="container-custom max-w-4xl">
          <div className="text-center py-20">
            <h1 className="text-4xl font-playfair text-charcoal-800 mb-4">Error</h1>
            <p className="font-cormorant text-lg text-red-600 mb-8">
              {error || 'Product not found'}
            </p>
            <Link href="/admin/products" className="btn-primary inline-block">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-burgundy-700 hover:text-burgundy-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Products
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-playfair text-charcoal-800">
              Edit <span className="text-burgundy-700">Product</span>
            </h1>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="input-luxury"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={product.slug}
                  onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                  className="input-luxury"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Category
                </label>
                <select
                  value={product.category_id}
                  onChange={(e) => setProduct({ ...product, category_id: parseInt(e.target.value) })}
                  className="input-luxury"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Compare Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={product.compare_price || ''}
                    onChange={(e) => setProduct({ ...product, compare_price: e.target.value ? parseFloat(e.target.value) : null })}
                    className="input-luxury"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Description
              </label>
              <textarea
                rows={6}
                required
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="input-luxury"
              />
            </div>

            {/* Variants */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-charcoal-700">
                  Product Variants
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setProduct({
                    ...product,
                    variants: [...product.variants, { size: '', color: '', material: '' }]
                  })}
                >
                  <Plus size={16} className="mr-1" />
                  Add Variant
                </Button>
              </div>

              {product.variants.length === 0 ? (
                <p className="text-sm text-charcoal-500 mb-4">No variants added.</p>
              ) : (
                <div className="space-y-4">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="flex items-end gap-4 p-4 bg-sand-50">
                      <div className="flex-1">
                        <label className="block text-xs text-charcoal-600 mb-1">Size</label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) => {
                            const newVariants = [...product.variants]
                            newVariants[index] = { ...variant, size: e.target.value }
                            setProduct({ ...product, variants: newVariants })
                          }}
                          className="input-luxury text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-charcoal-600 mb-1">Color</label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => {
                            const newVariants = [...product.variants]
                            newVariants[index] = { ...variant, color: e.target.value }
                            setProduct({ ...product, variants: newVariants })
                          }}
                          className="input-luxury text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-charcoal-600 mb-1">Material</label>
                        <input
                          type="text"
                          value={variant.material}
                          onChange={(e) => {
                            const newVariants = [...product.variants]
                            newVariants[index] = { ...variant, material: e.target.value }
                            setProduct({ ...product, variants: newVariants })
                          }}
                          className="input-luxury text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProduct({
                            ...product,
                            variants: product.variants.filter((_, i) => i !== index)
                          })
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="flex items-center space-x-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={product.in_stock}
                  onChange={(e) => setProduct({ ...product, in_stock: e.target.checked })}
                  className="w-4 h-4 accent-burgundy-700"
                />
                <span className="ml-3 text-sm font-medium text-charcoal-700">In Stock</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
                  className="w-4 h-4 accent-burgundy-700"
                />
                <span className="ml-3 text-sm font-medium text-charcoal-700">Featured Product</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-rose-200 flex justify-end gap-4">
              <Link href="/admin/products">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting}>
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

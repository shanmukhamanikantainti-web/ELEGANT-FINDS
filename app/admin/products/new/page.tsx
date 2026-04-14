'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Upload } from 'lucide-react'
import Link from 'next/link'
import Button from '@/app/components/ui/Button'
import { useAdminProtection } from '@/app/lib/hooks/useAdmin'

interface Category {
  id: number
  name: string
  slug: string
}

export default function NewProductPage() {
  const router = useRouter()
  const { isAdmin, checking } = useAdminProtection()
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!checking && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, checking, router])

  if (checking) {
    return (
      <div className="section-padding bg-sand-50 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_price: '',
    category_id: '',
    images: [] as string[],
    variants: [] as any[],
    in_stock: true,
    featured: false,
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories || [])
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        category_id: parseInt(formData.category_id),
        images: formData.images,
        variants: formData.variants,
        in_stock: formData.in_stock,
        featured: formData.featured,
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: '', color: '', material: '' },
      ],
    })
  }

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData({ ...formData, variants: newVariants })
  }

  const handleRemoveVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    })
  }

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    })
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
          <h1 className="text-3xl font-playfair text-charcoal-800 mb-8">
            Add New <span className="text-burgundy-700">Product</span>
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="input-luxury"
                  placeholder="e.g., Pearl Drop Earrings"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Slug (URL-friendly)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input-luxury"
                  placeholder="auto-generated"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                  className="input-luxury"
                >
                  <option value="">Select a category</option>
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
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-luxury"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    Compare Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compare_price}
                    onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })}
                    className="input-luxury"
                    placeholder="Original price (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-luxury"
                placeholder="Describe the product in detail..."
              />
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-rose-200 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="product-images"
                  // TODO: Implement image upload to Supabase storage
                />
                <label htmlFor="product-images" className="cursor-pointer">
                  <Upload size={32} className="mx-auto text-charcoal-400 mb-2" />
                  <p className="text-sm text-charcoal-600">
                    Click to upload or drag and drop images
                  </p>
                  <p className="text-xs text-charcoal-400 mt-1">
                    PNG, JPG, WEBP up to 5MB each
                  </p>
                </label>
              </div>
              <p className="text-xs text-charcoal-500 mt-2">
                Note: Image upload will be implemented. For now, add image URLs manually.
              </p>
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
                  onClick={handleAddVariant}
                >
                  <Plus size={16} className="mr-1" />
                  Add Variant
                </Button>
              </div>

              {formData.variants.length === 0 ? (
                <p className="text-sm text-charcoal-500 mb-4">No variants added yet.</p>
              ) : (
                <div className="space-y-4">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="flex items-end gap-4 p-4 bg-sand-50">
                      <div className="flex-1">
                        <label className="block text-xs text-charcoal-600 mb-1">Size</label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          className="input-luxury text-sm"
                          placeholder="e.g., one-size, 8mm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-charcoal-600 mb-1">Color</label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          className="input-luxury text-sm"
                          placeholder="e.g., white, gold"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-charcoal-600 mb-1">Material</label>
                        <input
                          type="text"
                          value={variant.material}
                          onChange={(e) => handleVariantChange(index, 'material', e.target.value)}
                          className="input-luxury text-sm"
                          placeholder="e.g., gold-filled"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="flex items-center space-x-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="w-4 h-4 accent-burgundy-700"
                />
                <span className="ml-3 text-sm font-medium text-charcoal-700">In Stock</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
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
                Create Product
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react'
import Link from 'next/link'
import Button from '@/app/components/ui/Button'

// Mock product data (will be fetched from API)
const mockProduct = {
  id: 1,
  name: 'Pearl Drop Earrings',
  slug: 'pearl-drop-earrings',
  description: 'Elegant freshwater pearl earrings with 14k gold fill findings.',
  price: 89.00,
  compare_price: 120.00,
  category: 'earrings',
  images: ['/images/products/pearl-earrings-1.jpg'],
  variants: [{ size: 'one-size', color: 'white', material: 'gold' }],
  in_stock: true,
  featured: true,
  created_at: '2025-04-01T00:00:00Z',
  updated_at: '2025-04-05T00:00:00Z',
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product] = useState(mockProduct)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true)
      // TODO: Call delete API
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Product deleted')
      window.location.href = '/admin/products'
    }
  }

  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom max-w-6xl">
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
          className="bg-white shadow-sm"
        >
          <div className="p-6 border-b border-rose-200 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-playfair text-charcoal-800">{product.name}</h1>
              <p className="text-sm text-charcoal-500">ID: {productId}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/products/${productId}/edit`}>
                <Button variant="secondary" size="sm">
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Product Images */}
            <div className="lg:col-span-1 p-6 bg-sand-50">
              <h2 className="font-playfair text-xl text-charcoal-800 mb-4">Images</h2>
              <div className="space-y-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-white rounded-lg overflow-hidden border border-rose-200">
                    {/* Next/Image would go here */}
                    <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                      <Package size={48} />
                    </div>
                  </div>
                ))}
                <button className="w-full aspect-square border-2 border-dashed border-rose-300 rounded-lg flex flex-col items-center justify-center text-charcoal-500 hover:border-burgundy-500 hover:text-burgundy-700 transition-colors">
                  <Plus size={32} />
                  <span className="mt-2 text-sm font-cormorant">Add Image</span>
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-2 p-6">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-charcoal-500 mb-2">Price</h3>
                  <p className="text-2xl font-playfair font-semibold text-burgundy-700">
                    ${product.price.toFixed(2)}
                  </p>
                  {product.compare_price && (
                    <p className="text-sm text-charcoal-400 line-through">
                      ${product.compare_price.toFixed(2)}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-charcoal-500 mb-2">Category</h3>
                  <p className="text-lg font-cormorant text-charcoal-800 capitalize">
                    {product.category}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-charcoal-500 mb-2">Status</h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    product.in_stock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-charcoal-500 mb-2">Featured</h3>
                  <p className="text-charcoal-800">{product.featured ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-charcoal-500 mb-2">Description</h3>
                <p className="font-cormorant text-charcoal-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-charcoal-500 mb-3">Variants</h3>
                <div className="space-y-3">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="flex items-center gap-6 p-4 bg-sand-50 rounded-lg">
                      <span className="font-cormorant text-charcoal-700">
                        Size: <strong>{variant.size}</strong>
                      </span>
                      <span className="font-cormorant text-charcoal-700">
                        Color: <strong>{variant.color}</strong>
                      </span>
                      <span className="font-cormorant text-charcoal-700">
                        Material: <strong>{variant.material}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-rose-200 text-sm text-charcoal-500">
                <p>Created: {new Date(product.created_at).toLocaleDateString()}</p>
                <p>Last updated: {new Date(product.updated_at || product.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

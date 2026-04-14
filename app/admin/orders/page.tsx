'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminProtection } from '@/app/lib/hooks/useAdmin'
import { motion } from 'framer-motion'
import { Package, Eye } from 'lucide-react'
import Link from 'next/link'
import Button from '@/app/components/ui/Button'

interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price: number
  products?: {
    name: string
    images: string[]
  }
  variant: any
}

interface Order {
  id: number
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  contact_info: {
    email: string
    phone?: string
  }
  shipping_address: {
    full_name: string
    address_line1: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  order_items: OrderItem[]
  created_at: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { isAdmin, checking } = useAdminProtection()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Redirect if not admin
    if (!checking && !isAdmin) {
      router.push('/')
      return
    }

    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders')
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders || [])
        } else {
          setError('Failed to fetch orders')
        }
      } catch (err) {
        setError('Failed to load orders')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchOrders()
    }
  }, [isAdmin, checking, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-amber-100 text-amber-800'
    }
  }

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        ))
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus as any })
        }
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  // Show loading while checking admin status
  if (checking) {
    return (
      <div className="min-h-screen bg-sand-50 p-8">
        <div className="container-custom">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect handled by useEffect
  if (!isAdmin) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 p-8">
        <div className="container-custom">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sand-50 p-8">
        <div className="container-custom">
          <div className="bg-red-50 p-6 rounded-lg">
            <h1 className="text-2xl font-playfair text-charcoal-800 mb-2">Error</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/" className="text-burgundy-700 hover:underline">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50 p-8">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair text-charcoal-800">
              Order <span className="text-burgundy-700">Management</span>
            </h1>
            <p className="font-cormorant text-charcoal-600 mt-1">
              View and manage customer orders
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white shadow-sm p-12 text-center">
            <Package size={80} className="mx-auto text-charcoal-300 mb-6" />
            <h2 className="text-2xl font-playfair text-charcoal-800 mb-4">
              No Orders Yet
            </h2>
            <p className="font-cormorant text-lg text-charcoal-600">
              Orders will appear here once customers make purchases.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white shadow-sm cursor-pointer transition-all ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-burgundy-700' : ''
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-playfair text-lg font-semibold text-charcoal-800">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-charcoal-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-cormorant font-semibold text-burgundy-700">
                        ${order.total_amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-charcoal-600">
                        {order.order_items?.length || 0} items
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Detail */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-playfair text-xl font-semibold text-charcoal-800">
                        Order Details
                      </h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-6 pb-6 border-b border-rose-200">
                      <h3 className="text-sm font-semibold text-charcoal-700 mb-2">Customer</h3>
                      <p className="font-cormorant text-charcoal-800">
                        {selectedOrder.shipping_address.full_name}
                      </p>
                      <p className="text-sm text-charcoal-600">
                        {selectedOrder.contact_info.email}
                      </p>
                      {selectedOrder.contact_info.phone && (
                        <p className="text-sm text-charcoal-600">
                          {selectedOrder.contact_info.phone}
                        </p>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6 pb-6 border-b border-rose-200">
                      <h3 className="text-sm font-semibold text-charcoal-700 mb-2">
                        Shipping To
                      </h3>
                      <p className="font-cormorant text-sm text-charcoal-800 leading-relaxed">
                        {selectedOrder.shipping_address.full_name}<br />
                        {selectedOrder.shipping_address.address_line1}<br />
                        {selectedOrder.shipping_address.address_line2 && (
                          <>{selectedOrder.shipping_address.address_line2}<br /></>
                        )}
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}<br />
                        {selectedOrder.shipping_address.country}
                      </p>
                    </div>

                    {/* Items */}
                    <div className="mb-6 pb-6 border-b border-rose-200">
                      <h3 className="text-sm font-semibold text-charcoal-700 mb-4">Items</h3>
                      <div className="space-y-4">
                        {selectedOrder.order_items?.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-12 h-12 bg-sand-100 rounded overflow-hidden flex-shrink-0">
                              {item.products?.images?.[0] && (
                                <img
                                  src={item.products.images[0]}
                                  alt={item.products.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-cormorant text-sm text-charcoal-800 truncate">
                                {item.products?.name || 'Product'}
                              </p>
                              <p className="text-xs text-charcoal-500">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-burgundy-700">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="mb-6 pb-6 border-b border-rose-200">
                      <h3 className="text-sm font-semibold text-charcoal-700 mb-3">
                        Update Status
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(selectedOrder.id, status)}
                            disabled={selectedOrder.status === status}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                              selectedOrder.status === status
                                ? getStatusColor(status)
                                : 'bg-sand-100 text-charcoal-600 hover:bg-rose-200'
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <Link
                        href={`/account/orders/${selectedOrder.id}`}
                        className="text-burgundy-700 hover:underline text-sm"
                      >
                        View Full Order Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white shadow-sm p-12 text-center sticky top-24">
                  <Package size={60} className="mx-auto text-charcoal-300 mb-4" />
                  <p className="text-charcoal-500">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

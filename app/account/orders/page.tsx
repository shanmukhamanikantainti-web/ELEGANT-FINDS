'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/lib/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Order } from '@/lib/utils/constants'

export default function OrderHistoryPage() {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return

      try {
        const res = await fetch(`/api/orders?user_id=${user.id}`)
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
        setOrdersLoading(false)
      }
    }

    if (!loading && user) {
      fetchOrders()
    }
  }, [user, loading])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered':
        return { icon: 'check_circle', color: 'text-primary', label: 'Delivered' }
      case 'shipped':
        return { icon: 'local_shipping', color: 'text-primary', label: 'In Transit' }
      case 'cancelled':
        return { icon: 'cancel', color: 'text-error', label: 'Cancelled' }
      default:
        return { icon: 'schedule', color: 'text-on-surface-variant', label: 'Processing' }
    }
  }

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">Synchronizing Archive</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface pt-40 px-8">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-10 custom-shadow">
            <span className="material-symbols-outlined text-4xl text-primary/40">lock_open</span>
          </div>
          <h1 className="text-4xl font-headline tracking-tighter text-on-surface mb-6">Restricted Access</h1>
          <p className="text-on-surface-variant font-body mb-12 text-lg">Initialize your session to view your curated order history.</p>
          <Link href="/auth/login" className="inline-block bg-primary text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
            Proceed to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface pt-32 pb-40 px-8 md:px-16">
      <div className="max-w-screen-xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-20">
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block"
          >
            Account Registry
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-headline tracking-tighter text-on-surface mb-4"
          >
            Order <span className="text-primary">Journal</span>
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-on-surface-variant font-body text-lg"
          >
            A chronological record of your bespoke selections.
          </motion.p>
        </header>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-low rounded-[64px] p-24 text-center custom-shadow"
          >
            <span className="material-symbols-outlined text-6xl text-primary/20 mb-8 block">auto_stories</span>
            <h2 className="text-3xl font-headline text-on-surface mb-6 tracking-tight">An Empty Chapter</h2>
            <p className="text-on-surface-variant font-body mb-12 max-w-sm mx-auto leading-relaxed">Your journey with Elegant Finds is just beginning. Explore our latest curations to start your collection.</p>
            <Link href="/products" className="inline-block bg-primary text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
              Begin Exploration
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-10">
            <AnimatePresence>
              {orders.map((order, index) => {
                const status = getStatusConfig(order.status)
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 1, ease: [0.33, 1, 0.68, 1] }}
                    className="group bg-surface-container-low rounded-[48px] overflow-hidden custom-shadow hover:bg-surface-container transition-colors duration-500"
                  >
                    {/* Order Meta Header */}
                    <div className="p-8 md:p-12 border-b border-outline/5 flex flex-wrap justify-between items-center gap-8">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Reference Number</span>
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-headline text-on-surface tracking-tight">{order.order_number}</h3>
                          <span className="text-outline/40 text-xs font-body">•</span>
                          <span className="text-on-surface-variant font-body text-sm">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface custom-shadow-sm`}>
                          <span className={`material-symbols-outlined text-lg ${status.color}`}>{status.icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">{status.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">Vault Total</span>
                          <span className="text-xl font-headline text-on-surface">${order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Items Section */}
                    <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">Manifest Content</h4>
                        <div className="space-y-6">
                          {order.order_items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-6 group/item">
                              <div className="w-20 h-20 bg-surface rounded-3xl overflow-hidden custom-shadow-sm border border-outline/5 relative">
                                {item.products?.images?.[0] ? (
                                  <img
                                    src={item.products.images[0]}
                                    alt={item.products.name}
                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                    <span className="material-symbols-outlined text-primary/20">diamond</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-headline text-on-surface truncate mb-1">{item.products?.name}</h5>
                                <div className="flex items-center gap-3 text-[10px] text-on-surface-variant font-body">
                                   <span className="bg-surface px-2 py-0.5 rounded border border-outline/5">QTY: {item.quantity}</span>
                                   {item.variant && Object.entries(item.variant as object).map(([k, v]) => (
                                      <span key={k} className="uppercase tracking-widest">{v}</span>
                                   ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-headline text-on-surface">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Logistics Section */}
                      <div className="lg:border-l lg:border-outline/5 lg:pl-12 space-y-10">
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Destination Repository</h4>
                          <div className="bg-surface/50 p-6 rounded-[32px] border border-outline/5">
                            {order.shipping_address ? (
                              <p className="text-sm font-body text-on-surface leading-relaxed whitespace-pre-line">
                                {(order.shipping_address as any).full_name}
                                {"\n"}{(order.shipping_address as any).address_line1}
                                {(order.shipping_address as any).address_line2 ? `\n${(order.shipping_address as any).address_line2}` : ""}
                                {"\n"}{(order.shipping_address as any).city}, {(order.shipping_address as any).state} {(order.shipping_address as any).postal_code}
                                {"\n"}{(order.shipping_address as any).country}
                              </p>
                            ) : (
                              <p className="text-sm italic text-outline">Information unavailable</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-6 bg-primary/5 rounded-[32px] border border-primary/10">
                           <div className="flex items-center gap-4">
                              <span className="material-symbols-outlined text-primary">verified</span>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Purchase Status</p>
                                <p className="text-xs font-body text-on-surface">Payment Verified & Vaulted</p>
                              </div>
                           </div>
                           <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-[10px] font-bold uppercase tracking-widest text-primary px-4 py-2 bg-white rounded-full custom-shadow-sm"
                           >
                             Support
                           </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  )
}

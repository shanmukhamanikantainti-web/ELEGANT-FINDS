'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Order } from '@/lib/utils/constants'

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const res = await fetch(`/api/orders?order_number=${orderId}&email=${email}`)
      const data = await res.json()

      if (res.ok) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Information mismatch. Please verify order details.')
      }
    } catch (err) {
      setError('System unavailable. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-surface pt-32 pb-40 px-8">
      <div className="max-w-screen-xl mx-auto">
        
        {/* Header Section: Editorial Voice */}
        <div className="text-center max-w-4xl mx-auto mb-28">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-[10px] font-headline font-bold uppercase tracking-[0.5em] mb-8 block"
          >
            Logistics & Transparency
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.33, 1, 0.68, 1] }}
            className="text-6xl md:text-[8rem] font-headline tracking-tighter text-on-surface mb-10 leading-[0.85]"
          >
            Track Your <br />
            <span className="italic font-light text-primary-fixed-dim">Acquisition.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-on-surface-variant font-body text-xl max-w-2xl mx-auto leading-relaxed opacity-70"
          >
            Access the real-time archives and transit status of your bespoke selection within our curated global network.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start pb-40">
          
          {/* Lookup Form: Framed Atelier Style */}
          <motion.div 
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-surface-container-lowest rounded-[48px] p-6 shadow-luxe relative"
          >
            <div className="bg-surface-container-lowest rounded-[40px] p-10 md:p-16 border border-outline/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
              
              <form onSubmit={handleTrack} className="space-y-12 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-primary ml-1 block mb-2">Order Identifier</label>
                  <input 
                    type="text"
                    placeholder="e.g., EF-2024-XXXX"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-[24px] p-8 text-on-surface placeholder:text-outline/30 focus:ring-4 focus:ring-primary/5 transition-all font-body text-lg"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-primary ml-1 block mb-2">Contact Email</label>
                  <input 
                    type="email"
                    placeholder="The one used at checkout"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-[24px] p-8 text-on-surface placeholder:text-outline/30 focus:ring-4 focus:ring-primary/5 transition-all font-body text-lg"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="cta-glow w-full text-white py-8 rounded-[24px] font-headline font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl font-light">satellite_alt</span>
                      Initiate Retrieval
                    </>
                  )}
                </button>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-error/5 rounded-[24px] border border-error/10 text-error text-center text-[10px] font-headline font-bold tracking-[0.2em] uppercase"
                  >
                    {error}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Results Section: High Fidelity Tracker */}
          <div className="min-h-[500px]">
             <AnimatePresence mode="wait">
                {!order && !loading && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-12 bg-surface-container-low/20 rounded-[64px] border-2 border-dashed border-outline/5"
                  >
                     <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-10 shadow-luxe">
                        <span className="material-symbols-outlined text-4xl text-primary/30 font-light">explore</span>
                     </div>
                     <p className="text-on-surface-variant font-body italic text-xl opacity-60 max-w-xs">Awaiting repository credentials to initialize disposition lookup.</p>
                  </motion.div>
                )}

                {order && (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-surface-container-lowest rounded-[64px] p-10 md:p-14 shadow-luxe"
                  >
                     {/* Order Metadata */}
                     <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16 border-b border-outline/5 pb-10">
                        <div>
                           <p className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-primary mb-4">Current Disposition</p>
                           <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-surface shadow-sm ${getStatusConfig(order.status).color}`}>
                                <span className="material-symbols-outlined text-3xl font-light">
                                  {getStatusConfig(order.status).icon}
                                </span>
                              </div>
                              <span className="text-4xl font-headline tracking-tighter text-on-surface">{getStatusConfig(order.status).label}</span>
                           </div>
                        </div>
                        <div className="md:text-right">
                           <p className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-on-surface-variant mb-4">Acquisition Date</p>
                           <p className="font-headline text-2xl text-on-surface">
                             {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                           </p>
                        </div>
                     </div>

                     {/* Visual Progress Steps */}
                     <div className="mb-20 grid grid-cols-4 gap-4">
                        {['processing', 'shipped', 'delivered'].map((step, idx) => (
                           <div key={step} className="flex flex-col gap-3">
                              <div className={`h-1.5 rounded-full transition-all duration-1000 ${
                                (order.status === 'delivered') || 
                                (order.status === 'shipped' && (idx === 0 || idx === 1)) || 
                                (order.status === 'processing' && idx === 0)
                                ? 'bg-primary' : 'bg-outline/10'
                              }`} />
                              <span className="text-[8px] font-headline font-bold uppercase tracking-widest text-on-surface-variant opacity-40">{step}</span>
                           </div>
                        ))}
                        <div className="flex flex-col gap-3">
                          <div className="h-1.5 rounded-full bg-outline/10" />
                          <span className="text-[8px] font-headline font-bold uppercase tracking-widest text-on-surface-variant opacity-40">Complete</span>
                        </div>
                     </div>

                     {/* Item Manifest */}
                     <div className="space-y-6 mb-16">
                        <p className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-on-surface-variant mb-6">Manifest Content</p>
                        {order.order_items?.map((item: any, i: number) => (
                           <div key={i} className="flex items-center gap-8 p-6 bg-surface-container-low/30 rounded-[32px] hover:bg-surface-container-low transition-all duration-500">
                              <div className="w-24 h-32 rounded-[24px] overflow-hidden shadow-luxe flex-shrink-0">
                                 {item.products?.images?.[0] ? (
                                   <img src={item.products.images[0]} alt={item.products.name} className="w-full h-full object-cover" />
                                 ) : (
                                   <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-primary/20">
                                      <span className="material-symbols-outlined text-3xl font-light">diamond</span>
                                   </div>
                                 )}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-2xl font-headline tracking-tighter text-on-surface mb-2 truncate">{item.products?.name}</p>
                                 <p className="text-[10px] font-headline text-primary uppercase tracking-[0.4em]">Unit Disposition: {item.quantity}</p>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Support Call to Action */}
                     <div className="pt-10 border-t border-outline/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                           <p className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-on-surface-variant mb-3">Logistics Support</p>
                           <p className="text-lg font-headline text-on-surface">concierge@elegantfinds.com</p>
                        </div>
                        <Link href="/faq" className="px-10 py-5 bg-surface border border-outline/10 rounded-full text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-primary hover:bg-primary hover:text-white transition-all duration-500">
                           Resolution Hub
                        </Link>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  )
}

'use client'

import { useCart } from '@/app/lib/hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  const subtotal = getCartTotal()
  const shipping = subtotal > 150 ? 0 : 25
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="max-w-lg w-full px-8 text-center pb-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            <div className="relative mb-16 inline-block">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-[80px] scale-[2]"></div>
              <div className="w-32 h-32 bg-surface-container-low rounded-[40px] flex items-center justify-center mx-auto relative shadow-luxe border border-outline/5">
                <span className="material-symbols-outlined text-6xl text-primary font-extralight">shopping_bag</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline text-on-surface mb-8 tracking-tighter leading-[0.9]">The Archive<br/><span className="italic font-light text-primary">Awaits.</span></h1>
            <p className="text-on-surface-variant font-body mb-16 leading-relaxed text-xl opacity-60">Your curation haven is currently empty. Begin selecting pieces for your personal collection.</p>
            <Link href="/products" className="cta-glow px-16 py-6 rounded-full text-white font-headline font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all hover:scale-105 inline-block">
              Explore the Edit
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface pt-40 pb-60 selection:bg-primary/20">
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-16">
        <header className="mb-32">
          <span className="text-primary text-[10px] font-headline font-bold uppercase tracking-[0.6em] mb-8 block">Your Selections</span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h1 className="text-7xl md:text-[9rem] font-headline tracking-tighter text-on-surface leading-[0.8]">
              Shopping<br/><span className="italic font-light text-primary">Archive.</span>
            </h1>
            <div className="flex items-center gap-6 pb-4">
              <div className="px-8 py-4 bg-surface-container-low rounded-full border border-outline/5 shadow-sm">
                <span className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-on-surface-variant/60">{cartItems.length} {cartItems.length === 1 ? 'Piece' : 'Pieces'} Selected</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-24 items-start">
          {/* Cart Items List */}
          <div className="xl:col-span-8 space-y-10">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: [0.33, 1, 0.68, 1] }}
                  className="bg-white p-6 rounded-[52px] flex flex-col sm:flex-row gap-8 items-center group shadow-luxe border border-outline/5 hover:-translate-y-1 transition-transform duration-500"
                >
                  {/* Item Image */}
                  <div className="relative w-44 h-44 rounded-[36px] overflow-hidden bg-surface-container-lowest shrink-0 border border-outline/10">
                    <Image
                      src={item.product?.images?.[0] || '/images/placeholders/product.jpg'}
                      alt={item.product?.name || 'Creation'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-6">
                      <Link
                        href={`/products/${item.product?.slug}`}
                        className="text-2xl md:text-3xl font-headline text-on-surface hover:text-primary transition-colors block mb-2 tracking-tighter"
                      >
                        {item.product?.name}
                      </Link>
                      <span className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">
                        {Object.values(item.variant || {}).join(' • ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 p-2 bg-surface-container-low rounded-[24px] border border-outline/5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-12 h-12 rounded-[18px] flex items-center justify-center text-on-surface hover:bg-white hover:shadow-sm transition-all"
                        >
                          <span className="material-symbols-outlined text-xl font-light">remove</span>
                        </button>
                        <span className="w-12 text-center font-headline font-bold text-on-surface text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-12 h-12 rounded-[18px] flex items-center justify-center text-on-surface hover:bg-white hover:shadow-sm transition-all"
                        >
                          <span className="material-symbols-outlined text-xl font-light">add</span>
                        </button>
                      </div>

                      <div className="text-3xl font-headline font-light text-primary tracking-tighter">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Removal Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-16 h-16 rounded-full bg-surface-container-lowest border border-outline/10 flex items-center justify-center text-on-surface-variant/30 hover:bg-error/5 hover:text-error hover:border-error/20 transition-all duration-500 group/btn"
                  >
                    <span className="material-symbols-outlined font-light text-xl group-hover/btn:rotate-90 transition-transform duration-500">close</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-10 flex justify-between items-center px-6">
              <Link href="/products" className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-on-surface-variant/50 hover:text-primary transition-colors flex items-center gap-4 group">
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Continue Selection
              </Link>
              <button
                onClick={clearCart}
                className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-on-surface-variant/30 hover:text-error/70 transition-colors"
              >
                Reset Archive
              </button>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="xl:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="bg-on-surface text-surface p-12 lg:p-16 rounded-[60px] shadow-2xl shadow-on-surface/10 sticky top-40 overflow-hidden relative"
            >
              {/* Atmospheric glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"></div>

              <h2 className="text-4xl font-headline tracking-tighter mb-16 relative">The Ledger</h2>

              <div className="space-y-8 mb-16 relative">
                <div className="flex justify-between items-center">
                  <span className="text-base font-body text-surface/50">Subtotal</span>
                  <span className="text-xl font-headline tracking-tighter text-surface">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-body text-surface/50">Delivery</span>
                  <span className="text-base font-headline font-bold text-primary tracking-widest">
                    {shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="bg-surface/5 p-5 rounded-[20px] border border-surface/10 text-center">
                    <p className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-surface/40">
                      Add ${(150 - subtotal).toFixed(2)} for complimentary delivery
                    </p>
                  </div>
                )}

                <div className="pt-8 border-t border-surface/10 flex justify-between items-end">
                  <span className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-surface/30">Total Investment</span>
                  <span className="text-6xl font-headline tracking-tighter text-white leading-none">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-primary text-white text-center py-8 rounded-[36px] font-headline font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all relative cta-glow"
              >
                Complete Acquisition
              </Link>

              <p className="mt-10 text-center text-[10px] font-headline uppercase tracking-[0.3em] opacity-20">
                Encrypted & Secured by Rosé Nexus
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

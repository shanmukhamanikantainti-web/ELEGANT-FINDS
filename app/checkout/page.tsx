'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/app/lib/hooks/useCart'
import { useAuth } from '@/app/lib/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const INPUT_CLASS =
  'w-full bg-surface-container-low border border-transparent focus:border-primary rounded-[12px] py-4 px-5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all focus:bg-surface-container-lowest'

const LABEL_CLASS =
  'block text-[10px] font-body font-bold uppercase tracking-[0.35em] text-on-surface-variant/50 mb-2'

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const subtotal = getCartTotal()
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + shipping

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect_to=/checkout`)
    }
  }, [user, authLoading, router])

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push(`/auth/login?redirect_to=/checkout`)
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          shipping_address: {
            full_name: shippingInfo.fullName,
            address_line1: shippingInfo.addressLine1,
            address_line2: shippingInfo.addressLine2,
            city: shippingInfo.city,
            state: shippingInfo.state,
            postal_code: shippingInfo.postalCode,
            country: shippingInfo.country,
          },
          contact_info: { email: shippingInfo.email, phone: shippingInfo.phone },
          items: cartItems.map((item) => ({
            product_id: item.product_id,
            variant: item.variant,
            quantity: item.quantity,
            price: item.product?.price || 0,
          })),
          total_amount: total,
          payment_method: 'cod',
        }),
      })
      if (response.ok) {
        const order = await response.json()
        setOrderNumber(order.order.order_number)
        setOrderComplete(true)
        clearCart()
      }
    } catch (err) {
      console.error('Error placing order:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── Loading ── */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return null

  /* ── Empty Cart ── */
  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="max-w-md text-center px-8 pb-32">
          <div className="w-28 h-28 bg-surface-container-low rounded-[36px] flex items-center justify-center mx-auto mb-10 shadow-luxe">
            <span className="material-symbols-outlined text-6xl text-primary font-extralight">shopping_basket</span>
          </div>
          <h1 className="text-4xl font-headline tracking-tighter text-on-surface mb-4">Bag is Empty</h1>
          <p className="text-sm font-body text-on-surface-variant/60 mb-10">
            Return to the atelier to find the perfect addition to your curated life.
          </p>
          <Link href="/products" className="cta-glow px-12 py-5 rounded-full text-white font-body font-semibold text-sm inline-block">
            Visit the Edit
          </Link>
        </div>
      </div>
    )
  }

  /* ── Order Complete ── */
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-fixed/30 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="max-w-xl w-full bg-surface-container-lowest rounded-[48px] p-16 shadow-luxe text-center relative z-10"
        >
          <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/30">
            <span className="material-symbols-outlined text-white text-5xl">check_circle</span>
          </div>
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-4">Order Confirmed</p>
          <h1 className="text-5xl font-headline tracking-tighter text-on-surface mb-4">
            Acquisition<br /><span className="italic font-light">Complete.</span>
          </h1>
          <p className="text-sm font-body text-on-surface-variant/60 leading-relaxed mb-6">
            A confirmation has been sent to <strong className="text-on-surface">{shippingInfo.email}</strong>.
          </p>
          <div className="inline-flex items-center gap-3 bg-surface-container-low rounded-full px-8 py-3 mb-12">
            <span className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-on-surface-variant/50">Order</span>
            <span className="text-sm font-headline font-bold text-primary">{orderNumber}</span>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="flex-1 bg-on-surface text-surface py-4 rounded-[16px] font-body font-semibold text-sm text-center hover:bg-primary transition-colors">
              Back Home
            </Link>
            <Link href="/order-tracking" className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-[16px] font-body font-semibold text-sm text-center hover:bg-surface-container transition-colors">
              Track Order
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  /* ── Main Checkout ── */
  return (
    <div className="min-h-screen bg-surface pt-36 pb-40 px-8 lg:px-16">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <header className="mb-20">
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-4">Finalization</p>
          <h1 className="text-6xl md:text-7xl font-headline tracking-tighter text-on-surface leading-[0.85]">
            The Acquisition<br />
            <span className="italic font-light text-primary">Ledger.</span>
          </h1>
        </header>

        {/* Step Progress */}
        <div className="flex items-center gap-4 mb-16">
          {[
            { num: 1, label: 'Delivery Details' },
            { num: 2, label: 'Review & Pay' },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-bold transition-all duration-300 ${
                    step >= s.num ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface-container text-on-surface-variant/50'
                  }`}
                >
                  {step > s.num ? (
                    <span className="material-symbols-outlined text-sm font-light">check</span>
                  ) : (
                    s.num
                  )}
                </div>
                <span className={`text-[11px] font-body font-semibold uppercase tracking-widest hidden sm:block ${step >= s.num ? 'text-on-surface' : 'text-on-surface-variant/40'}`}>
                  {s.label}
                </span>
              </div>
              {i < 1 && <div className={`flex-1 h-px max-w-[80px] transition-all duration-500 ${step > s.num ? 'bg-primary' : 'bg-outline-variant/20'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">

          {/* Left: Form */}
          <div className="xl:col-span-7 space-y-8">
            <AnimatePresence mode="wait">

              {/* Step 1: Delivery */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleShippingSubmit}
                  className="space-y-8"
                >
                  <div className="bg-surface-container-lowest rounded-[32px] p-10 shadow-luxe border border-outline-variant/5">
                    <h2 className="text-2xl font-headline tracking-tight text-on-surface mb-8">Contact</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className={LABEL_CLASS}>Full Name</label>
                        <input
                          className={INPUT_CLASS}
                          required
                          placeholder="Jane Doe"
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Email</label>
                        <input
                          type="email"
                          className={INPUT_CLASS}
                          required
                          placeholder="jane@example.com"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Phone</label>
                        <input
                          type="tel"
                          className={INPUT_CLASS}
                          placeholder="+1 555 000 0000"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-[32px] p-10 shadow-luxe border border-outline-variant/5">
                    <h2 className="text-2xl font-headline tracking-tight text-on-surface mb-8">Delivery Address</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className={LABEL_CLASS}>Street Address</label>
                        <input
                          className={INPUT_CLASS}
                          required
                          placeholder="123 Main Street"
                          value={shippingInfo.addressLine1}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, addressLine1: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={LABEL_CLASS}>Apartment, Suite (Optional)</label>
                        <input
                          className={INPUT_CLASS}
                          placeholder="Apt 4B"
                          value={shippingInfo.addressLine2}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, addressLine2: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>City</label>
                        <input
                          className={INPUT_CLASS}
                          required
                          placeholder="Seoul"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>State / Province</label>
                        <input
                          className={INPUT_CLASS}
                          placeholder="Gyeonggi-do"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Postal Code</label>
                        <input
                          className={INPUT_CLASS}
                          required
                          placeholder="12345"
                          value={shippingInfo.postalCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Country</label>
                        <input
                          className={INPUT_CLASS}
                          required
                          placeholder="South Korea"
                          value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full cta-glow text-white py-5 rounded-[16px] font-body font-semibold text-sm tracking-wide flex items-center justify-center gap-3 group"
                  >
                    Continue to Review
                    <span className="material-symbols-outlined font-light text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </motion.form>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Delivery Summary */}
                  <div className="bg-surface-container-lowest rounded-[32px] p-10 shadow-luxe border border-outline-variant/5">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-headline tracking-tight text-on-surface">Delivery Details</h2>
                      <button
                        onClick={() => setStep(1)}
                        className="text-[10px] font-body font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-body text-on-surface">{shippingInfo.fullName}</p>
                      <p className="text-sm font-body text-on-surface-variant/60">{shippingInfo.addressLine1}{shippingInfo.addressLine2 && `, ${shippingInfo.addressLine2}`}</p>
                      <p className="text-sm font-body text-on-surface-variant/60">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}, {shippingInfo.country}</p>
                      <p className="text-sm font-body text-on-surface-variant/60 pt-1">{shippingInfo.email} · {shippingInfo.phone}</p>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="bg-surface-container-lowest rounded-[32px] p-10 shadow-luxe border border-outline-variant/5">
                    <h2 className="text-xl font-headline tracking-tight text-on-surface mb-8">Payment</h2>
                    <div className="p-5 rounded-[16px] bg-primary/5 border border-primary/10 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white font-light text-lg">payments</span>
                      </div>
                      <div>
                        <p className="text-sm font-body font-semibold text-on-surface">Cash on Delivery</p>
                        <p className="text-xs font-body text-on-surface-variant/60">Payment collected upon arrival</p>
                      </div>
                    </div>
                  </div>

                  {/* Cart items preview */}
                  <div className="bg-surface-container-lowest rounded-[32px] p-10 shadow-luxe border border-outline-variant/5">
                    <h2 className="text-xl font-headline tracking-tight text-on-surface mb-8">Your Selections</h2>
                    <div className="space-y-5">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-5">
                          <div className="relative w-16 h-16 rounded-[14px] overflow-hidden bg-surface-container-low flex-shrink-0 border border-outline-variant/10">
                            <Image
                              src={item.product?.images?.[0] || '/images/placeholders/product.jpg'}
                              alt={item.product?.name || ''}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-headline text-on-surface tracking-tight">{item.product?.name}</p>
                            <p className="text-xs font-body text-on-surface-variant/50">Qty {item.quantity}</p>
                          </div>
                          <p className="text-sm font-headline text-primary tracking-tight">
                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full cta-glow text-white py-6 rounded-[16px] font-body font-semibold text-sm tracking-wide flex items-center justify-center gap-3 disabled:opacity-60 group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Confirm Acquisition — ${total.toFixed(2)}
                        <span className="material-symbols-outlined font-light text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Order Summary */}
          <div className="xl:col-span-5">
            <div className="bg-on-surface rounded-[40px] p-10 shadow-2xl shadow-on-surface/10 sticky top-36 overflow-hidden relative">
              {/* Glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />

              <h2 className="text-3xl font-headline tracking-tight text-surface mb-10 relative">Order Summary</h2>

              {/* Items */}
              <div className="space-y-5 mb-10 relative">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-[12px] overflow-hidden bg-surface/10 flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0] || '/images/placeholders/product.jpg'}
                        alt={item.product?.name || ''}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-headline text-surface/80 tracking-tight leading-tight">{item.product?.name}</p>
                    </div>
                    <p className="text-sm font-headline text-surface tracking-tight">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="relative space-y-4 border-t border-surface/10 pt-8 mb-8">
                <div className="flex justify-between">
                  <span className="text-sm font-body text-surface/50">Subtotal</span>
                  <span className="text-sm font-headline text-surface">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-body text-surface/50">Shipping</span>
                  <span className="text-sm font-headline font-bold text-primary tracking-widest">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <div className="relative flex items-end justify-between border-t border-surface/10 pt-6">
                <span className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-surface/30">Total</span>
                <span className="text-5xl font-headline text-white tracking-tighter">${total.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <p className="mt-4 text-[10px] font-body text-surface/30 text-center uppercase tracking-widest relative">
                  Free shipping on orders over $100
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

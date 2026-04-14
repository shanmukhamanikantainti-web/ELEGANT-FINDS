'use client'

import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-playfair text-charcoal-800 mb-8 text-center flex items-center justify-center gap-4">
            <Truck size={40} className="text-burgundy-700" />
            Shipping <span className="text-burgundy-700">Information</span>
          </h1>
          <div className="bg-white p-10 shadow-sm space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Domestic Shipping</h2>
              <p className="text-charcoal-600">Free standard shipping on orders over $100. Orders under $100 have a $15 shipping fee.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">International Shipping</h2>
              <p className="text-charcoal-600">We ship to over 50 countries. International shipping rates start at $25 and are calculated at checkout based on destination and package weight.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">Processing Time</h2>
              <p className="text-charcoal-600">Orders are processed within 1-2 business days. You&apos;ll receive a tracking number via email once your order ships.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

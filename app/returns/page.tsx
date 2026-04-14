'use client'

import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-playfair text-charcoal-800 mb-8 text-center flex items-center justify-center gap-4">
            <RotateCcw size={40} className="text-burgundy-700" />
            Returns & <span className="text-burgundy-700">Exchanges</span>
          </h1>
          <div className="bg-white p-10 shadow-sm space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">30-Day Return Policy</h2>
              <p className="text-charcoal-600">We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">How to Return</h2>
              <ol className="list-decimal list-inside text-charcoal-600 space-y-2">
                <li>Contact our customer service team to initiate a return.</li>
                <li>Package the item(s) securely with the original packing slip.</li>
                <li>Ship to the address provided. Shipping costs for returns are the responsibility of the customer unless the item is defective.</li>
              </ol>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">Exchanges</h2>
              <p className="text-charcoal-600">Want a different size or color? We&apos;re happy to exchange eligible items. Please note that exchanges are subject to product availability.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

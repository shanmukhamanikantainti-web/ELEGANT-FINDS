'use client'

import { motion } from 'framer-motion'

export default function FAQPage() {
  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-playfair text-charcoal-800 mb-8 text-center">
            Frequently <span className="text-burgundy-700">Asked Questions</span>
          </h1>
          <div className="bg-white p-10 shadow-sm space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-charcoal-600">We accept all major credit cards, PayPal, and bank transfers.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How long does shipping take?</h3>
              <p className="text-charcoal-600">Standard shipping takes 5-7 business days. Express options available at checkout.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Do you ship internationally?</h3>
              <p className="text-charcoal-600">Yes! We ship to most countries worldwide. Shipping costs vary by destination.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What is your return policy?</h3>
              <p className="text-charcoal-600">We offer a 30-day return policy for unused items in original packaging.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

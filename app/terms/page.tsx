'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-playfair text-charcoal-800 mb-8 text-center">
            Terms of <span className="text-burgundy-700">Service</span>
          </h1>
          <div className="bg-white p-10 shadow-sm space-y-6 text-charcoal-600">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">1. Acceptance of Terms</h2>
              <p>By using this website, you agree to these Terms of Service. If you do not agree, please do not use the site.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">2. Use License</h2>
              <p>Permission is granted to temporarily access the materials on Elegant Finds 47&apos;s website for personal, non-commercial use only.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">3. Product Information</h2>
              <p>We strive to display accurate product information, but we do not warrant that product descriptions or pricing are complete, reliable, or error-free.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">4. Pricing and Payments</h2>
              <p>All prices are subject to change without notice. We reserve the right to refuse any order placed through the website.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">5. Limitation of Liability</h2>
              <p>Elegant Finds 47 shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our website or products.</p>
            </section>
            <p className="text-sm pt-6 border-t border-rose-200">
              Last updated: April 7, 2025
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'

export default function CareersPage() {
  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-playfair text-charcoal-800 mb-8 text-center">
            Careers <span className="text-burgundy-700">at Elegant Finds</span>
          </h1>
          <div className="bg-white p-10 shadow-sm">
            <p className="font-cormorant text-lg text-charcoal-600 leading-relaxed mb-6">
              Join our team and be part of a passionate group of fashion enthusiasts. We&apos;re always looking for talented individuals who share our love for elegance and quality.
            </p>
            <p className="font-cormorant text-lg text-charcoal-600">
              Currently, there are no open positions. Please check back later for opportunities.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

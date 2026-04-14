'use client'

import { motion } from 'framer-motion'

export default function SizeGuidePage() {
  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-playfair text-charcoal-800 mb-8 text-center">
            Size <span className="text-burgundy-700">Guide</span>
          </h1>
          <div className="bg-white p-10 shadow-sm">
            <p className="font-cormorant text-lg text-charcoal-600 mb-6">
              Our jewellery is designed to be adjustable to fit most sizes. Below are general size recommendations:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-sand-50">
                    <th className="px-6 py-3 text-left">Product Type</th>
                    <th className="px-6 py-3 text-left">Size</th>
                    <th className="px-6 py-3 text-left">Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  <tr>
                    <td className="px-6 py-4">Earrings</td>
                    <td className="px-6 py-4">One Size</td>
                    <td className="px-6 py-4">Fits most ear lobes</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Bracelets</td>
                    <td className="px-6 py-4">6.5" - 7.5"</td>
                    <td className="px-6 py-4">Standard adult wrist</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Necklaces</td>
                    <td className="px-6 py-4">16" - 18"</td>
                    <td className="px-6 py-4">Choker to standard length</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Hair Clips</td>
                    <td className="px-6 py-4">Standard</td>
                    <td className="px-6 py-4">Fits all hair types</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-charcoal-500 mt-6">
              For specific measurements or custom orders, please contact us.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

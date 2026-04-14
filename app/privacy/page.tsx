'use client'

import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-playfair text-charcoal-800 mb-8 text-center">
            Privacy <span className="text-burgundy-700">Policy</span>
          </h1>
          <div className="bg-white p-10 shadow-sm space-y-6 text-charcoal-600">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">1. Information We Collect</h2>
              <p>We collect personal information you provide directly to us, such as when you create an account, make a purchase, or contact customer support.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">2. How We Use Your Information</h2>
              <p>We use the information we collect to process your orders, improve our services, and communicate with you about your purchases and promotions.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">3. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">4. Third-Party Services</h2>
              <p>We use Supabase for database and authentication services, and Resend for transactional emails. These services have their own privacy policies.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3 text-charcoal-800">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. Contact us for any privacy-related requests.</p>
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

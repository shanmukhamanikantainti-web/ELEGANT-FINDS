'use client'

import { motion } from 'framer-motion'

const benefits = [
  {
    icon: 'local_shipping',
    title: 'Complimentary Shipping',
    description: 'Bespoke delivery service on all orders over $150, handled with utmost care.',
  },
  {
    icon: 'verified_user',
    title: 'Secure Atelier',
    description: 'Your privacy and security are paramount. Every transaction is encrypted.',
  },
  {
    icon: 'handyman',
    title: 'Artisan Crafted',
    description: 'Each piece is meticulously finished by hand in our specialized studio.',
  },
  {
    icon: 'workspace_premium',
    title: 'Luxe Guarantee',
    description: 'Uncompromising quality and a 30-day graceful return window.',
  },
]

export default function Benefits() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-32 bg-surface">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-primary">The Atelier Experience</span>
          <h2 className="text-5xl font-headline tracking-tighter text-on-surface mt-4">Elevated Service</h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-[28px] bg-primary-container/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary-container group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/5">
                <span className="material-symbols-outlined text-3xl font-light">{benefit.icon}</span>
              </div>
              <h3 className="text-2xl font-headline text-on-surface mb-4">
                {benefit.title}
              </h3>
              <p className="text-on-surface-variant font-body leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

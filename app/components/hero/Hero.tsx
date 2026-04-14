'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { label: 'Hair Studio', href: '/products?category=hair-studio' },
  { label: 'Jewelry Edit', href: '/products?category=jewelry-edit' },
  { label: 'Korean Picks', href: '/products?category=korean-picks' },
  { label: 'Gift Lounge', href: '/products?category=gift-lounge' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-surface overflow-hidden">
      {/* Atmospheric Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary-fixed/30 blur-[200px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-secondary-container/20 blur-[180px] translate-y-1/4 -translate-x-1/4" />
      </div>

      {/* Category Pills Row */}
      <div className="relative z-10 pt-32 pb-4 px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-3 flex-wrap">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={cat.href}
                className="px-6 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/20 text-[11px] font-body font-semibold uppercase tracking-widest text-on-surface hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
              >
                {cat.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-8 lg:px-16 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Editorial Text */}
          <div className="lg:col-span-5 flex flex-col justify-center py-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-8"
            >
              Digital Atelier Experience
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1] }}
              className="text-6xl md:text-7xl lg:text-8xl font-headline tracking-tighter text-on-surface leading-[0.85] mb-8"
            >
              Elegance at its{' '}
              <span className="text-primary italic font-light">perfection</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base text-on-surface-variant font-body leading-relaxed max-w-sm mb-12 opacity-70"
            >
              Thoughtfully selected pieces from global boutiques, focusing on Korean aesthetics and premium craftsmanship.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-6 items-center"
            >
              <Link
                href="/products"
                className="cta-glow px-10 py-4 rounded-full text-white font-body font-semibold tracking-wide text-sm"
              >
                Explore Collections
              </Link>
              <Link
                href="/collections"
                className="text-sm font-body font-semibold text-on-surface hover:text-primary transition-colors flex items-center gap-2 group uppercase tracking-wider"
              >
                View all departments
                <span className="material-symbols-outlined text-base font-light group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </motion.div>
          </div>

          {/* Right: Overlapping Imagery */}
          <div className="lg:col-span-7 relative h-[600px] lg:h-[750px]">
            {/* Main large image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
              className="absolute top-0 right-0 w-[75%] h-[85%] rounded-[40px] overflow-hidden shadow-luxe"
            >
              <Image
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=80"
                alt="Elegant Jewelry Editorial"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/10 to-transparent" />
            </motion.div>

            {/* Overlapping smaller image */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className="absolute bottom-8 left-0 w-[48%] h-[50%] rounded-[32px] overflow-hidden shadow-luxe border-[10px] border-surface z-10"
            >
              <Image
                src="/images/hero-hair-clips.jpg"
                alt="Hair accessories curation"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Floating category badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute top-12 left-8 z-20 bg-surface-container-lowest/90 backdrop-blur-xl rounded-[20px] px-6 py-4 shadow-luxe border border-outline-variant/10"
            >
              <p className="text-[9px] font-body font-bold uppercase tracking-[0.4em] text-primary mb-1">New Arrival</p>
              <p className="text-sm font-headline text-on-surface tracking-tight">Seoul Collection '25</p>
            </motion.div>

            {/* Floating blob decoration */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-8 right-16 w-56 h-56 rounded-full bg-secondary-container/30 blur-3xl z-0"
            />
          </div>
        </div>

        {/* Bottom category chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-20 flex items-center gap-6 flex-wrap"
        >
          <span className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-on-surface-variant/50">New In:</span>
          {[
            { label: 'Decor', href: '/products?category=decor' },
            { label: 'Jewelry', href: '/products?category=jewelry-edit' },
            { label: 'Beauty', href: '/products?category=beauty' },
            { label: 'Accessories', href: '/products?category=accessories' },
          ].map((tag) => (
            <Link
              key={tag.label}
              href={tag.href}
              className="text-[11px] font-body font-semibold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors border-b border-outline-variant/20 pb-0.5 hover:border-primary"
            >
              {tag.label}
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        <span className="text-[9px] font-body uppercase tracking-[0.5em] text-on-surface-variant/40">Scroll</span>
      </motion.div>
    </section>
  )
}
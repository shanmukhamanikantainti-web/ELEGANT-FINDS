'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ProductCard from './ProductCard'

// Curated featured products
const sampleProducts = [
  {
    id: 1,
    name: 'Organic Peach Vase',
    slug: 'organic-peach-vase',
    description: 'Handcrafted ceramic vase with an organic peach-finish glaze.',
    price: 65.00,
    compare_price: null,
    category: 'decor',
    images: ['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&auto=format&fit=crop&q=80'],
    variants: [{ size: 'Medium', color: 'Peach' }],
    in_stock: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Sculpted Wave Hoops',
    slug: 'sculpted-wave-hoops',
    description: 'Fluid, hand-sculpted 18k gold-plated wave earrings.',
    price: 78.00,
    compare_price: 98.00,
    category: 'jewelry-edit',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'],
    variants: [{ size: 'One Size', color: 'Gold' }],
    in_stock: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Dewy Rose Lip Treatment',
    slug: 'dewy-rose-lip-treatment',
    description: 'Korean beauty lip treatment infused with rose extract.',
    price: 38.00,
    compare_price: null,
    category: 'beauty',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80'],
    variants: [{ size: '15ml', color: 'Rose' }],
    in_stock: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Petal Veil Hair Clip',
    slug: 'petal-veil-hair-clip',
    description: 'Delicate organza petal hair clip with a pearl center.',
    price: 32.00,
    compare_price: null,
    category: 'hair-studio',
    images: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&auto=format&fit=crop&q=80'],
    variants: [{ size: 'One Size', color: 'Ivory' }],
    in_stock: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
]

const testimonials = [
  {
    quote: "The curation is unlike anything else. I found pieces for my vanity that feel like they belong in a boutique in Seoul. The packaging was a dream!",
    name: "Sofia M.",
    location: "London, UK",
    initials: "SM"
  },
  {
    quote: "Elegant Finds is my go-to for gifts. Everything is so thoughtfully selected, and the premium quality really shows when you hold the products.",
    name: "Eun-ji K.",
    location: "Seoul, KR",
    initials: "EK"
  },
  {
    quote: "Shipping was faster than expected and the customer service was delightful. A truly premium experience from browsing to unboxing.",
    name: "James L.",
    location: "Paris, FR",
    initials: "JL"
  },
]

export default function FeaturedProducts() {
  return (
    <>
      {/* ── Featured Products ── */}
      <section className="py-32 bg-surface">
        <div className="max-w-screen-2xl mx-auto px-8 lg:px-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-4"
              >
                The Curated Collection
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-4xl md:text-5xl font-headline tracking-tighter text-on-surface"
              >
                Artisanal Mastery Meets{' '}
                <span className="italic font-light text-primary">Modern Curation.</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                href="/products"
                className="text-sm font-body font-semibold uppercase tracking-widest text-on-surface hover:text-primary flex items-center gap-3 transition-colors group border-b border-on-surface/10 pb-1 hover:border-primary"
              >
                View All Pieces
                <span className="material-symbols-outlined font-light text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </motion.div>
          </div>

          {/* Staggered Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {sampleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.33, 1, 0.68, 1] }}
                className={index % 2 === 1 ? 'lg:mt-12' : ''}
              >
                <ProductCard product={product as any} />
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-28 flex items-center justify-center gap-8 opacity-20">
            <div className="h-px w-24 bg-on-surface" />
            <span className="material-symbols-outlined font-light text-2xl">diamond</span>
            <div className="h-px w-24 bg-on-surface" />
          </div>
        </div>
      </section>

      {/* ── Art of Gifting ── */}
      <section className="py-32 bg-surface-container-low overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-luxe">
                <Image
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&auto=format&fit=crop&q=80"
                  alt="The Art of Gifting"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/20 to-transparent" />
              </div>
              {/* Floating label */}
              <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-[24px] px-8 py-5 shadow-2xl shadow-primary/30">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] mb-1 opacity-80">Signature Service</p>
                <p className="text-lg font-headline tracking-tight">Gift Wrapping</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            >
              <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-6">Atelier Exclusive</p>
              <h2 className="text-4xl md:text-5xl font-headline tracking-tighter text-on-surface mb-8 leading-tight">
                The Art of <span className="italic font-light">Gifting</span>
              </h2>
              <p className="text-lg text-on-surface-variant font-body leading-relaxed mb-10 opacity-70">
                Elevate every celebration with our signature Digital Atelier gift wrapping. Hand-pressed seals, premium silk ribbons, and a personalized note on cream-laid paper.
              </p>
              <Link
                href="/products?gift=true"
                className="inline-flex items-center gap-3 cta-glow px-10 py-4 rounded-full text-white font-body font-semibold text-sm"
              >
                Shop Gifts
                <span className="material-symbols-outlined font-light text-sm">redeem</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-32 bg-surface overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-20">
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-4">Kind Words</p>
            <h2 className="text-4xl md:text-5xl font-headline tracking-tighter text-on-surface">
              From Our <span className="italic font-light">Atelier Circle</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="bg-surface-container-lowest rounded-[32px] p-10 shadow-luxe border border-outline-variant/10 flex flex-col gap-8"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-base text-on-surface-variant font-body leading-relaxed italic flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="text-sm font-headline font-bold text-on-secondary-container">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-headline font-bold text-on-surface">{t.name}</p>
                    <p className="text-xs font-body text-on-surface-variant/60 uppercase tracking-widest">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-4">The Inner Circle</p>
            <h2 className="text-4xl font-headline tracking-tighter text-on-surface mb-6">
              Early Access. <span className="italic font-light">Always.</span>
            </h2>
            <p className="text-base text-on-surface-variant font-body mb-10 opacity-70">
              Receive early access to seasonal edits, artisan spotlights, and members-only events.
            </p>
            <form className="flex gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-surface-container-lowest border border-outline-variant/20 rounded-full px-6 py-4 text-sm font-body text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/30"
              />
              <button
                type="submit"
                className="cta-glow px-8 py-4 rounded-full text-white font-body font-semibold text-sm whitespace-nowrap"
              >
                Join
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}

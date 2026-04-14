'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
  }

  return (
    <div className="min-h-screen bg-surface pt-40 pb-60 selection:bg-primary/20">
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-16">
        
        {/* Header Section: Editorial Manifest */}
        <header className="mb-40 text-center max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-[10px] font-headline font-bold uppercase tracking-[0.6em] mb-10 block"
          >
            Philosophy & Vision
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
            className="text-7xl md:text-[10rem] font-headline tracking-tighter text-on-surface mb-12 leading-[0.8]"
          >
            The Art of <br />
            <span className="italic font-light text-primary-fixed-dim">Elegance.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-2xl md:text-3xl text-on-surface-variant font-body leading-relaxed max-w-2xl mx-auto opacity-60 italic font-light"
          >
            "Crafting a digital sanctuary where timeless heritage meets modern, soulful sophistication."
          </motion.p>
        </header>

        {/* Narrative Section: Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-60">
          <motion.div {...fadeInUp} className="relative group p-4 bg-surface-container-lowest shadow-luxe rounded-[60px]">
            <div className="aspect-[4/5] bg-surface-container-low rounded-[48px] overflow-hidden relative z-10">
               <Image 
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&auto=format&fit=crop"
                  alt="Craftsmanship"
                  fill
                  className="object-cover transition-transform duration-[3s] group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-stone-900/10 z-10" />
               {/* Decorative Label */}
               <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] z-20">
                  <p className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-white opacity-80 mb-2">Established MMXXIV</p>
                  <p className="text-white font-headline text-2xl tracking-tighter">Artisanal Persistence</p>
               </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-headline tracking-tighter text-on-surface leading-tight">
                Precision & <br />
                <span className="italic font-light text-primary">Passion.</span>
              </h2>
              <div className="h-[1px] w-24 bg-primary/30" />
            </div>
            
            <div className="space-y-8 text-on-surface-variant font-body leading-relaxed text-xl opacity-70">
              <p>
                Elegant Finds 47 is more than a destination; it is a premium sanctuary for those who seek the extraordinary. We believe that true beauty lies in the synergy of meticulous craftsmanship and the soulful expression of individuality.
              </p>
              <p>
                Founded on the principles of integrity and artistic excellence, we curate a collection that spans from timeless classics to avant-garde masterpieces. Every piece in our showcase is selected with an editorial eye.
              </p>
              <div className="pt-6">
                <Link href="/contact" className="text-sm font-headline font-bold uppercase tracking-[0.4em] text-primary hover:tracking-[0.6em] transition-all flex items-center gap-4">
                  Initiate Dialogue <span className="material-symbols-outlined font-light">arrow_forward</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Grid: Atelier Pillars */}
        <section className="bg-surface-container-low/40 p-12 lg:p-32 rounded-[80px] border border-outline/5">
          <div className="text-center mb-28">
            <span className="text-primary text-[10px] font-headline font-bold uppercase tracking-[0.6em] mb-6 block">Our Ethos</span>
            <h2 className="text-5xl font-headline tracking-tighter text-on-surface mb-6">The Foundational Pillars</h2>
            <p className="text-on-surface-variant font-body text-lg opacity-60 max-w-xl mx-auto leading-relaxed">Defining the Digital Atelier experience through heritage, quality, and soul.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: 'diamond', title: 'Purity', desc: 'Sourcing only the finest natural materials for enduring brilliance and soul.' },
              { icon: 'auto_fix', title: 'Artistry', desc: 'Merging traditional techniques with contemporary digital precision.' },
              { icon: 'verified', title: 'Heritage', desc: 'Honoring the legacy of craftsmanship passed through generations.' }
            ].map((value, i) => (
              <motion.div 
                key={value.title}
                {...fadeInUp}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-surface-container-lowest p-12 rounded-[52px] text-center group hover:-translate-y-4 transition-all duration-700 shadow-luxe border border-outline/5"
              >
                <div className="w-20 h-20 bg-primary/5 rounded-[24px] flex items-center justify-center mx-auto mb-10 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-4xl text-primary font-light">{value.icon}</span>
                </div>
                <h3 className="text-3xl font-headline mb-6 tracking-tighter text-on-surface">{value.title}</h3>
                <p className="text-base text-on-surface-variant font-body leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA: The Narrative Continues */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-60 text-center"
        >
          <div className="inline-flex flex-col items-center gap-8 border-t border-outline/10 pt-32 w-full">
            <h2 className="text-6xl md:text-[5rem] font-headline tracking-tighter text-on-surface mb-4">Continue the <span className="italic font-light">Narrative.</span></h2>
            <div className="flex flex-col sm:flex-row gap-8 items-center mt-10">
              <Link href="/products" className="cta-glow px-16 py-6 rounded-full text-white font-headline font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all hover:scale-105">
                Explore The Edit
              </Link>
              <Link href="/contact" className="px-16 py-6 border border-outline/10 rounded-full text-on-surface font-headline font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-surface-container-low transition-all">
                The Concierge
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

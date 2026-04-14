'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image_url: string
}

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (data.categories) {
          setCategories(data.categories)
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  }

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 selection:text-primary pt-20">
      
      {/* Hero Section: Editorial Header */}
      <section className="relative pt-40 pb-28 px-8 text-center overflow-hidden">
        {/* Atmospheric Blur */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-container/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-[10px] font-headline font-bold uppercase tracking-[0.5em] mb-8 block"
          >
            Archives & Curations
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.33, 1, 0.68, 1] }}
            className="text-7xl md:text-[9rem] font-headline tracking-tighter text-on-surface mb-10 leading-[0.85]"
          >
            The <span className="italic font-light text-primary-fixed-dim">Galleries.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-on-surface-variant font-body text-xl max-w-2xl mx-auto leading-relaxed opacity-80"
          >
            Explore our meticulously organized archives of fine craftsmanship, categorized by silhouette, material, and sentiment.
          </motion.p>
        </div>
      </section>

      {/* Grid Section: Staggered Gallery */}
      <section className="max-w-screen-2xl mx-auto px-8 lg:px-12 py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-surface-container-low animate-pulse rounded-[40px]" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
          >
            {categories.map((category, index) => (
              <motion.div 
                key={category.id} 
                variants={item} 
                className={`group cursor-pointer ${index % 2 === 1 ? 'md:translate-y-20' : ''}`}
              >
                <Link href={`/products?category=${category.slug}`}>
                  <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden mb-10 shadow-luxe bg-surface-container-lowest p-3 transition-all duration-700 group-hover:-translate-y-2">
                    <div className="relative w-full h-full rounded-[40px] overflow-hidden">
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-stone-900/10 z-10 transition-opacity group-hover:opacity-0" />
                      
                      {/* Interaction Indicator */}
                      <div className="absolute top-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                        <span className="material-symbols-outlined text-white text-2xl font-light">arrow_outward</span>
                      </div>

                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={category.name} 
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-surface-container-low">
                           <span className="material-symbols-outlined text-6xl mb-6 text-primary/20 font-light">diamond</span>
                           <span className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-primary/40 leading-relaxed">Archive<br/>{category.name}</span>
                        </div>
                      )}

                      {/* Glass Bottom Label */}
                      <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                         <p className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-white">
                            View Collection
                         </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6">
                    <h2 className="text-4xl font-headline tracking-tighter text-on-surface mb-4 group-hover:text-primary transition-colors duration-500">
                      {category.name}
                    </h2>
                    <p className="text-on-surface-variant font-body text-sm leading-relaxed opacity-70 line-clamp-2 max-w-sm">
                       {category.description || 'A timeless collection of bespoke pieces designed for the discerning individual.'}
                    </p>
                    <div className="mt-8 flex items-center gap-4 group">
                       <div className="h-[1px] w-12 bg-primary/20 group-hover:w-20 group-hover:bg-primary transition-all duration-700" />
                       <span className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-primary group-hover:tracking-[0.6em] transition-all duration-700">Explore</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Concierge Decoration */}
      <section className="py-60 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.02] select-none pointer-events-none flex items-center justify-center">
            <h2 className="text-[25vw] font-headline text-on-surface whitespace-nowrap leading-none tracking-tighter">ATELIER • ATELIER</h2>
         </div>
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <p className="font-body italic text-xl text-on-surface-variant mb-6 opacity-60">Seek something bespoke?</p>
            <Link href="/contact" className="cta-glow inline-block px-12 py-5 rounded-full text-white text-[10px] font-headline font-bold uppercase tracking-[0.5em] transition-all hover:scale-105">
               Consult our Concierge
            </Link>
         </motion.div>
      </section>
    </div>
  )
}

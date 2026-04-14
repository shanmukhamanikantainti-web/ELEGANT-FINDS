'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitted(true)
    setIsSubmitting(false)
    setEmail('')
  }

  return (
    <section className="py-24 bg-primary-container relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="max-w-screen-xl mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:max-w-xl text-center lg:text-left">
            <span className="text-white/60 text-sm font-bold uppercase tracking-[0.3em] mb-4 block">The Inner Circle</span>
            <h2 className="text-5xl font-headline tracking-tighter text-white mb-6">Join the Atelier</h2>
            <p className="text-xl text-white/80 font-body leading-relaxed">
              Subscribe to receive exclusive invitations, artisan stories, and early access to our seasonal curations.
            </p>
          </div>

          <div className="w-full max-w-lg">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-[18px] pl-16 pr-8 py-5 text-white placeholder-white/30 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-primary rounded-[18px] py-5 font-bold uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Accessing...' : 'Join Now'}
                </button>
                <p className="text-white/40 text-[10px] text-center uppercase tracking-widest mt-2">
                  Respectful communication. Privacy guaranteed.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] p-8 text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">check</span>
                </div>
                <h3 className="text-2xl font-headline text-white mb-2">Welcome to the inner circle</h3>
                <p className="text-white/60 font-body">Verification sent to your inbox.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

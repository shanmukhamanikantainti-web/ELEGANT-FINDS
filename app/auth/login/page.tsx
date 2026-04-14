'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/lib/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error } = await login(email, password)

    if (error) {
      setError(error.message)
    } else {
      setIsSuccess(true)
      setTimeout(() => {
        router.push('/checkout')
      }, 1000)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=1600&auto=format&fit=crop&q=85"
          alt="Digital Atelier"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-on-surface/60 to-primary/20" />

        {/* Content on image */}
        <div className="absolute inset-0 flex flex-col justify-between p-16 z-10">
          <Link href="/" className="flex items-center gap-3 text-white group">
            <span className="material-symbols-outlined font-light group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-body font-semibold uppercase tracking-widest">Back to Boutique</span>
          </Link>

          <div>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary-fixed-dim mb-6">The Digital Atelier</p>
            <h2 className="text-5xl font-headline text-white tracking-tighter leading-tight mb-6">
              Curating your<br />
              <span className="italic font-light text-primary-fixed-dim">Digital Atelier</span>
            </h2>
            <p className="text-base font-body text-white/60 max-w-sm leading-relaxed">
              Experience the intersection of Seoul's minimalist charm and European luxury craftsmanship.
            </p>
          </div>

          <p className="text-xs font-body text-white/30 uppercase tracking-widest">© {new Date().getFullYear()} Elegant Finds. Designed for the Digital Atelier.</p>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface relative overflow-hidden">
        {/* Atmospheric blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/30 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile back link */}
          <Link href="/" className="lg:hidden flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-12 group">
            <span className="material-symbols-outlined font-light group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-body">Back to Boutique</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-3">Archive Access</p>
            <h1 className="text-4xl md:text-5xl font-headline tracking-tighter text-on-surface mb-3">
              Welcome Back
            </h1>
            <p className="text-sm font-body text-on-surface-variant/60 mb-12 leading-relaxed">
              Please enter your details to access your curated edits.
            </p>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-primary rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20">
                    <span className="material-symbols-outlined text-white text-4xl">lock_open</span>
                  </div>
                  <h2 className="text-2xl font-headline text-on-surface mb-3">Access Granted</h2>
                  <p className="text-sm font-body text-on-surface-variant/60 leading-relaxed">
                    Preparing your curated experience...
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {error && (
                    <div className="bg-error/5 border border-error/20 text-error px-5 py-4 rounded-[16px] text-xs font-body flex items-center gap-3">
                      <span className="material-symbols-outlined text-base">error</span>
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Email Input */}
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined font-light text-on-surface-variant/40 text-lg">mail</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                        className="w-full bg-surface-container-low border border-transparent focus:border-primary rounded-[16px] py-4 pl-14 pr-5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all focus:bg-surface-container-lowest"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined font-light text-on-surface-variant/40 text-lg">lock</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full bg-surface-container-low border border-transparent focus:border-primary rounded-[16px] py-4 pl-14 pr-5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all focus:bg-surface-container-lowest"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-headline font-bold uppercase tracking-[0.4em] text-[10px] py-5 rounded-[16px] transition-all disabled:opacity-50 shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group mt-4"
                    >
                      {isSubmitting ? (
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Enter Atelier</span>
                          <span className="material-symbols-outlined text-sm font-light group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-xs font-body text-on-surface-variant/50 pt-2">
                    New to Elegant Finds?{' '}
                    <Link href="/auth/signup" className="text-primary font-semibold hover:opacity-70 transition-opacity">
                      Create Account
                    </Link>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/lib/hooks/useAuth'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error } = await signup(email, password, fullName)

    if (error) {
      setError(error.message)
    } else {
      setIsSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&auto=format&fit=crop&q=85"
          alt="Join the Atelier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-on-surface/50 to-primary/30" />

        <div className="absolute inset-0 flex flex-col justify-between p-16 z-10">
          <Link href="/" className="flex items-center gap-3 text-white group">
            <span className="material-symbols-outlined font-light group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-body font-semibold uppercase tracking-widest">Back to Boutique</span>
          </Link>

          <div>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary-fixed-dim mb-6">New Membership</p>
            <h2 className="text-5xl font-headline text-white tracking-tighter leading-tight mb-6">
              Join the<br />
              <span className="italic font-light text-primary-fixed-dim">Atelier Circle</span>
            </h2>
            <p className="text-base font-body text-white/60 max-w-sm leading-relaxed">
              Early access to seasonal edits, artisan spotlights, and exclusive members-only events.
            </p>
          </div>

          <p className="text-xs font-body text-white/30 uppercase tracking-widest">© {new Date().getFullYear()} Elegant Finds. Designed for the Digital Atelier.</p>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/30 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          <Link href="/" className="lg:hidden flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-12 group">
            <span className="material-symbols-outlined font-light group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-body">Back to Boutique</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-3">New Membership</p>
            <h1 className="text-4xl md:text-5xl font-headline tracking-tighter text-on-surface mb-3">
              Create Account
            </h1>
            <p className="text-sm font-body text-on-surface-variant/60 mb-8 leading-relaxed">
              Begin your journey into a world of curated elegance and refined tastes.
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
                    <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
                  </div>
                  <h2 className="text-2xl font-headline text-on-surface mb-3">Account Created</h2>
                  <p className="text-sm font-body text-on-surface-variant/60 leading-relaxed">
                    Welcome to the Atelier.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {error && (
                    <div className="bg-error/5 border border-error/20 text-error px-5 py-4 rounded-[16px] text-xs font-body flex items-center gap-3">
                      <span className="material-symbols-outlined text-base">error</span>
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label htmlFor="signup-name" className="block text-[10px] font-body font-bold uppercase tracking-[0.35em] text-on-surface-variant/60 ml-2">
                       Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined font-light text-on-surface-variant/40 text-lg">person</span>
                      <input
                        id="signup-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-surface-container-low border border-transparent focus:border-primary rounded-[16px] py-4 pl-14 pr-5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all focus:bg-surface-container-lowest"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="signup-email" className="block text-[10px] font-body font-bold uppercase tracking-[0.35em] text-on-surface-variant/60 ml-2">
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined font-light text-on-surface-variant/40 text-lg">mail</span>
                      <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="hello@example.com"
                        className="w-full bg-surface-container-low border border-transparent focus:border-primary rounded-[16px] py-4 pl-14 pr-5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all focus:bg-surface-container-lowest"
                      />
                    </div>
                  </div>

                   {/* Password */}
                   <div className="space-y-1">
                    <label htmlFor="signup-password" className="block text-[10px] font-body font-bold uppercase tracking-[0.35em] text-on-surface-variant/60 ml-2">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined font-light text-on-surface-variant/40 text-lg">lock</span>
                      <input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Secure password"
                        className="w-full bg-surface-container-low border border-transparent focus:border-primary rounded-[16px] py-4 pl-14 pr-5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/30 outline-none transition-all focus:bg-surface-container-lowest"
                      />
                    </div>
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
                        Join the Atelier
                        <span className="material-symbols-outlined font-light text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs font-body text-on-surface-variant/50 pt-2">
                    Already a member?{' '}
                    <Link href="/auth/login" className="text-primary font-semibold hover:opacity-70 transition-opacity">
                      Sign In
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

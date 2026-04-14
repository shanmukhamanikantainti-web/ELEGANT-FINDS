'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/lib/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { X, Lock, Key, AlertCircle } from 'lucide-react'

export default function AdminGate() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'code' | 'login'>('code')
  const [passcode, setPasscode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  // Target Admin requirements
  const REQUIRED_CODE = 'ELEGANT FINDS 47'
  const ADMIN_EMAIL = 'mounikainti15@gmail.com'

  // Listen for Ctrl+B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        // Reset state and open
        setPasscode('')
        setPassword('')
        setError('')
        setStep('code')
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const authorizeAndRedirect = () => {
    sessionStorage.setItem('admin_unlocked', 'true')
    setIsOpen(false)
    router.push('/admin')
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (passcode !== REQUIRED_CODE) {
      setError('Invalid authorization code.')
      return
    }

    // Passcode is correct, check auth status
    if (user && user.email === ADMIN_EMAIL) {
      // Already logged in as the correct admin
      authorizeAndRedirect()
    } else {
      // Need to login or wrong user logged in
      setStep('login')
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Start login flow with hardcoded email
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: password,
      })

      if (signInError) {
        throw signInError
      }

      if (data.user?.email === ADMIN_EMAIL) {
        authorizeAndRedirect()
      } else {
        setError('Unauthorized account.')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-surface border border-gold-900/20 rounded-2xl p-6 shadow-2xl overflow-hidden"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-800 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-8 text-center">
              <div className="mx-auto w-12 h-12 bg-burgundy-900/10 rounded-full flex items-center justify-center mb-4">
                {step === 'code' ? (
                  <Key className="text-burgundy-700" size={24} />
                ) : (
                  <Lock className="text-burgundy-700" size={24} />
                )}
              </div>
              <h2 className="font-playfair text-2xl font-bold text-charcoal-900">
                {step === 'code' ? 'Restricted Area' : 'Admin Login'}
              </h2>
              <p className="text-sm text-charcoal-500 mt-2">
                {step === 'code' 
                  ? 'Please enter the authorization code.' 
                  : `Please authenticate as ${ADMIN_EMAIL}`}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {step === 'code' ? (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-surface border border-gold-900/20 rounded-xl px-4 py-3 text-center tracking-widest text-charcoal-900 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                    placeholder="Enter Code"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-charcoal-900 hover:bg-charcoal-800 text-white font-cormorant font-bold uppercase tracking-wider py-3 rounded-xl transition-all duration-300"
                >
                  Verify Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={ADMIN_EMAIL}
                    disabled
                    className="w-full bg-charcoal-50 border border-gold-900/20 rounded-xl px-4 py-3 text-charcoal-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface border border-gold-900/20 rounded-xl px-4 py-3 text-charcoal-900 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                    placeholder="Password"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-burgundy-700 hover:bg-burgundy-800 text-white font-cormorant font-bold uppercase tracking-wider py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Enter Workspace'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('code')}
                  className="w-full py-2 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors"
                >
                  &larr; Back to code entry
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

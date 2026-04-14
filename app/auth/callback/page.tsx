'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (error) {
        console.error('Auth error:', error, errorDescription)
        setStatus('error')
        return
      }

      if (code) {
        // Exchange the code for a session directly on the client
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            throw exchangeError
          }

          setStatus('success')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } catch (err) {
          console.error('Callback error:', err)
          setStatus('error')
        }
      } else {
        setStatus('error')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-padding bg-sand-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-3xl font-playfair text-charcoal-800 mb-4">
              Verifying...
            </h1>
            <p className="font-cormorant text-charcoal-600">
              Please wait while we confirm your email.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-playfair text-charcoal-800 mb-4">
              Welcome aboard!
            </h1>
            <p className="font-cormorant text-charcoal-600">
              Your account has been verified. Redirecting you to home...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠</span>
            </div>
            <h1 className="text-3xl font-playfair text-charcoal-800 mb-4">
              Something went wrong
            </h1>
            <p className="font-cormorant text-charcoal-600 mb-6">
              We couldn&apos;t verify your email. The link may have expired.
            </p>
            <a href="/auth/login" className="btn-primary inline-block">
              Try signing in again
            </a>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center section-padding bg-sand-50">
        <div className="w-20 h-20 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '@/app/lib/hooks/useAuth'
import Button from '@/app/components/ui/Button'

export default function AccountSettingsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect_to=/account/settings')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return
      try {
        const res = await fetch('/api/users/profile')
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile)
          setFormData({
            full_name: data.profile?.full_name || '',
            phone: data.profile?.phone || '',
          })
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="section-padding bg-sand-50 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Link */}
          <Link
            href="/account"
            className="inline-flex items-center text-burgundy-700 hover:text-burgundy-800 transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Account
          </Link>

          {/* Form */}
          <div className="bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-playfair text-charcoal-800 mb-2">
              Account Settings
            </h1>
            <p className="font-cormorant text-charcoal-600 mb-8">
              Update your personal information
            </p>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700">
                Profile updated successfully!
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="input-luxury bg-sand-50 cursor-not-allowed"
                />
                <p className="text-xs text-charcoal-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="input-luxury"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-luxury"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" isLoading={isSubmitting}>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
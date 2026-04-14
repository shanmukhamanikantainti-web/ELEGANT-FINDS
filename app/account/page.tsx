'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { User, Package, Heart, Settings, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '@/app/lib/hooks/useAuth'
import Button from '@/app/components/ui/Button'

export default function AccountPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect_to=/account')
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
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading || !user) {
    return (
      <div className="section-padding bg-sand-50 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-burgundy-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const menuItems = [
    {
      title: 'My Orders',
      description: 'Track and manage your orders',
      icon: Package,
      href: '/account/orders',
      color: 'bg-burgundy-50 text-burgundy-700',
    },
    {
      title: 'My Wishlist',
      description: 'View your saved items',
      icon: Heart,
      href: '/wishlist',
      color: 'bg-rose-50 text-rose-700',
    },
    {
      title: 'Account Settings',
      description: 'Update your profile information',
      icon: Settings,
      href: '/account/settings',
      color: 'bg-sand-100 text-charcoal-700',
    },
  ]

  return (
    <div className="section-padding bg-sand-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="bg-white p-8 mb-8 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-burgundy-100 rounded-full flex items-center justify-center">
                <User size={40} className="text-burgundy-700" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-playfair text-charcoal-800">
                  {profile?.full_name || user.email?.split('@')[0]}
                </h1>
                <p className="font-cormorant text-charcoal-600">{user.email}</p>
                {profile?.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-burgundy-100 text-burgundy-700 text-xs uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="block bg-white p-6 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center`}>
                      <item.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-playfair text-xl text-charcoal-800 group-hover:text-burgundy-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-cormorant text-sm text-charcoal-600">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-charcoal-400 group-hover:text-burgundy-700 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="bg-white p-6 shadow-sm">
            <h2 className="font-playfair text-xl text-charcoal-800 mb-4">Quick Links</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="text-burgundy-700 hover:underline font-cormorant">
                Browse Products
              </Link>
              <span className="text-charcoal-300">|</span>
              <Link href="/shipping" className="text-burgundy-700 hover:underline font-cormorant">
                Shipping Info
              </Link>
              <span className="text-charcoal-300">|</span>
              <Link href="/returns" className="text-burgundy-700 hover:underline font-cormorant">
                Returns
              </Link>
              <span className="text-charcoal-300">|</span>
              <Link href="/contact" className="text-burgundy-700 hover:underline font-cormorant">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-8 text-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-cormorant"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
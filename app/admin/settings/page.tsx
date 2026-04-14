'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Share2, 
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface SiteConfig {
  name: string
  email: string
  phone: string
  address: string
  currency: string
  free_shipping_threshold: number
}

interface SocialLinks {
  instagram: string
  facebook: string
  pinterest: string
}

export default function AdminSettingsPage() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    name: 'Elegant Finds',
    email: 'mounikainti15@gmail.com',
    phone: '',
    address: '',
    currency: 'INR',
    free_shipping_threshold: 0
  })

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagram: '',
    facebook: '',
    pinterest: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.settings.site_config) setSiteConfig(data.settings.site_config)
          if (data.settings.social_links) setSocialLinks(data.settings.social_links)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async (key: 'site_config' | 'social_links', value: any) => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      })

      if (res.ok) {
        setMessage({ type: 'success', text: `${key === 'site_config' ? 'General' : 'Social'} settings saved successfully!` })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-1">
            Store Settings
          </h1>
          <p className="text-charcoal-400 font-cormorant">
            Configure your shop identification and preferences
          </p>
        </div>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{message.text}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-charcoal-800/50 border border-gold-900/20 rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-gold-900/10">
            <Globe className="text-gold-500" size={20} />
            <h2 className="text-xl font-playfair text-white font-bold text-white">General Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Store Name</label>
              <input
                type="text"
                value={siteConfig.name}
                onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                className="w-full bg-charcoal-900/50 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Support Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" size={16} />
                  <input
                    type="email"
                    value={siteConfig.email}
                    onChange={(e) => setSiteConfig({ ...siteConfig, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-charcoal-900/50 border border-gold-900/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" size={16} />
                  <input
                    type="text"
                    value={siteConfig.phone}
                    onChange={(e) => setSiteConfig({ ...siteConfig, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-charcoal-900/50 border border-gold-900/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-charcoal-500" size={16} />
                <textarea
                  rows={3}
                  value={siteConfig.address}
                  onChange={(e) => setSiteConfig({ ...siteConfig, address: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-charcoal-900/50 border border-gold-900/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Currency (ISO)</label>
                <input
                  type="text"
                  value={siteConfig.currency}
                  onChange={(e) => setSiteConfig({ ...siteConfig, currency: e.target.value.toUpperCase() })}
                  className="w-full bg-charcoal-900/50 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                  maxLength={3}
                />
              </div>
              <div>
                <label className="block text-sm font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Free Shipping Min.</label>
                <div className="relative">
                  <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" size={16} />
                  <input
                    type="number"
                    value={siteConfig.free_shipping_threshold}
                    onChange={(e) => setSiteConfig({ ...siteConfig, free_shipping_threshold: Number(e.target.value) })}
                    className="w-full pl-11 pr-4 py-3 bg-charcoal-900/50 border border-gold-900/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSave('site_config', siteConfig)}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-burgundy-700 hover:bg-burgundy-600 text-white rounded-xl font-cormorant uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save General Settings'}
          </button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-charcoal-800/50 border border-gold-900/20 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gold-900/10">
              <Share2 className="text-gold-500" size={20} />
              <h2 className="text-xl font-playfair text-white text-white font-bold">Social Media</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Instagram URL</label>
                <input
                  type="text"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full bg-charcoal-900/50 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Facebook URL</label>
                <input
                  type="text"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full bg-charcoal-900/50 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Pinterest URL</label>
                <input
                  type="text"
                  value={socialLinks.pinterest}
                  onChange={(e) => setSocialLinks({ ...socialLinks, pinterest: e.target.value })}
                  placeholder="https://pinterest.com/yourprofile"
                  className="w-full bg-charcoal-900/50 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => handleSave('social_links', socialLinks)}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-charcoal-700 hover:bg-charcoal-600 text-white rounded-xl font-cormorant uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Social Links'}
            </button>
          </div>

          <div className="bg-gold-500/10 border border-gold-500/20 rounded-2xl p-6">
            <h3 className="text-gold-500 font-playfair font-bold mb-2">System Info</h3>
            <p className="text-charcoal-400 text-sm font-cormorant leading-relaxed">
              These settings control how your brand is represented across the site. Changes here will impact the Footer, Header, and Checkout contact flows immediately.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Tag, 
  Search, 
  Plus, 
  Calendar, 
  Percent, 
  CircleDollarSign,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  TrendingDown,
  X,
  AlertCircle
} from 'lucide-react'

interface Coupon {
  id: number
  code: string
  discount_type: 'percentage' | 'fixed'
  value: number
  min_purchase: number
  usage_limit: number | null
  usage_count: number
  expires_at: string | null
  active: boolean
  created_at: string
}

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Form State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage',
    value: 0,
    min_purchase: 0,
    usage_limit: '',
    expires_at: '',
    active: true
  })

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch('/api/admin/discounts')
        if (res.ok) {
          const data = await res.json()
          setCoupons(data.coupons || [])
        } else {
          setError('Failed to fetch coupons')
        }
      } catch (err) {
        setError('Failed to load coupons')
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [])

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCoupon,
          value: Number(newCoupon.value),
          min_purchase: Number(newCoupon.min_purchase),
          usage_limit: newCoupon.usage_limit ? Number(newCoupon.usage_limit) : null,
          expires_at: newCoupon.expires_at || null
        })
      })

      if (res.ok) {
        const data = await res.json()
        setCoupons([data.coupon, ...coupons])
        setShowAddModal(false)
        setNewCoupon({
          code: '',
          discount_type: 'percentage',
          value: 0,
          min_purchase: 0,
          usage_limit: '',
          expires_at: '',
          active: true
        })
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create coupon')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating coupon')
    }
  }

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-1">
            Discount Management
          </h1>
          <p className="text-charcoal-400 font-cormorant">
            Create and track promotional coupon codes
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-900 rounded-xl font-medium transition-all shadow-lg shadow-gold-500/10"
        >
          <Plus size={20} />
          Create Coupon
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
        <input
          type="text"
          placeholder="Search codes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-charcoal-800/50 border border-gold-900/30 rounded-xl text-white placeholder:text-charcoal-500 focus:outline-none focus:border-gold-500/50 transition-all"
        />
      </motion.div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCoupons.map((coupon, index) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-charcoal-800/50 border rounded-2xl p-6 relative overflow-hidden group hover:border-gold-500/30 transition-all ${
                !coupon.active ? 'opacity-60 border-charcoal-700' : 'border-gold-900/20'
              }`}
            >
              {/* Type Badge */}
              <div className="absolute top-0 right-0 p-4">
                {coupon.discount_type === 'percentage' ? (
                  <Percent size={18} className="text-gold-500/50" />
                ) : (
                  <CircleDollarSign size={18} className="text-gold-500/50" />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-burgundy-900/30 text-gold-500 border border-gold-500/20 rounded-md font-mono text-lg font-bold tracking-wider">
                    {coupon.code}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${coupon.active ? 'bg-green-500 animate-pulse' : 'bg-charcoal-600'}`} />
                </div>

                <div>
                  <h3 className="text-2xl font-playfair font-bold text-white">
                    {coupon.discount_type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </h3>
                  <p className="text-charcoal-400 text-sm font-cormorant">
                    Min. Purchase: ₹{coupon.min_purchase}
                  </p>
                </div>

                <div className="pt-4 border-t border-gold-900/10 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-cormorant uppercase tracking-widest text-charcoal-500 mb-1">Used</p>
                    <p className="text-white font-medium">
                      {coupon.usage_count} / {coupon.usage_limit || '∞'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-cormorant uppercase tracking-widest text-charcoal-500 mb-1">Expires</p>
                    <p className="text-white font-medium text-sm">
                      {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-charcoal-900 border border-gold-500/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gold-900/10 flex items-center justify-between">
                <h2 className="text-2xl font-playfair font-bold text-white">Create New Coupon</h2>
                <button onClick={() => setShowAddModal(false)} className="text-charcoal-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddCoupon} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Coupon Code</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. SUMMER2024"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      className="w-full bg-charcoal-800 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all font-mono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Type</label>
                    <select
                      value={newCoupon.discount_type}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value as any })}
                      className="w-full bg-charcoal-800 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all appearance-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Discount Value</label>
                    <input
                      required
                      type="number"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                      className="w-full bg-charcoal-800 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Min. Purchase</label>
                    <input
                      type="number"
                      value={newCoupon.min_purchase}
                      onChange={(e) => setNewCoupon({ ...newCoupon, min_purchase: Number(e.target.value) })}
                      className="w-full bg-charcoal-800 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Usage Limit</label>
                    <input
                      type="number"
                      placeholder="∞"
                      value={newCoupon.usage_limit}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: e.target.value })}
                      className="w-full bg-charcoal-800 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-cormorant text-charcoal-400 uppercase tracking-widest mb-1.5 ml-1">Expiry Date</label>
                    <input
                      type="date"
                      value={newCoupon.expires_at}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
                      className="w-full bg-charcoal-800 border border-gold-900/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 text-charcoal-400 hover:text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-900 rounded-xl font-bold transition-all shadow-lg shadow-gold-500/20"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

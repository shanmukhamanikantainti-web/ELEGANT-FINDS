'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  User as UserIcon,
  MoreVertical,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin'
  phone: string | null
  created_at: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/admin/customers')
        if (res.ok) {
          const data = await res.json()
          setCustomers(data.users || [])
        } else {
          setError('Failed to fetch customers')
        }
      } catch (err) {
        setError('Failed to load customers')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
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
            Customers
          </h1>
          <p className="text-charcoal-400 font-cormorant">
            {customers.length} registered accounts
          </p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-charcoal-800/50 border border-gold-900/30 rounded-xl text-white placeholder:text-charcoal-500 focus:outline-none focus:border-gold-500/50 transition-all"
          />
        </div>
      </motion.div>

      {/* Customers List/Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-charcoal-800/50 border border-gold-900/20 rounded-2xl overflow-hidden"
      >
        {error ? (
          <div className="p-8 text-center text-red-400">
            {error}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="text-charcoal-600 mx-auto mb-4" />
            <h3 className="text-white font-playfair text-xl mb-2">No customers found</h3>
            <p className="text-charcoal-400 font-cormorant">
              {searchQuery ? 'Try adjusting your search query' : 'Customers will appear here as they register'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-900/20">
                  <th className="px-6 py-4 text-left text-xs font-cormorant uppercase tracking-wider text-charcoal-400">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-cormorant uppercase tracking-wider text-charcoal-400">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-cormorant uppercase tracking-wider text-charcoal-400">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-cormorant uppercase tracking-wider text-charcoal-400">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-cormorant uppercase tracking-wider text-charcoal-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-900/10">
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-charcoal-700/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-burgundy-900/30 rounded-full flex items-center justify-center text-gold-500 font-bold border border-gold-900/20">
                          {customer.full_name?.charAt(0) || <UserIcon size={16} />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{customer.full_name || 'Anonymous'}</p>
                          <p className="text-charcoal-500 text-xs">ID: {customer.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-charcoal-300">
                          <Mail size={14} className="text-charcoal-500" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-charcoal-300">
                            <Phone size={14} className="text-charcoal-500" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        customer.role === 'admin' 
                          ? 'bg-gold-500/20 text-gold-500' 
                          : 'bg-charcoal-700/50 text-charcoal-400'
                      }`}>
                        {customer.role === 'admin' && <Shield size={12} />}
                        {customer.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-charcoal-500 hover:text-white hover:bg-charcoal-700 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

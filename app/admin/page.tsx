'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  Tags,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: React.ElementType
  color: string
  delay: number
}

function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-charcoal-800/50 border border-gold-900/20 rounded-2xl p-6 hover:border-gold-700/40 transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon size={22} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            changeType === 'up' ? 'text-green-400' :
            changeType === 'down' ? 'text-red-400' :
            'text-charcoal-400'
          }`}>
            {changeType === 'up' && <ArrowUpRight size={14} />}
            {changeType === 'down' && <ArrowDownRight size={14} />}
            {change}
          </div>
        )}
      </div>
      <h3 className="text-3xl font-playfair font-bold text-white mb-1">{value}</h3>
      <p className="text-charcoal-400 text-sm font-cormorant uppercase tracking-wider">{title}</p>
    </motion.div>
  )
}

interface QuickLinkProps {
  title: string
  description: string
  href: string
  icon: React.ElementType
  delay: number
}

function QuickLink({ title, description, href, icon: Icon, delay }: QuickLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link
        href={href}
        className="block bg-charcoal-800/50 border border-gold-900/20 rounded-2xl p-6 hover:border-gold-700/40 hover:bg-charcoal-800/80 transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-burgundy-700/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon size={20} className="text-gold-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-playfair text-lg mb-1 group-hover:text-gold-500 transition-colors">
              {title}
            </h3>
            <p className="text-charcoal-400 text-sm font-cormorant leading-relaxed">
              {description}
            </p>
          </div>
          <ArrowUpRight size={20} className="text-charcoal-600 group-hover:text-gold-500 transition-colors mt-1" />
        </div>
      </Link>
    </motion.div>
  )
}

interface RecentOrderProps {
  id: string
  customer: string
  amount: string
  status: string
  date: string
  delay: number
}

function RecentOrder({ id, customer, amount, status, date, delay }: RecentOrderProps) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center justify-between py-4 border-b border-gold-900/10 last:border-0"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-charcoal-700 rounded-full flex items-center justify-center text-charcoal-300 font-medium text-sm">
          {customer.charAt(0)}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{customer}</p>
          <p className="text-charcoal-500 text-xs">#{id}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white text-sm font-medium">{amount}</p>
        <p className="text-charcoal-500 text-xs">{date}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.pending}`}>
        {status}
      </span>
    </motion.div>
  )
}

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    {
      title: 'Total Revenue',
      value: '$0',
      change: 'No sales yet',
      changeType: 'neutral' as const,
      icon: DollarSign,
      color: 'bg-gradient-to-br from-green-600 to-green-700',
      delay: 0.1,
    },
    {
      title: 'Orders',
      value: '0',
      change: '0 this week',
      changeType: 'neutral' as const,
      icon: ShoppingBag,
      color: 'bg-gradient-to-br from-blue-600 to-blue-700',
      delay: 0.15,
    },
    {
      title: 'Products',
      value: '10',
      change: '6 categories',
      changeType: 'neutral' as const,
      icon: Package,
      color: 'bg-gradient-to-br from-purple-600 to-purple-700',
      delay: 0.2,
    },
    {
      title: 'Customers',
      value: '0',
      change: 'No customers yet',
      changeType: 'neutral' as const,
      icon: Users,
      color: 'bg-gradient-to-br from-burgundy-600 to-burgundy-700',
      delay: 0.25,
    },
  ]

  const quickLinks = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing with images, variants, and pricing',
      href: '/admin/products/new',
      icon: Package,
      delay: 0.3,
    },
    {
      title: 'Manage Customers',
      description: 'View and manage registered user accounts and their order history',
      href: '/admin/customers',
      icon: Users,
      delay: 0.35,
    },
    {
      title: 'Discount Codes',
      description: 'Create and manage promotional coupon codes for your customers',
      href: '/admin/discounts',
      icon: Tags,
      delay: 0.4,
    },
    {
      title: 'Store Settings',
      description: 'Configure store identification, social links, and shipping preferences',
      href: '/admin/settings',
      icon: Settings,
      delay: 0.45,
    },
  ]

  const recentOrders = [
    { id: 'EF-20260412-001', customer: 'Guest Customer', amount: '$89.00', status: 'pending', date: 'Today', delay: 0.3 },
    { id: 'EF-20260412-002', customer: 'Sarah Johnson', amount: '$245.00', status: 'processing', date: 'Yesterday', delay: 0.35 },
    { id: 'EF-20260411-001', customer: 'Emily Davis', amount: '$156.00', status: 'delivered', date: 'Apr 11', delay: 0.4 },
  ]

  if (!mounted) {
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
            Dashboard
          </h1>
          <p className="text-charcoal-400 font-cormorant">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <div className="flex items-center gap-3 text-charcoal-400 text-sm">
          <Clock size={16} />
          <span>Last updated: Just now</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-playfair text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <QuickLink key={link.title} {...link} />
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-charcoal-800/50 border border-gold-900/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-playfair text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-gold-500 text-sm font-cormorant hover:text-gold-400 transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-1">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <RecentOrder key={order.id} {...order} />
              ))
            ) : (
              <div className="py-12 text-center">
                <ShoppingBag size={40} className="text-charcoal-600 mx-auto mb-3" />
                <p className="text-charcoal-400 font-cormorant">No orders yet</p>
                <p className="text-charcoal-500 text-sm">Orders will appear here when customers make purchases</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Chart Placeholder / Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-charcoal-800/50 border border-gold-900/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-playfair text-white">Sales Overview</h2>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1 text-xs font-cormorant rounded-lg transition-colors ${
                  period === '7d'
                    ? 'bg-gold-500/20 text-gold-500'
                    : 'text-charcoal-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gold-900/30 rounded-xl">
          <div className="text-center">
            <TrendingUp size={48} className="text-charcoal-600 mx-auto mb-3" />
            <p className="text-charcoal-400 font-cormorant text-lg">Sales chart coming soon</p>
            <p className="text-charcoal-500 text-sm">Integrate with analytics to see revenue trends</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tags,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react'
import { useAdminProtection } from '@/app/lib/hooks/useAdmin'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/discounts', label: 'Discounts', icon: Tags },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { isAdmin, checking } = useAdminProtection()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    if (!checking && !isAdmin) {
      router.push('/')
    }
    setCurrentPath(window.location.pathname)
  }, [isAdmin, checking, router])

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [children])

  if (checking) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-charcoal-950 flex">
      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:relative z-50 h-screen bg-charcoal-900 border-r border-gold-900/30 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gold-900/30">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-burgundy-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-playfair font-bold text-lg">EF</span>
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-gold-500 font-playfair font-bold text-xl">Admin</span>
                <span className="block text-charcoal-400 text-[10px] uppercase tracking-widest">Panel</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-burgundy-700/20 text-gold-500'
                    : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-gold-500' : 'text-charcoal-400 group-hover:text-white'} />
                {!isCollapsed && (
                  <span className="font-cormorant uppercase tracking-wider text-sm">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-500" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="hidden lg:block p-4 border-t border-gold-900/30">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-charcoal-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gold-900/30">
          <button
            onClick={() => {
              // Handle logout
              router.push('/')
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="font-cormorant text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-charcoal-950/80 backdrop-blur-xl border-b border-gold-900/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden text-charcoal-400 hover:text-white"
              >
                <Menu size={24} />
              </button>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-charcoal-900 px-4 py-2 rounded-xl border border-gold-900/20">
                <Search size={16} className="text-charcoal-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-charcoal-200 placeholder:text-charcoal-500 outline-none text-sm w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-charcoal-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" />
              </button>

              {/* Admin Badge */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-white text-sm font-medium">Admin</p>
                  <p className="text-charcoal-400 text-xs">admin@elegantfinds.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
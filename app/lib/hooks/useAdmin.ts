'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

/**
 * Hook to check if current user has admin access
 * Redirects to home if not admin
 */
export function useAdminProtection() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false)
        setChecking(false)
        return
      }

      try {
        // Enforce targeted admin email and secret gate token
        const hasToken = sessionStorage.getItem('admin_unlocked') === 'true'
        const isAuthorizedEmail = user.email === 'mounikainti15@gmail.com'
        
        const admin = hasToken && isAuthorizedEmail
        setIsAdmin(admin)
      } catch (error) {
        console.error('Admin check failed:', error)
        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    if (!loading) {
      checkAdmin()
    }
  }, [user, loading])

  return { isAdmin, checking, user }
}

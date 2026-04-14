import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Get the authenticated user from request cookies (server-side)
 */
export async function getServerUser(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      return { error: 'Server configuration error', status: 500, user: null }
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get the JWT token from cookies
    const token = request.cookies.get('sb-jwt-token')?.value

    if (!token) {
      return { error: 'Unauthorized', status: 401, user: null }
    }

    // Verify token and get user
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return { error: 'Unauthorized', status: 401, user: null }
    }

    return { user, error: null, status: 200 }
  } catch (error) {
    console.error('Auth error:', error)
    return { error: 'Authentication error', status: 500, user: null }
  }
}

/**
 * Middleware to require admin access for API routes
 */
export async function requireAdminServer(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      return { error: 'Server configuration error', status: 500, isAdmin: false }
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get the JWT token from cookies
    const token = request.cookies.get('sb-jwt-token')?.value

    if (!token) {
      return { error: 'Unauthorized', status: 401, isAdmin: false }
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return { error: 'Unauthorized', status: 401, isAdmin: false }
    }

    // Check if user has admin role AND matching email in database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('email, role')
      .eq('id', user.id)
      .single()

    const AUTHORIZED_ADMIN = 'mounikainti15@gmail.com'

    if (profileError || profile?.role !== 'admin' || profile?.email !== AUTHORIZED_ADMIN) {
      return { error: 'Forbidden - Unauthorized Admin access', status: 403, isAdmin: false }
    }

    return { user, isAdmin: true, error: null, status: 200 }
  } catch (error) {
    console.error('Admin middleware error:', error)
    return { error: 'Authentication error', status: 500, isAdmin: false }
  }
}

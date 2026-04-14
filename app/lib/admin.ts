import { createClient } from '@supabase/supabase-js'

/**
 * Check if the current user has admin role
 * This can be used in server components and API routes
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials not configured')
      return false
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error checking admin role:', error)
      return false
    }

    return data?.role === 'admin'
  } catch (error) {
    console.error('Admin check error:', error)
    return false
  }
}

/**
 * Server-side middleware to protect admin routes
 */
export async function requireAdmin() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      return { error: 'Server configuration error', status: 500 }
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get the session from cookies (for server components)
    const { data: { session }, error: sessionError } = await supabaseAdmin.auth.getSession()

    if (sessionError || !session) {
      return { error: 'Unauthorized', status: 401 }
    }

    // Check if user is admin
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (userError || user?.role !== 'admin') {
      return { error: 'Forbidden - Admin access required', status: 403 }
    }

    return { user: session.user, isAdmin: true }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return { error: 'Authentication error', status: 500 }
  }
}

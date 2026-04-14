import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdminServer } from '@/app/lib/server-admin'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminServer(request)
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    // Fetch users from the public.users table
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ users, total: users?.length || 0 }, { status: 200 })
  } catch (error) {
    console.error('Error fetching admin customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

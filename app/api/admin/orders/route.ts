import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdminServer } from '@/app/lib/server-admin'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const auth = await requireAdminServer(request)
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, images, slug)
        )
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ orders, total: orders?.length || 0 }, { status: 200 })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

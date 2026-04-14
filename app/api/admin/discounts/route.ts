import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdminServer } from '@/app/lib/server-admin'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminServer(request)
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { data: coupons, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ coupons, total: coupons?.length || 0 }, { status: 200 })
  } catch (error) {
    console.error('Error fetching admin coupons:', error)
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminServer(request)
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const { code, discount_type, value, min_purchase, usage_limit, expires_at, active } = body

    if (!code || !discount_type || value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('coupons')
      .insert([{
        code: code.toUpperCase(),
        discount_type,
        value,
        min_purchase: min_purchase || 0,
        usage_limit: usage_limit || null,
        expires_at: expires_at || null,
        active: active ?? true
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ coupon: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating admin coupon:', error)
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}

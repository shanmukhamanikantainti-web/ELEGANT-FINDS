import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdminServer } from '@/app/lib/server-admin'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminServer(request)
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { data: settings, error } = await supabaseAdmin
      .from('store_settings')
      .select('*')

    if (error) {
      throw error
    }

    // Convert array to object for easier consumption
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({ settings: settingsMap }, { status: 200 })
  } catch (error) {
    console.error('Error fetching admin settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminServer(request)
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { key, value } = await request.json()

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('store_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ setting: data }, { status: 200 })
  } catch (error) {
    console.error('Error updating admin settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

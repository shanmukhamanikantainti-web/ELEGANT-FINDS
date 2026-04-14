import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'

    let query = supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (includeProducts) {
      query = query.select(`
        *,
        products (*)
      `)
    }

    const { data: categories, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ categories }, { status: 200 })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([
        {
          name: body.name,
          slug: body.slug,
          description: body.description || null,
          image_url: body.image_url || null,
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ category: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

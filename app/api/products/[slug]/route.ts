import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // Check if the identifier is a numeric ID or a text slug
    const isId = /^\d+$/.test(slug)
    const column = isId ? 'id' : 'slug'
    const value = isId ? parseInt(slug) : slug

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (*),
        variants
      `)
      .eq(column, value)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ product }, { status: 200 })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const isId = /^\d+$/.test(slug)
    const column = isId ? 'id' : 'slug'
    const value = isId ? parseInt(slug) : slug
    const body = await request.json()

    const updateData: any = {
      ...body,
      updated_at: new Date().toISOString(),
    }

    // Remove id from update if present to avoid Supabase errors
    delete updateData.id

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq(column, value)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ product }, { status: 200 })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const isId = /^\d+$/.test(slug)
    const column = isId ? 'id' : 'slug'
    const value = isId ? parseInt(slug) : slug

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq(column, value)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

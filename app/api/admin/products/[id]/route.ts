import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdminServer } from '@/app/lib/server-admin'

interface Params {
  params: Promise<{ id: string }>
}

// GET /api/admin/products/[id] - Get single product by ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    // Check admin authentication
    const authResult = await requireAdminServer(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (id, name, slug)
      `)
      .eq('id', productId)
      .single()

    if (error) {
      console.error('Supabase query error:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    // Transform response
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: parseFloat(product.price),
      compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
      category_id: product.category_id,
      category: product.categories?.name || '',
      category_slug: product.categories?.slug || '',
      images: Array.isArray(product.images) ? product.images : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
      in_stock: product.in_stock,
      featured: product.featured,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }

    return NextResponse.json({ product: transformedProduct }, { status: 200 })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT /api/admin/products/[id] - Update product by ID
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    // Check admin authentication
    const authResult = await requireAdminServer(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const body = await request.json()

    // Build update data
    const updateData: Record<string, unknown> = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.description !== undefined) updateData.description = body.description
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.compare_price !== undefined) {
      updateData.compare_price = body.compare_price ? parseFloat(body.compare_price) : null
    }
    if (body.category_id !== undefined) updateData.category_id = parseInt(body.category_id)
    if (body.images !== undefined) updateData.images = body.images
    if (body.variants !== undefined) updateData.variants = body.variants
    if (body.in_stock !== undefined) updateData.in_stock = body.in_stock
    if (body.featured !== undefined) updateData.featured = body.featured

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select(`
        *,
        categories (id, name, slug)
      `)
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 })
    }

    // Transform response
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: parseFloat(product.price),
      compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
      category_id: product.category_id,
      category: product.categories?.name || '',
      category_slug: product.categories?.slug || '',
      images: Array.isArray(product.images) ? product.images : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
      in_stock: product.in_stock,
      featured: product.featured,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }

    return NextResponse.json({ product: transformedProduct }, { status: 200 })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id] - Delete product by ID
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    // Check admin authentication
    const authResult = await requireAdminServer(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
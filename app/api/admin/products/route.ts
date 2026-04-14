import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdminServer } from '@/app/lib/server-admin'

// GET /api/admin/products - Get all products (admin view with all fields)
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdminServer(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (id, name, slug)
      `)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('categories.slug', category)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    const { data: products, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    // Transform data
    const transformedProducts = (products || []).map(product => ({
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
    }))

    return NextResponse.json({ products: transformedProducts, total: transformedProducts.length }, { status: 200 })
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await requireAdminServer(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.slug || !body.description || !body.price || !body.category_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Prepare product data
    const productData = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: parseFloat(body.price),
      compare_price: body.compare_price ? parseFloat(body.compare_price) : null,
      category_id: parseInt(body.category_id),
      images: Array.isArray(body.images) ? body.images : [],
      variants: Array.isArray(body.variants) ? body.variants : [],
      in_stock: body.in_stock ?? true,
      featured: body.featured ?? false,
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select(`
        *,
        categories (id, name, slug)
      `)
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 })
    }

    // Transform response
    const transformedProduct = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: parseFloat(data.price),
      compare_price: data.compare_price ? parseFloat(data.compare_price) : null,
      category_id: data.category_id,
      category: data.categories?.name || '',
      category_slug: data.categories?.slug || '',
      images: Array.isArray(data.images) ? data.images : [],
      variants: Array.isArray(data.variants) ? data.variants : [],
      in_stock: data.in_stock,
      featured: data.featured,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    return NextResponse.json({ product: transformedProduct }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
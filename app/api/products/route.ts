import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { Product } from '@/lib/utils/constants'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    // Check if supabaseAdmin is initialized
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized')
      return NextResponse.json(
        { error: 'Database connection not configured. Check environment variables.' },
        { status: 500 }
      )
    }

    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        price,
        compare_price,
        images,
        variants,
        in_stock,
        featured,
        created_at,
        updated_at,
        categories (slug)
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
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      )
    }

    // Transform data to match Product interface
    const transformedProducts: Product[] = (products || []).map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: parseFloat(product.price),
      compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
      category: product.categories?.slug || '',
      images: Array.isArray(product.images) ? product.images : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
      in_stock: product.in_stock,
      featured: product.featured,
      created_at: product.created_at,
      updated_at: product.updated_at || undefined,
    }))

    return NextResponse.json({ products: transformedProducts, total: transformedProducts.length }, { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.slug || !body.description || !body.price || !body.category_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
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
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to create product', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ product: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

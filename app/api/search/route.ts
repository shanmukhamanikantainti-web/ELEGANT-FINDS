import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { Product } from '@/lib/utils/constants'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q || q.trim() === '') {
      return NextResponse.json({ products: [] }, { status: 200 })
    }

    const searchQuery = q.trim().toLowerCase()

    // Search products by name, description using ILIKE (case-insensitive)
    const { data: products, error } = await supabaseAdmin
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
      .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .order('featured DESC, created_at DESC')
      .limit(50)

    if (error) {
      throw error
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

    return NextResponse.json({ products: transformedProducts, query: q }, { status: 200 })
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}

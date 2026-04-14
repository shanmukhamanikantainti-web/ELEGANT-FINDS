import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateOrderNumber } from '@/lib/utils/helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      shipping_address,
      contact_info,
      items,
      total_amount,
      payment_method,
    } = body

    if (!user_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique order number
    const order_number = generateOrderNumber()

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id,
        order_number,
        status: 'pending',
        total_amount,
        shipping_address,
        contact_info,
        payment_method: payment_method || null,
        payment_status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Create order items
    const orderItems = items.map((item: {
      product_id: number
      variant: any
      quantity: number
      price: number
    }) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    // Fetch product details for email
    const productIds = items.map((item: { product_id: number }) => item.product_id)
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name, images')
      .in('id', productIds)

    const productMap = new Map()
    products?.forEach((p: any) => {
      productMap.set(p.id, p)
    })

    const enrichedItems = items.map((item: { product_id: number; variant: any; quantity: number; price: number }) => {
      const product = productMap.get(item.product_id)
      return {
        name: product?.name || 'Product',
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
      }
    })


    // Return the created order with items
    return NextResponse.json(
      { order: { ...order, items } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const order_number = searchParams.get('order_number')
    const email = searchParams.get('email')

    // Support public tracking
    if (order_number && email) {
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('order_number', order_number)
        .single()

      if (error || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Simple email verification (check contact_info)
      const contactInfo = order.contact_info as any
      if (contactInfo?.email?.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json({ error: 'Unauthorized tracking request' }, { status: 403 })
      }

      return NextResponse.json({ order }, { status: 200 })
    }

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID or Tracking Credentials required' },
        { status: 400 }
      )
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

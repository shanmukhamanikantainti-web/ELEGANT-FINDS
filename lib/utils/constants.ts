export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  compare_price?: number | null
  category: string
  images: string[]
  variants: ProductVariant[]
  in_stock: boolean
  featured: boolean
  created_at: string
  updated_at?: string
}

export interface ProductVariant {
  size: string
  color: string
  material: string
  sku?: string
  price_modifier?: number
  stock?: number
}

export interface CartItem {
  id: string
  user_id?: string
  product_id: number
  product?: Product
  variant: ProductVariant
  quantity: number
  created_at: string
}

export interface Order {
  id: number
  user_id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: ShippingAddress
  contact_info: ContactInfo
  payment_method: string
  payment_status: string
  items: OrderItem[]
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product?: Product
  variant: ProductVariant
  quantity: number
  price: number
}

export interface ShippingAddress {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface ContactInfo {
  email: string
  phone: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  role: 'user' | 'admin'
  phone?: string
  created_at: string
}

export const CATEGORIES = [
  { name: 'Earrings', slug: 'earrings' },
  { name: 'Hair Clips', slug: 'hair-clips' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Bracelets', slug: 'bracelets' },
  { name: 'Necklaces', slug: 'necklaces' },
  { name: 'Rings', slug: 'rings' },
] as const

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export const CURRENCY = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
}

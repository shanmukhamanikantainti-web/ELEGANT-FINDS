export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'user' | 'admin'
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: 'user' | 'admin'
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'user' | 'admin'
          phone?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          slug: string
          description: string
          price: number
          compare_price: number | null
          category_id: number
          images: Json
          variants: Json
          in_stock: boolean
          featured: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description: string
          price: number
          compare_price?: number | null
          category_id: number
          images: Json
          variants: Json
          in_stock?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string
          price?: number
          compare_price?: number | null
          category_id?: number
          images?: Json
          variants?: Json
          in_stock?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      cart_items: {
        Row: {
          id: number
          user_id: string
          product_id: number
          variant: Json
          quantity: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          product_id: number
          variant: Json
          quantity: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          product_id?: number
          variant?: Json
          quantity?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string
          order_number: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          shipping_address: Json
          contact_info: Json
          payment_method: string | null
          payment_status: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          order_number: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          shipping_address: Json
          contact_info: Json
          payment_method?: string | null
          payment_status?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          order_number?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount?: number
          shipping_address?: Json
          contact_info?: Json
          payment_method?: string | null
          payment_status?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number
          variant: Json
          quantity: number
          price: number
        }
        Insert: {
          id?: number
          order_id: number
          product_id: number
          variant: Json
          quantity: number
          price: number
        }
        Update: {
          id?: number
          order_id?: number
          product_id?: number
          variant?: Json
          quantity?: number
          price?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      user_role: 'user' | 'admin'
    }
  }
}

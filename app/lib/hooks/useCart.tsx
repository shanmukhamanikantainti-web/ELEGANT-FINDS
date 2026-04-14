'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { CartItem, Product, ProductVariant } from '@/lib/utils/constants'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant: ProductVariant } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, variant: ProductVariant) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant } = action.payload
      const variantKey = JSON.stringify(variant)
      const existingIndex = state.items.findIndex(
        item => item.product_id === product.id && JSON.stringify(item.variant) === variantKey
      )

      if (existingIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        }
        return { items: updatedItems }
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        product_id: product.id,
        product: product,
        variant,
        quantity: 1,
        created_at: new Date().toISOString(),
      }

      return { items: [...state.items, newItem] }
    }

    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(item => item.id !== action.payload.itemId),
      }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload
      if (quantity <= 0) {
        return {
          items: state.items.filter(item => item.id !== itemId),
        }
      }
      return {
        items: state.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      }
    }

    case 'CLEAR_CART':
      return { items: [] }

    case 'LOAD_CART':
      return { items: action.payload }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  // Sync cart to Supabase when user logs in
  // TODO: Implement when auth is set up

  const addToCart = (product: Product, variant: ProductVariant) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant } })
  }

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartTotal = () => {
    return state.items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    )
  }

  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

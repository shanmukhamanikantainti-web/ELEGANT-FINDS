'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product } from '@/lib/utils/constants'

interface WishlistItem {
  id: string
  product_id: number
  product: Product
  added_at: string
}

interface WishlistState {
  items: WishlistItem[]
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: { product: Product } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'REMOVE_BY_PRODUCT'; payload: { productId: number } }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (itemId: string) => void
  removeByProductId: (productId: number) => void
  clearWishlist: () => void
  isInWishlist: (productId: number) => boolean
  getWishlistCount: () => number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product } = action.payload
      // Check if already in wishlist
      const existingIndex = state.items.findIndex(item => item.product_id === product.id)
      if (existingIndex > -1) {
        return state
      }

      const newItem: WishlistItem = {
        id: `wishlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        product_id: product.id,
        product: product,
        added_at: new Date().toISOString(),
      }

      return { items: [...state.items, newItem] }
    }

    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(item => item.id !== action.payload.itemId),
      }

    case 'REMOVE_BY_PRODUCT':
      return {
        items: state.items.filter(item => item.product_id !== action.payload.productId),
      }

    case 'CLEAR_WISHLIST':
      return { items: [] }

    case 'LOAD_WISHLIST':
      return { items: action.payload }

    default:
      return state
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist })
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items))
  }, [state.items])

  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: { product } })
  }

  const removeFromWishlist = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } })
  }

  const removeByProductId = (productId: number) => {
    dispatch({ type: 'REMOVE_BY_PRODUCT', payload: { productId } })
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const isInWishlist = (productId: number) => {
    return state.items.some(item => item.product_id === productId)
  }

  const getWishlistCount = () => {
    return state.items.length
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: state.items,
        addToWishlist,
        removeFromWishlist,
        removeByProductId,
        clearWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
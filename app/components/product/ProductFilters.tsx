'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Category {
  id: number
  name: string
  slug: string
  count?: number
}

const STATIC_CATEGORIES: Category[] = [
  { id: 0, name: 'All Items', slug: '', count: undefined },
  { id: 1, name: 'Silk Accessories', slug: 'silk-accessories', count: 42 },
  { id: 2, name: 'Minimalist Jewelry', slug: 'jewelry-edit', count: 28 },
  { id: 3, name: 'Velvet Scrunchies', slug: 'velvet-scrunchies', count: 15 },
  { id: 4, name: 'Hair Pins & Clips', slug: 'hair-studio', count: 57 },
  { id: 5, name: 'Korean Picks', slug: 'korean-picks', count: 33 },
  { id: 6, name: 'Beauty', slug: 'beauty', count: 19 },
  { id: 7, name: 'Gift Lounge', slug: 'gift-lounge', count: 12 },
  { id: 8, name: 'Decor', slug: 'decor', count: 8 },
]

export default function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  const [categories, setCategories] = useState<Category[]>(STATIC_CATEGORIES)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          if (data.categories?.length > 0) {
            setCategories([
              { id: 0, name: 'All Items', slug: '' },
              ...data.categories,
            ])
          }
        }
      } catch (_) {
        // Use static fallback
      }
    }
    fetchCategories()
  }, [])

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams)
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-10">
      {/* Category Section */}
      <div>
        <h3 className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-on-surface-variant/50 mb-6">Category</h3>
        <ul className="flex flex-col gap-1">
          {categories.map((cat) => {
            const active = currentCategory === cat.slug
            return (
              <li key={cat.slug || 'all'}>
                <button
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full text-left flex items-center justify-between px-5 py-3.5 rounded-[14px] transition-all duration-200 group ${
                    active
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className={`text-sm font-body ${active ? 'font-semibold' : ''}`}>
                    {cat.name}
                  </span>
                  {cat.count !== undefined && (
                    <span
                      className={`text-[10px] font-body font-bold tabular-nums ${
                        active ? 'text-white/70' : 'text-on-surface-variant/40 group-hover:text-on-surface-variant/70'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Divider */}
      <div className="h-px bg-outline-variant/10" />

      {/* Price Filter */}
      <div>
        <h3 className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-on-surface-variant/50 mb-6">Price Range</h3>
        <div className="flex flex-col gap-3">
          {['Under $50', '$50 – $100', '$100 – $200', '$200+'].map((range) => (
            <label key={range} className="flex items-center gap-4 cursor-pointer group">
              <div className="relative w-5 h-5 flex-shrink-0">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-5 h-5 rounded-md bg-surface-container-low border border-outline-variant/20 peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs font-light opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                </div>
              </div>
              <span className="text-sm font-body text-on-surface-variant group-hover:text-on-surface transition-colors">
                {range}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-outline-variant/10" />

      {/* In Stock Only */}
      <div>
        <label className="flex items-center gap-4 cursor-pointer group">
          <div className="relative w-5 h-5 flex-shrink-0">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="w-5 h-5 rounded-md bg-surface-container-low border border-outline-variant/20 peer-checked:bg-primary peer-checked:border-primary transition-all duration-200" />
          </div>
          <span className="text-sm font-body text-on-surface-variant group-hover:text-on-surface transition-colors">
            In Stock Only
          </span>
        </label>
      </div>
    </div>
  )
}

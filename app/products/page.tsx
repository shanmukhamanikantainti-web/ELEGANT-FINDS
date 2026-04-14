import { Suspense } from 'react'
import ProductGrid from '@/app/components/product/ProductGrid'
import ProductFilters from '@/app/components/product/ProductFilters'

export const metadata = {
  title: 'Elegant Finds | Shop the Digital Atelier',
  description: 'Explore our handpicked selection of Seoul\'s finest aesthetic treasures. Minimalist designs, soft textures, and timeless elegance curated for your digital atelier.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined

  return (
    <div className="min-h-screen bg-surface">
      {/* Page Header */}
      <div className="pt-36 pb-16 px-8 lg:px-16 max-w-screen-2xl mx-auto">
        <p className="text-[10px] font-body font-bold uppercase tracking-[0.5em] text-primary mb-6 block">
          The Digital Atelier
        </p>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-headline tracking-tighter text-on-surface mb-6 leading-[0.85]">
          Shop the<br />
          <span className="italic font-light text-primary">Atelier.</span>
        </h1>
        <p className="max-w-xl text-base text-on-surface-variant font-body leading-relaxed opacity-70">
          Explore our handpicked selection of Seoul's finest aesthetic treasures. Minimalist designs, soft textures, and a timeless elegance curated for your digital atelier.
        </p>
      </div>

      {/* Main Content: Filters + Grid */}
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 pb-40">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-32">
            <ProductFilters />
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-primary/40">Loading the Edit</p>
                </div>
              }
            >
              <ProductGrid categoryFilter={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

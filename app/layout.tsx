import type { Metadata } from 'next'
import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/app/components/layout/Header'
import Footer from '@/app/components/layout/Footer'
import { CartProvider } from '@/app/lib/hooks/useCart'
import { AuthProvider } from '@/app/lib/hooks/useAuth'
import { WishlistProvider } from '@/app/lib/hooks/useWishlist'
import AdminGate from '@/app/components/admin/AdminGate'

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: ['400', '700']
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: 'Elegant Finds | Cute, Curated, Premium Digital Atelier',
  description: 'A curated digital atelier bringing high-end global aesthetics and soft minimalism to your daily rituals.',
  metadataBase: new URL('https://elegantfinds.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
      </head>
      <body className="font-body antialiased bg-surface text-on-surface">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <AdminGate />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

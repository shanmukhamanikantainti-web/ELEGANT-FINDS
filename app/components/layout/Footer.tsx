import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-on-surface text-surface">
      {/* Main Footer Grid */}
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-headline tracking-tighter text-surface mb-4">Elegant Finds</h2>
            <p className="text-sm font-body text-surface/50 leading-relaxed mb-8 max-w-xs">
              A curated digital atelier bringing high-end global aesthetics and soft minimalism to your daily rituals.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-primary transition-colors flex items-center justify-center group">
                <span className="material-symbols-outlined text-surface/60 group-hover:text-white font-light text-lg">camera</span>
              </a>
              <a href="#" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-primary transition-colors flex items-center justify-center group">
                <span className="material-symbols-outlined text-surface/60 group-hover:text-white font-light text-lg">brand_family</span>
              </a>
              <a href="#" aria-label="Newsletter" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-primary transition-colors flex items-center justify-center group">
                <span className="material-symbols-outlined text-surface/60 group-hover:text-white font-light text-lg">mail</span>
              </a>
            </div>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-surface/40 mb-8">Connect</h3>
            <ul className="space-y-5">
              {[
                { label: 'WhatsApp', href: '#' },
                { label: 'Instagram', href: '#' },
                { label: 'Newsletter', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm font-body text-surface/60 hover:text-primary transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-surface/40 mb-8">Support</h3>
            <ul className="space-y-5">
              {[
                { label: 'Shipping', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
                { label: 'Order Tracking', href: '/order-tracking' },
                { label: 'Contact', href: '/contact' },
                { label: 'FAQs', href: '/faq' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-body text-surface/60 hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier Location Column */}
          <div>
            <h3 className="text-[10px] font-body font-bold uppercase tracking-[0.4em] text-surface/40 mb-8">Atelier Location</h3>
            <p className="text-sm font-body text-surface/60 leading-relaxed mb-4">
              Visit us virtually or at our flagship studio.
            </p>
            <p className="text-sm font-body text-surface/40">12 Fashion District, Gangnam-gu, Seoul</p>
            <p className="text-sm font-body text-surface/40 mt-1">Mon – Sat: 10am – 7pm</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-body text-surface/30">
            © {year} Elegant Finds. Designed for the Digital Atelier.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-xs font-body text-surface/30 hover:text-surface/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs font-body text-surface/30 hover:text-surface/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

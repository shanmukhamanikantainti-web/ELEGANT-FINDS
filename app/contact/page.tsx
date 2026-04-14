'use client'

import { motion } from 'framer-motion'

export default function ContactPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
  }

  const contactMethods = [
    { icon: 'mail', title: 'Digital Correspondence', detail: 'hello@elegantfinds.com', delay: 0.1 },
    { icon: 'call', title: 'Verbal Dialogue', detail: '+1 (555) 123-4567', delay: 0.2 },
    { icon: 'distance', title: 'Atelier Presence', detail: '123 Fashion Ave, NY 10001', delay: 0.3 }
  ]

  return (
    <div className="min-h-screen bg-surface pt-32 pb-40">
      <div className="max-w-screen-xl mx-auto px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-6 block"
          >
            Engagement & Inquiries
          </motion.span>
          <motion.h1 
            {...fadeInUp}
            className="text-5xl md:text-6xl font-headline tracking-tighter text-on-surface mb-8"
          >
            Initiate <span className="text-primary">Dialogue</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-on-surface-variant font-body leading-relaxed text-lg"
          >
            Whether seeking bespoke curation or clarification on our current selections, our concierge team is at your disposal.
          </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {contactMethods.map((method) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: method.delay, duration: 1, ease: [0.33, 1, 0.68, 1] }}
              className="bg-surface-container-low p-12 rounded-[48px] text-center custom-shadow group hover:bg-on-surface hover:text-surface transition-all duration-700 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-[20px] flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-3xl text-primary">{method.icon}</span>
              </div>
              <h3 className="text-xl font-headline mb-4 tracking-tight">{method.title}</h3>
              <p className="text-sm text-on-surface-variant group-hover:text-surface/60 font-body tracking-wide select-all">{method.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-surface-container-high rounded-[64px] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl font-headline mb-6 text-on-surface tracking-tight">Technical Assistance</h2>
            <p className="text-on-surface-variant font-body mb-10 leading-relaxed">
              Encountering difficulties within our digital space? Access our comprehensive FAQ or engage directly for immediate resolution.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/faq" className="px-10 py-4 bg-surface rounded-full text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-on-surface hover:text-surface transition-all">
                Browse FAQ
              </a>
              <button className="px-10 py-4 bg-primary rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                Submit Ticket
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

# Elegant Finds 47 - Setup Guide

## Quick Setup Steps

### 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Project Settings → API to get your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Public/anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (Service role key - **keep this secret**)

3. Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANONKEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Run Database Migration

1. In your Supabase dashboard, go to the SQL Editor
2. Click "New Query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration

This will create all tables, indexes, RLS policies, functions, and seed data.

### 3. Resend Setup (Optional - for emails)

1. Go to [resend.com](https://resend.com) and create an account
2. Get your API key from the dashboard
3. Add it to `.env.local` as `RESEND_API_KEY`
4. For production, you'll need to verify a domain

### 4. Start Development Server

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Troubleshooting

### Error: "Failed to fetch products"

**Cause:** Database not set up or environment variables missing.

**Solution:**
1. Verify `.env.local` has correct Supabase credentials
2. Ensure you ran the SQL migration in Supabase dashboard
3. Check the browser console and server logs for specific errors
4. The site will show fallback demo products if database is unavailable

### Error: "Supabase query error: relation 'products' does not exist"

**Cause:** Migration not executed.

**Solution:** Run the SQL migration in Supabase dashboard (Step 2 above).

### Error: "Invalid API key"

**Cause:** Incorrect Supabase credentials.

**Solution:** Double-check the keys in `.env.local` match your Supabase project.

---

## Project Structure

```
elegantfinds/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication callbacks
│   │   ├── products/       # Product CRUD
│   │   ├── products/[slug]/
│   │   ├── products/[id]/
│   │   ├── categories/     # Category management
│   │   ├── orders/         # Order creation & user orders
│   │   ├── admin/orders/   # Admin order management
│   │   └── search/         # Product search
│   ├── admin/              # Admin dashboard pages
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   └── ...
│   ├── auth/               # Authentication pages
│   ├── products/           # Product listing & detail
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── account/            # User account pages
│   └── components/         # Reusable UI components
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── email/              # Email utilities (Resend)
│   └── utils/              # Helper functions
├── supabase/
│   └── migrations/         # Database schema
└── .env.local              # Environment variables
```

---

## Features Overview

### User Features
- Browse products with filtering by category
- Search products
- View product details with image gallery
- Add to cart (persisted in localStorage)
- Secure checkout with magic link auth
- Order history & tracking
- Responsive design for all devices

### Admin Features
- Dashboard overview
- Product management (Create, Read, Update, Delete)
- Order management with status updates
- View customer orders

### Technical Stack
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Animations:** Framer Motion, GSAP
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (email magic link)
- **Email:** Resend
- **Hosting:** Vercel (recommended)

---

## Next Steps

After basic setup:

1. **Customize branding:** Update colors, fonts, logos in `tailwind.config.ts` and `app/layout.tsx`
2. **Add payment gateway:** Integrate Stripe or Razorpay in checkout
3. **Upload product images:** Set up Supabase Storage for image uploads
4. **Add reviews:** Implement product review system
5. **Deploy:** Push to GitHub and deploy on Vercel

---

## Support

For issues or questions:
- Check the console logs for detailed error messages
- Verify all environment variables are set
- Ensure database migration completed successfully
- Review Supabase dashboard for any policy issues

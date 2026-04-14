# Admin Panel Setup Guide

## 🎯 Quick Overview

The admin panel is now protected with role-based authentication. Only users with `role = 'admin'` in the database can access `/admin` routes.

---

## 📋 Steps to Set Up Admin Access

### Step 1: Configure Supabase (already done if you ran migration)

The migration file includes the `users` table with a `role` column. This extends Supabase's built-in `auth.users` table.

### Step 2: Create/Sign Up a User

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:3000/auth/signup`
3. Sign up with the email you want to make admin: **mounikainti15@gmail.com**
4. Check your email and click the magic link to log in

### Step 3: Assign Admin Role (via Supabase Dashboard)

After the user signs up, their record is created in the `users` table. You need to set their role to `admin`.

**Option A: Using Supabase SQL Editor (Recommended)**

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Paste this SQL (replace email if different):

```sql
-- Set mounikainti15@gmail.com as admin
UPDATE users
SET role = 'admin'
WHERE email = 'mounikainti15@gmail.com';
```

5. Click **Run**
6. You should see: `UPDATE 1`

**Option B: Using Supabase Table Editor**

1. Go to **Table Editor** → `users` table
2. Find the row for `mounikainti15@gmail.com`
3. Click **Edit**
4. Change `role` from `user` to `admin`
5. Click **Save**

### Step 4: Access Admin Panel

1. Log out if you're currently logged in
2. Log in again via the magic link (important: session needs to refresh)
3. Click the **User icon** in the header → you'll be taken to `/admin`
4. Or directly visit: `http://localhost:3000/admin`

---

## 🔐 How Admin Protection Works

### Client-Side (`useAdminProtection` hook)
- Calls `useAuth()` to get current user
- Checks `user.user_metadata.role === 'admin'`
- Redirects non-admin users to home page

### Server-Side (API Routes)
- Admin API routes (`/api/admin/*`) use `requireAdminServer()`
- Verifies JWT token from cookies
- Checks database for `users.role = 'admin'`
- Returns 403 Forbidden if not admin

### Database
- `users` table has a `role` column (values: 'user', 'admin')
- RLS policies restrict users to their own data
- Admin role bypasses restrictions for admin API routes

---

## 🛠️ Admin Features

### `/admin` - Dashboard
- Overview stats
- Quick links to management sections

### `/admin/products` - Product Management
- View all products in table
- Create new product (`/admin/products/new`)
- Edit existing product (`/admin/products/[id]/edit`)
- Delete product
- Bulk operations (future)

### `/admin/orders` - Order Management
- View all customer orders
- Update order status (pending → processing → shipped → delivered)
- View order details
- Filter by status

### `/admin/customers` - Customer Management *(Coming Soon)*
- View registered users
- Customer details

### `/admin/settings` - Store Settings *(Coming Soon)*
- Store information
- Email templates
- Payment configuration

---

## 🚨 Security Notes

### What's Protected
- ✅ All `/admin/*` pages require login + admin role
- ✅ Admin API routes verify JWT + database role
- ✅ Regular users are redirected to home if they try to access admin

### What to Do Before Production
1. **Enable email confirmation**: Require users to verify email before login
2. **Add 2FA**: Consider two-factor authentication for admin accounts
3. **Rate limiting**: Add rate limiting to admin API endpoints
4. **Audit logs**: Log all admin actions (product changes, order updates)
5. **HTTPS**: Ensure SSL/TLS is enabled (Vercel provides this automatically)

---

## 🐛 Troubleshooting

### "Access Denied" or redirects to home
**Cause:** User doesn't have admin role set in database.
**Fix:** Follow Step 3 to set `role = 'admin'` for the user.

### Can't see admin link in header
**Cause:** `user.user_metadata.role` not loaded.
**Fix:** Log out and log back in to refresh session metadata.

### API returns 403 or 401
**Cause:** Not logged in or session expired.
**Fix:** Log in again via magic link, ensure cookies are enabled.

### Admin panel loads but shows no products/orders
**Cause:** Database tables are empty.
**Fix:**
- Add products via "Add Product" button
- Or wait for customers to place orders

---

## 📝 Change Admin Role Later

To add/remove admin access:

```sql
-- Grant admin
UPDATE users SET role = 'admin' WHERE email = 'email@example.com';

-- Revoke admin (demote to user)
UPDATE users SET role = 'user' WHERE email = 'email@example.com';
```

You can also create multiple admin users by running the same SQL with different emails.

---

## 🔧 Technical Details

### Cookie Name
Supabase stores JWT in cookie named `sb-jwt-token` (default). This is what `requireAdminServer()` reads.

### Role Storage
- **Client-side**: `user.user_metadata.role` (populated by `useAuth` fetching from `users` table)
- **Server-side**: Direct DB query to `users` table

### Files Modified
- `app/lib/hooks/useAdmin.ts` - Client-side admin protection hook
- `app/lib/server-admin.ts` - Server-side middleware
- `app/components/layout/Header.tsx` - Conditional admin link
- All `/admin/*` pages - Added `useAdminProtection` hook
- All `/api/admin/*` routes - Added `requireAdminServer()` check

---

## ✅ Admin Setup Checklist

- [ ] Database migration executed (tables created)
- [ ] User signed up at `/auth/signup`
- [ ] Admin role assigned via SQL or table editor
- [ ] User logged out and back in
- [ ] Admin panel accessible at `/admin`
- [ ] Can view products and orders
- [ ] Can create/edit/delete products
- [ ] Can update order status

---

**Need help?** Check browser console and server logs for error details.

-- =======================================================================================
-- PLEASE RUN THIS ROBUST SCRIPT IN THE SUPABASE SQL EDITOR
-- =======================================================================================
-- This script fixes the "Invalid login credentials" and "Database error" issues by:
-- 1. Ensuring the sync trigger is robust and handles conflicts.
-- 2. Manually syncing all existing accounts from auth.users to public.users.
-- =======================================================================================

-- 1. Create or Update the sync function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
    
  RETURN NEW;
END;
$$;

-- 2. Re-create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Sync existing users (Repair Step)
-- This ensures that users created BEFORE the trigger was fixed are now in the table.
INSERT INTO public.users (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email), 
  'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. Specifically ensure the targeted admin user has the admin role
-- If the user exists, upgrade them.
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'mounikainti15@gmail.com';

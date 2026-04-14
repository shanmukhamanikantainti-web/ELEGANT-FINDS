import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function test() {
  const { data, error } = await supabaseAdmin.from('users').select('*').limit(5)
  console.log('Users in public.users:', data, 'Error:', error)
  
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
  console.log('Users in auth:', authData?.users?.length, 'Auth error:', authError)
}

test()

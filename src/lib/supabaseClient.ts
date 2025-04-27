import { createClient } from '@supabase/supabase-js'

// Initialize client with public keys for client-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error('Supabase URL or Anonymous Key is missing. Check your environment variables.');
  }
  throw new Error('Supabase URL and Anonymous Key are required. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations that need higher privileges (admin routes, API routes)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create server-side admin client
// This client should only be used in server components or API routes
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey, // Fallback to anon key if service role key is missing
  {
    auth: {
      persistSession: false,
    }
  }
);

// Log a warning if supabaseAdmin is used on the client side
if (typeof window !== 'undefined') {
  console.warn('Warning: supabaseAdmin is available on the client side. It should only be used in server components.');
}

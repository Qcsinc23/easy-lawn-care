import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * @fileoverview Initializes the Supabase admin client for server-side use only.
 * This client uses the service role key for elevated privileges and should never
 * be exposed to the client-side/browser.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Critical check: Ensure necessary environment variables are available for the admin client.
if (!supabaseUrl) {
  throw new Error('Supabase configuration error: NEXT_PUBLIC_SUPABASE_URL is missing. Check server environment variables.');
}

if (!supabaseServiceRoleKey) {
  // Log a warning if the service key is missing, as the client will lack admin privileges.
  console.warn(
    'Supabase Admin Client Warning: SUPABASE_SERVICE_ROLE_KEY is not set. The admin client will use the public ANON key as a fallback and will NOT bypass Row Level Security (RLS). Ensure the service role key is configured in your server environment for admin operations.'
  );
  // Note: We proceed using the ANON key as a fallback, but functionality might be limited.
}

// Use the public ANON key as a fallback ONLY if the service key is missing.
// This allows the application to potentially run with limited admin capabilities,
// but logs a clear warning. The ideal state is always having the service key set.
const adminKey = supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!adminKey) {
  // This should theoretically not happen if NEXT_PUBLIC_SUPABASE_ANON_KEY is set,
  // but added as a safeguard.
  throw new Error('Supabase configuration error: Could not determine a key (SERVICE_ROLE or ANON) for the admin client.');
}

/**
 * Supabase admin client instance for server-side operations requiring elevated privileges.
 * Uses the service role key (if available) for bypassing Row Level Security (RLS).
 * IMPORTANT: This client must NEVER be exposed to the browser. Only import and use it
 * in server-side code (e.g., API routes, server components, server actions).
 * Requires `NEXT_PUBLIC_SUPABASE_URL` and ideally `SUPABASE_SERVICE_ROLE_KEY`.
 *
 * @type {SupabaseClient}
 */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  adminKey, // Use service key or fallback to anon key
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    }
  }
);

// No client-side checks needed here as this file should ONLY be imported server-side.

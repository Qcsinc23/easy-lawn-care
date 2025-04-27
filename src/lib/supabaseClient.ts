import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * @fileoverview Initializes Supabase clients for both client-side and server-side use.
 * It sets up a public client safe for browser environments and an admin client
 * intended only for server-side operations requiring elevated privileges.
 * Environment variables are used for configuration.
 */

// Initialize client with public keys for client-side usage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `Supabase configuration error: NEXT_PUBLIC_SUPABASE_URL (${supabaseUrl ? 'found' : 'missing'}) or NEXT_PUBLIC_SUPABASE_ANON_KEY (${supabaseAnonKey ? 'found' : 'missing'}). Check your .env.local file or deployment environment variables.`;
  if (typeof window !== 'undefined') {
    // Log error specifically for client-side issues
    console.error(errorMessage);
  }
  // Throw error regardless of environment to prevent client/server initialization
  throw new Error(errorMessage);
}

/**
 * Supabase client instance for client-side operations.
 * Uses the public URL and anonymous key. Safe to use in browser environments.
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.
 * @type {SupabaseClient}
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client logic has been moved to src/lib/supabaseAdminClient.ts
// This file now only contains the client-safe Supabase instance.

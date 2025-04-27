// Enhanced utility to refresh the Supabase schema cache after table structure changes

import { supabase, supabaseAdmin } from './supabaseClient';

/**
 * Refreshes the Supabase PostgREST schema cache.
 * Use this function after creating new tables or modifying table structure.
 * 
 * PostgREST caches the database schema, and sometimes this cache needs to be 
 * refreshed after structural changes, especially when getting PGRST204 errors.
 * 
 * This improved version tries multiple approaches to force a refresh.
 * 
 * @returns Promise<boolean> True if refresh was successful
 */
export async function refreshSupabaseSchema(): Promise<boolean> {
  console.log('Starting PostgREST schema cache refresh...');
  
  try {
    // First attempt - try to explicitly call some common tables
    // This can sometimes kickstart the schema refresh
    const tables = ['addresses', 'bookings', 'services', 'users', 'profiles'];
    console.log('Method 1: Attempting to access multiple tables to trigger refresh...');
    
    for (const table of tables) {
      try {
        console.log(`Trying to access table: ${table}`);
        // Using a count query which is lightweight
        const { error } = await supabase
          .from(table)
          .select('count(*)', { count: 'exact', head: true });
          
        if (!error) {
          console.log(`Successfully accessed ${table} table`);
        } else {
          console.log(`Error accessing ${table}:`, error);
        }
      } catch (e) {
        console.log(`Exception accessing ${table}:`, e);
      }
    }
    
    // Second attempt - try with the admin client which has more privileges
    console.log('Method 2: Using admin client for privileged access...');
    
    try {
      // First try a simple query to check if the admin client can access the table
      const { error: adminQueryError } = await supabaseAdmin
        .from('addresses')
        .select('*')
        .limit(1);
      
      if (adminQueryError) {
        console.warn('Admin client access failed:', adminQueryError);
      } else {
        console.log('Admin client successfully accessed addresses table');
      }
    } catch (e) {
      console.error('Exception during admin client access:', e);
    }
    
    // Third attempt - try specific column access to trigger schema refresh
    console.log('Method 3: Attempting specific column access...');
    
    try {
      // Access each column individually to help refresh schema cache
      for (const column of ['id', 'clerk_user_id', 'street_address', 'area', 'city', 'region', 'postal_code', 'country']) {
        const columnQuery = await supabaseAdmin
          .from('addresses')
          .select(column)
          .limit(1);
        
        console.log(`Column ${column} access result:`, columnQuery.error ? 'Error' : 'Success');
      }
    } catch (e) {
      console.error('Exception during column access:', e);
    }
    
    // Final verification - one more attempt to access the problematic column
    console.log('Final verification: checking if area column is accessible');
    
    const finalCheck = await supabase
      .from('addresses')
      .select('area')
      .limit(1);
      
    if (finalCheck.error) {
      if (finalCheck.error.code === 'PGRST204') {
        console.error('Schema refresh failed - area column still not in schema cache.');
        
        // Last resort: Display helpful diagnostic message
        console.log('DIAGNOSTIC HELP: The PostgREST schema cache appears to be stale.');
        console.log('If this issue persists, please run the following SQL in your Supabase SQL editor:');
        console.log(`
          -- Verify addresses table structure
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'addresses';
          
          -- Check if the table exists but PostgREST can't see it
          SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'addresses'
          );
          
          -- Reinstall the addresses table if needed
          CREATE TABLE IF NOT EXISTS public.addresses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            clerk_user_id TEXT NOT NULL,
            street_address TEXT NOT NULL,
            area TEXT NOT NULL,
            city TEXT NOT NULL,
            region TEXT NOT NULL,
            postal_code TEXT,
            country TEXT NOT NULL DEFAULT 'Guyana',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);
        
        return false;
      } else {
        console.error('Final verification failed with error:', finalCheck.error);
        return false;
      }
    }
    
    console.log('Schema refresh appears successful! The area column is now accessible.');
    return true;
  } catch (err) {
    console.error('Unexpected exception during schema refresh:', err);
    return false;
  }
}

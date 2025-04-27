import { supabaseAdmin } from '@/lib/supabaseAdminClient'; // Corrected import path
import { currentUser, type User } from '@clerk/nextjs/server';

/**
 * @fileoverview Utility function to synchronize Clerk user data with the Supabase 'profiles' table.
 * Ensures that every authenticated Clerk user has a corresponding profile record in the database.
 */

/**
 * Synchronizes the currently authenticated Clerk user's profile with the Supabase `profiles` table.
 *
 * This server-side function ensures data consistency between the authentication provider (Clerk)
 * and the application's database (Supabase). It performs the following steps:
 *
 * 1. **Retrieve User:** Either uses the provided userId or fetches the current user's data from 
 *    Clerk using `currentUser()`. If no user is authenticated in the current server context or 
 *    provided explicitly, the function exits early.
 * 2. **Check Existence:** Queries the `profiles` table using the `supabaseAdmin` client (which can
 *    bypass RLS if configured with the service role key) to see if a profile record already exists
 *    for the `user.id`. It uses `.select('clerk_user_id').eq(...).single()` for efficiency, expecting
 *    at most one matching record. The Supabase error code `PGRST116` (No rows found) is specifically
 *    handled as a non-error condition indicating the profile needs creation.
 * 3. **Create Profile (if needed):** If the check in step 2 finds no existing profile (either `data` is null
 *    or the `selectError` code was `PGRST116`), it proceeds to insert a new record into the `profiles`
 *    table. The new record includes the `clerk_user_id`, `first_name`, and `last_name` obtained from
 *    the Clerk user object.
 * 4. **Error Handling:** Catches and logs errors during both the select and insert operations. If a
 *    database error occurs (other than `PGRST116` during select), the function logs the error and returns `null`.
 *    Unexpected errors are also caught and logged.
 *
 * **Usage Context:**
 * This function is crucial for ensuring that application-specific data associated with a user
 * (stored in the `profiles` table) can be linked back to their authentication identity. It's
 * typically called:
 *   - In middleware after successful authentication for a protected route.
 *   - In API routes handling user-specific actions.
 *   - Potentially in server components that require profile data access.
 *
 * **Security Note:** Uses `supabaseAdmin` client for potentially elevated privileges needed to query
 * or insert into the `profiles` table, especially if RLS policies are restrictive. Ensure this
 * function and the `supabaseAdmin` client are strictly used server-side.
 *
 * @param {string} [userId] - Optional userId from Clerk. If provided, will use this instead of calling currentUser().
 *   This is useful in middleware contexts where auth() has already been called.
 * @returns {Promise<string | null>} A promise that resolves to the Clerk `user.id` if the profile
 *   exists or was successfully created. Returns `null` if there was no authenticated user session
 *   or if any database or unexpected error occurred during the process.
 */
export async function syncUserProfileWithSupabase(userId?: string): Promise<string | null> {
  try {
    // 1. Get the user, either from the provided userId or from currentUser()
    let user: User | null = null;
    
    if (userId) {
      // If userId is provided (likely from middleware), use it directly
      // We'll create a minimal user object with just the id we need
      user = { id: userId } as User;
    } else {
      // Otherwise, call currentUser() as before
      user = await currentUser();
      if (!user) {
        // Log a warning if called without an active session
        console.warn('syncUserProfileWithSupabase called without an authenticated user.');
        return null; // No user to sync
      }
    }

    // 2. Check if a profile already exists for this Clerk user ID using the admin client
    // We use .single() which expects one row or zero. Error code 'PGRST116' specifically means zero rows were found.
    const { data: existingProfile, error: selectError } = await supabaseAdmin
      .from('profiles')
      .select('clerk_user_id') // Only need the ID to check for existence
      .eq('clerk_user_id', user.id)
      .single(); // Expects one or zero rows

    // Handle potential errors during the select query, ignoring the "no rows found" error (PGRST116)
    if (selectError && selectError.code !== 'PGRST116') {
      console.error(`Error checking for existing profile for user ${user.id}:`, selectError);
      return null; // Return null on database error
    }

    // 3. If no profile exists (!existingProfile will be true if selectError code was PGRST116 or data was null)
    if (!existingProfile) {
      console.log(`No existing profile found for user ${user.id}. Creating new profile...`);
      
      // If we only have the userId (without full user object details), just create with minimal data
      const profileData: any = {
        clerk_user_id: user.id, // Link to Clerk user
      };
      
      // If we have the full user object (from currentUser()), add more details
      if ('firstName' in user) {
        profileData.first_name = user.firstName;
        profileData.last_name = user.lastName;
      }
      
      // Create a new profile record in the 'profiles' table
      const { error: insertError } = await supabaseAdmin.from('profiles').insert(profileData);

      // Handle potential errors during the insert operation
      if (insertError) {
        console.error(`Error creating new profile for user ${user.id}:`, insertError);
        return null; // Return null on database error
      }
      console.log(`Successfully created profile for user ${user.id}.`);
    } else {
      // Profile already exists, no action needed
      console.log(`Profile already exists for user ${user.id}. Synchronization not needed.`);
    }

    // 4. Return the user ID upon successful check or creation
    return user.id;

  } catch (error) {
    // Catch any unexpected errors during the process
    console.error('Unexpected error occurred during syncUserProfileWithSupabase:', error);
    return null; // Return null on unexpected errors
  }
}

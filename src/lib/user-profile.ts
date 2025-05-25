import { prisma } from '@/lib/prisma';
import { currentUser, type User } from '@clerk/nextjs/server';

/**
 * @fileoverview Utility function to synchronize Clerk user data with the Prisma 'profiles' table.
 * Ensures that every authenticated Clerk user has a corresponding profile record in the database.
 */

/**
 * Synchronizes the currently authenticated Clerk user's profile with the Prisma `profiles` table.
 *
 * This server-side function ensures data consistency between the authentication provider (Clerk)
 * and the application's database (Prisma). It performs the following steps:
 *
 * 1. **Retrieve User:** Either uses the provided userId or fetches the current user's data from 
 *    Clerk using `currentUser()`. If no user is authenticated in the current server context or 
 *    provided explicitly, the function exits early.
 * 2. **Check Existence:** Queries the `profiles` table using the Prisma client to see if a profile 
 *    record already exists for the `user.id`.
 * 3. **Create Profile (if needed):** If no existing profile is found, it proceeds to insert a new 
 *    record into the `profiles` table. The new record includes the `clerk_user_id`, `first_name`, 
 *    and `last_name` obtained from the Clerk user object.
 * 4. **Error Handling:** Catches and logs errors during both the select and insert operations.
 *
 * **Usage Context:**
 * This function is crucial for ensuring that application-specific data associated with a user
 * (stored in the `profiles` table) can be linked back to their authentication identity. It's
 * typically called:
 *   - In middleware after successful authentication for a protected route.
 *   - In API routes handling user-specific actions.
 *   - Potentially in server components that require profile data access.
 *
 * @param {string} [userId] - Optional userId from Clerk. If provided, will use this instead of calling currentUser().
 *   This is useful in middleware contexts where auth() has already been called.
 * @returns {Promise<string | null>} A promise that resolves to the Clerk `user.id` if the profile
 *   exists or was successfully created. Returns `null` if there was no authenticated user session
 *   or if any database or unexpected error occurred during the process.
 */
export async function syncUserProfileWithPrisma(userId?: string): Promise<string | null> {
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
        console.warn('syncUserProfileWithPrisma called without an authenticated user.');
        return null; // No user to sync
      }
    }

    // 2. Check if a profile already exists for this Clerk user ID using Prisma
    const existingProfile = await prisma.profile.findUnique({
      where: {
        clerkUserId: user.id,
      },
      select: {
        clerkUserId: true,
      },
    });

    // 3. If no profile exists, create one
    if (!existingProfile) {
      console.log(`No existing profile found for user ${user.id}. Creating new profile...`);
      
      // If we only have the userId (without full user object details), just create with minimal data
      const profileData: any = {
        clerkUserId: user.id, // Link to Clerk user
      };
      
      // Profile data only contains clerkUserId - no other fields needed for now
      
      // Create a new profile record in the 'profiles' table
      await prisma.profile.create({
        data: profileData,
      });

      console.log(`Successfully created profile for user ${user.id}.`);
    } else {
      // Profile already exists, no action needed
      console.log(`Profile already exists for user ${user.id}. Synchronization not needed.`);
    }

    // 4. Return the user ID upon successful check or creation
    return user.id;

  } catch (error) {
    // Catch any unexpected errors during the process
    console.error('Unexpected error occurred during syncUserProfileWithPrisma:', error);
    return null; // Return null on unexpected errors
  }
}

// Keep the old function name for backward compatibility
export const syncUserProfileWithSupabase = syncUserProfileWithPrisma;

import { supabaseAdmin } from '@/lib/supabaseClient'
import { currentUser } from '@clerk/nextjs/server'

export async function syncUserProfileWithSupabase() {
  try {
    const user = await currentUser()
    if (!user) return null

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select()
      .eq('clerk_user_id', user.id)
      .single()

    if (!existingProfile) {
      // Create new profile
      await supabaseAdmin.from('profiles').insert({
        clerk_user_id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        // Additional fields will be filled by user later
      })
    }

    return user.id
  } catch (error) {
    console.error('Error syncing user profile:', error)
    return null
  }
}

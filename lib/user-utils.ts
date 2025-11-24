import { SupabaseClient, User } from "@supabase/supabase-js"
import { Database } from "@/app/types/database.types"

/**
 * Creates or updates a user record in the custom users table
 * after successful authentication
 */
export async function createOrUpdateUser(
  supabase: SupabaseClient<Database>,
  authUser: User
): Promise<{ isNewUser: boolean }> {
  try {
    console.log('🔄 Processing user authentication data:', {
      id: authUser.id,
      email: authUser.email,
      provider: authUser.app_metadata?.provider,
      metadata: authUser.user_metadata
    })

    const userData: Database['public']['Tables']['users']['Insert'] = {
      id: authUser.id,
      email: authUser.email || '',
      display_name: authUser.user_metadata?.full_name || 
                   authUser.user_metadata?.name || 
                   authUser.user_metadata?.display_name ||
                   null,
      profile_image: authUser.user_metadata?.avatar_url || 
                     authUser.user_metadata?.picture || 
                     null,
      anonymous: false,
      premium: false,
      tier: 'basic' as const,
      credits: 50,
      message_count: 0,
      daily_message_count: 0,
      daily_pro_message_count: 0,
      last_active_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    console.log('📝 Checking if user already exists...')

    // First check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, created_at')
      .eq('id', authUser.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('❌ Error checking existing user:', checkError)
      throw checkError
    }

    const isNewUser = !existingUser
    console.log(`👤 User status: ${isNewUser ? 'NEW USER' : 'EXISTING USER'}`)

    console.log('📝 Inserting/updating user data:', userData)

    // Use upsert to create or update the user record
    const { data, error } = await supabase
      .from('users')
      .upsert(userData as any, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error('❌ Database error creating/updating user:', error)
      throw error
    }

    console.log(`✅ User record successfully ${isNewUser ? 'created' : 'updated'}:`, {
      id: userData.id,
      email: userData.email,
      display_name: userData.display_name,
      tier: userData.tier,
      provider: authUser.app_metadata?.provider,
      created_at: userData.created_at,
      isNewUser
    })

    // Log the returned data to confirm the operation
    if (data && data.length > 0) {
      console.log('📊 Database returned user data:', data[0])
    }

    return { isNewUser }
  } catch (error) {
    console.error('❌ Failed to create/update user:', error)
    throw error
  }
}

/**
 * Extracts first and last name from full name
 */
export function parseFullName(fullName: string | null): {
  firstName: string | null
  lastName: string | null
} {
  if (!fullName) {
    return { firstName: null, lastName: null }
  }

  const nameParts = fullName.trim().split(' ')
  const firstName = nameParts[0] || null
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null

  return { firstName, lastName }
}

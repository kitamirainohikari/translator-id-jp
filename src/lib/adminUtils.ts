
import { supabase } from '@/lib/supabase'

export const setUserAsAdmin = async (email: string) => {
  try {
    // Pertama, cari user berdasarkan email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('Error fetching users:', userError)
      return { success: false, error: userError.message }
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      console.error('User not found:', email)
      return { success: false, error: 'User not found' }
    }

    // Check if user already has admin role
    const { data: existingRole, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()

    if (existingRole) {
      console.log('User already has admin role')
      return { success: true, message: 'User already has admin role' }
    }

    // Insert admin role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role: 'admin'
      })

    if (insertError) {
      console.error('Error inserting admin role:', insertError)
      return { success: false, error: insertError.message }
    }

    console.log('Successfully set user as admin:', email)
    return { success: true, message: 'User successfully set as admin' }
    
  } catch (error) {
    console.error('Unexpected error setting admin role:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}

// Helper function to check if current user is admin
export const checkIsCurrentUserAdmin = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return false
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking admin status:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

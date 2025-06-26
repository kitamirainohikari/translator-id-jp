
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type AppRole = 'admin' | 'user'

interface UserRole {
  id: string
  user_id: string
  role: AppRole
  created_at: string
}

export const useUserRole = (user: User | null) => {
  const [userRole, setUserRole] = useState<AppRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null)
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error)
        }

        setUserRole(data?.role || 'user')
      } catch (error) {
        console.error('Unexpected error fetching user role:', error)
        setUserRole('user')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  const isAdmin = userRole === 'admin'
  const hasRole = (role: AppRole) => userRole === role

  return {
    userRole,
    isAdmin,
    hasRole,
    isLoading
  }
}

export default useUserRole

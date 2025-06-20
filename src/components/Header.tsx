
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { LogIn, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import AuthModal from './AuthModal'
import { QuickThemeToggle } from './QuickThemeToggle'
import ApiSettings from './ApiSettings'
import UserProfile from './UserProfile'
import AdminSettings from './AdminSettings'
import AnimatedTitle from './AnimatedTitle'

const Header = () => {
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Login Berhasil!",
            description: `Selamat datang, ${session?.user?.email}`
          })
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout Berhasil",
            description: "Sampai jumpa lagi!"
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [toast])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
        throw error
      }
    } catch (error) {
      console.error('Unexpected logout error:', error)
      toast({
        title: "Error",
        description: "Gagal logout. Coba lagi.",
        variant: "destructive"
      })
    }
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sakura-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  <AnimatedTitle /> Translator
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Indonesia ⇄ Jepang</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <AdminSettings />
              <ApiSettings />
              <QuickThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <UserProfile user={user} />
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
}

export default Header

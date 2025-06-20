import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import GoogleAuthButton from './GoogleAuthButton'
import ResetPasswordModal from './ResetPasswordModal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (isSignUp: boolean) => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Email dan password harus diisi",
        variant: "destructive"
      })
      return false
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Error",
        description: "Format email tidak valid",
        variant: "destructive"
      })
      return false
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error", 
        description: "Password minimal 6 karakter",
        variant: "destructive"
      })
      return false
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Konfirmasi password tidak cocok",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSignUp = async () => {
    if (!validateForm(true)) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      })

      if (error) {
        console.error('Signup error:', error)
        if (error.message.includes('User already registered')) {
          toast({
            title: "Akun Sudah Ada",
            description: "Email sudah terdaftar. Silakan login.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Gagal Mendaftar",
            description: error.message,
            variant: "destructive"
          })
        }
      } else {
        console.log('Signup successful:', data)
        toast({
          title: "Berhasil Mendaftar!",
          description: data.user?.email_confirmed_at ? "Akun berhasil dibuat dan langsung aktif" : "Silakan cek email untuk konfirmasi akun"
        })
        
        if (data.user?.email_confirmed_at || data.session) {
          onClose()
          setFormData({ email: '', password: '', confirmPassword: '' })
        }
      }
    } catch (error) {
      console.error('Unexpected signup error:', error)
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal membuat akun. Coba lagi.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!validateForm(false)) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        console.error('Login error:', error)
        
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Login Gagal",
            description: "Email atau password salah",
            variant: "destructive"
          })
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Belum Dikonfirmasi",
            description: "Silakan cek email dan klik link konfirmasi",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Login Gagal",
            description: error.message,
            variant: "destructive"
          })
        }
      } else {
        console.log('Login successful:', data)
        toast({
          title: "Login Berhasil!",
          description: "Selamat datang kembali"
        })
        onClose()
        setFormData({ email: '', password: '', confirmPassword: '' })
      }
    } catch (error) {
      console.error('Unexpected login error:', error)
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal login. Coba lagi.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Masuk ke CodeParcel Translator
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-600 dark:text-gray-400">
              Login atau daftar untuk menyimpan riwayat terjemahan
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              {/* Google Login */}
              <GoogleAuthButton />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau dengan email
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => setShowResetModal(true)}
                >
                  Lupa password?
                </Button>
              </div>

              <Button 
                onClick={handleSignIn} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Login'}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              {/* Google Signup */}
              <GoogleAuthButton />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau dengan email
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Ulangi password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSignUp} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Daftar Akun'}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ResetPasswordModal 
        isOpen={showResetModal} 
        onClose={() => setShowResetModal(false)} 
      />
    </>
  )
}

export default AuthModal

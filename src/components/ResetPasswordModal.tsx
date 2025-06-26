
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

const ResetPasswordModal = ({ isOpen, onClose }: ResetPasswordModalProps) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email harus diisi",
        variant: "destructive"
      })
      return
    }

    if (!email.includes('@')) {
      toast({
        title: "Error",
        description: "Format email tidak valid",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)
      toast({
        title: "Email Reset Terkirim!",
        description: "Silakan cek email Anda untuk link reset password"
      })
    } catch (error) {
      console.error('Reset password error:', error)
      toast({
        title: "Gagal Reset Password",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setIsSuccess(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Reset Password
          </DialogTitle>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Masukkan email Anda untuk menerima link reset password
            </p>

            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleResetPassword} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Mengirim...' : 'Kirim Email Reset'}
              </Button>
              <Button onClick={handleClose} variant="outline" className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Email Terkirim!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Kami telah mengirim link reset password ke <strong>{email}</strong>
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Tutup
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordModal

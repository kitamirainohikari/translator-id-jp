
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Calendar, Save, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

interface UserProfileProps {
  user: SupabaseUser
}

const UserProfile = ({ user }: UserProfileProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || '',
    avatar_url: user.user_metadata?.avatar_url || '',
    created_at: user.created_at
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        }
      })

      if (error) throw error

      toast({
        title: "Profil Tersimpan",
        description: "Data profil Anda berhasil diperbarui"
      })

      setIsOpen(false)
    } catch (error) {
      console.error('Profile update error:', error)
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan profil",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-xs">
              {profile.full_name ? getInitials(profile.full_name) : getInitials(profile.email)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">Profil</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Pengaturan Profil</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-lg font-bold">
                  {profile.full_name ? getInitials(profile.full_name) : getInitials(profile.email)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                onClick={() => toast({
                  title: "Fitur Segera Hadir",
                  description: "Upload foto profil akan tersedia dalam update berikutnya"
                })}
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Profile Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="pl-10 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <p className="text-xs text-gray-500">Email tidak dapat diubah</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullname">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={profile.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bergabung Sejak</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    value={formatDate(profile.created_at)}
                    disabled
                    className="pl-10 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Simpan</span>
                </div>
              )}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserProfile

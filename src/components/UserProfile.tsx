
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Calendar, Save, Camera, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { compressImage, generateAvatarUrl, getCachedAvatarUrl, clearAvatarCache } from '@/utils/imageUtils'

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load current avatar if exists
    if (profile.avatar_url && !profile.avatar_url.startsWith('blob:')) {
      loadCurrentAvatar()
    }
  }, [profile.avatar_url])

  const loadCurrentAvatar = async () => {
    try {
      const avatarPath = generateAvatarUrl(user.id)
      const { data } = supabase.storage.from('avatars').getPublicUrl(avatarPath)
      
      if (data?.publicUrl) {
        const cachedUrl = getCachedAvatarUrl(user.id, data.publicUrl)
        setProfile(prev => ({ ...prev, avatar_url: cachedUrl }))
      }
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.error('Error loading avatar:', error)
      }
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: "File Tidak Valid",
        description: "Pilih file gambar (JPG, PNG, WebP)",
        variant: "destructive"
      })
      return
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: "File Terlalu Besar", 
        description: "Ukuran file maksimal 2MB",
        variant: "destructive"
      })
      return
    }

    setSelectedFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarUpload = async () => {
    if (!selectedFile) return

    setIsUploadingAvatar(true)
    try {
      // Compress image
      const compressedBlob = await compressImage(selectedFile)
      
      // Delete old avatar if exists
      const avatarPath = generateAvatarUrl(user.id)
      await supabase.storage.from('avatars').remove([avatarPath])

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(avatarPath, compressedBlob, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(avatarPath)
      
      if (data?.publicUrl) {
        // Clear cache and update profile
        clearAvatarCache(user.id)
        const newAvatarUrl = `${data.publicUrl}?t=${Date.now()}` // Cache bust
        
        // Update auth metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: newAvatarUrl }
        })

        if (updateError) throw updateError

        setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }))
        setSelectedFile(null)
        setPreviewUrl(null)

        toast({
          title: "Avatar Berhasil Diperbarui",
          description: "Foto profil Anda telah tersimpan"
        })
      }
    } catch (error) {
      if (import.meta.env.MODE === 'development') {
        console.error('Avatar upload error:', error)
      }
      toast({
        title: "Gagal Upload Avatar",
        description: "Terjadi kesalahan saat mengupload foto",
        variant: "destructive"
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const cancelAvatarSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

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
      if (import.meta.env.MODE === 'development') {
        console.error('Profile update error:', error)
      }
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
                <AvatarImage src={previewUrl || profile.avatar_url} />
                <AvatarFallback className="text-lg font-bold">
                  {profile.full_name ? getInitials(profile.full_name) : getInitials(profile.email)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Avatar Upload Controls */}
            <div className="flex flex-col items-center space-y-2">
              {!selectedFile ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Label htmlFor="avatar-upload">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      asChild
                    >
                      <span className="flex items-center space-x-2">
                        <Camera className="w-4 h-4" />
                        <span>Ganti Foto</span>
                      </span>
                    </Button>
                  </Label>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    {isUploadingAvatar ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Upload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={cancelAvatarSelection}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-gray-500 text-center">
                Max 2MB • JPG, PNG, WebP<br/>
                Akan dioptimalkan ke 300x300px
              </p>
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
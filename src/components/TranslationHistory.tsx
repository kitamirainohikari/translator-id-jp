
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { History, Trash2, Copy, Volume2, Calendar, LogIn, UserPlus, Lock } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import AuthModal from './AuthModal'

interface Translation {
  id: string
  input_text: string
  output_text: string
  romaji?: string
  jlpt_level?: string
  translation_direction: 'id_to_jp' | 'jp_to_id'
  created_at: string
}

const TranslationHistory = () => {
  const [user, setUser] = useState<User | null>(null)
  const [translations, setTranslations] = useState<Translation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          fetchTranslations(session.user.id)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error getting user session:', error)
        setIsLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchTranslations(session.user.id)
      } else {
        setTranslations([])
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchTranslations = async (userId: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setTranslations(data || [])
    } catch (error) {
      console.error('Error fetching translations:', error)
      toast({
        title: "Gagal Memuat Riwayat",
        description: "Terjadi kesalahan saat memuat riwayat terjemahan",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTranslations(prev => prev.filter(t => t.id !== id))
      toast({
        title: "Terhapus",
        description: "Riwayat terjemahan berhasil dihapus"
      })
    } catch (error) {
      console.error('Error deleting translation:', error)
      toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus riwayat",
        variant: "destructive"
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Tersalin!",
      description: "Teks berhasil disalin ke clipboard"
    })
  }

  const handleSpeak = (text: string, language: 'ja-JP' | 'id-ID') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Login Diperlukan
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Untuk melihat dan mengelola riwayat terjemahan Anda, silakan login terlebih dahulu
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Sekarang</span>
              </Button>
              
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Buat Akun Baru</span>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <History className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Simpan Riwayat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Simpan semua terjemahan Anda
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Copy className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Akses Mudah</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Akses dari perangkat mana saja
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Volume2 className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Putar Ulang</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Dengarkan audio kapan saja
                </p>
              </div>
            </div>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Memuat riwayat terjemahan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Riwayat Terjemahan
          </h2>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{translations.length} item</span>
        </Badge>
      </div>

      {translations.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <History className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Belum Ada Riwayat
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Mulai terjemahkan teks untuk melihat riwayat di sini. Semua terjemahan yang disimpan akan muncul dalam daftar ini.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {translations.map((translation) => (
            <Card key={translation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={translation.translation_direction === 'id_to_jp' ? 'default' : 'secondary'}>
                      {translation.translation_direction === 'id_to_jp' ? 'ID → JP' : 'JP → ID'}
                    </Badge>
                    {translation.jlpt_level && (
                      <Badge variant="outline">
                        JLPT {translation.jlpt_level}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {formatDate(translation.created_at)}
                    </span>
                    <Button
                      onClick={() => handleDelete(translation.id)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Input</h4>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => handleCopy(translation.input_text)}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleSpeak(
                            translation.input_text, 
                            translation.translation_direction === 'id_to_jp' ? 'id-ID' : 'ja-JP'
                          )}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded border">
                      {translation.input_text}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Output</h4>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => handleCopy(translation.output_text)}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleSpeak(
                            translation.output_text, 
                            translation.translation_direction === 'id_to_jp' ? 'ja-JP' : 'id-ID'
                          )}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className={`text-sm bg-blue-50 dark:bg-blue-900 p-3 rounded border ${
                      translation.translation_direction === 'id_to_jp' ? 'japanese-text' : ''
                    }`}>
                      {translation.output_text}
                    </p>
                    {translation.romaji && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        Romaji: {translation.romaji}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default TranslationHistory

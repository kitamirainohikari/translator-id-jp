import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeftRight, Copy, Save, RotateCcw, Keyboard } from 'lucide-react'
import { translateToJapanese, translateToIndonesian, TranslationResult, ReverseTranslationResult } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import EnhancedVirtualKeyboard from './EnhancedVirtualKeyboard'
import TextToSpeechWithHighlight from './TextToSpeechWithHighlight'
import DraggableKeyboard from './DraggableKeyboard'

type TranslationDirection = 'id_to_jp' | 'jp_to_id'

const TranslatorForm = () => {
  const [inputText, setInputText] = useState('')
  const [outputResult, setOutputResult] = useState<TranslationResult | ReverseTranslationResult | null>(null)
  const [direction, setDirection] = useState<TranslationDirection>('id_to_jp')
  const [isTranslating, setIsTranslating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [user, setUser] = useState(null)
  const [apiProvider, setApiProvider] = useState<'openai' | 'google' | 'deepl' | 'libretranslate' | 'mymemory' | 'lingva' | 'argos'>('libretranslate')
  const [apiKey, setApiKey] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const savedProvider = localStorage.getItem('translation-provider') as any
    const savedKeys = localStorage.getItem('translation-api-keys')
    
    if (savedProvider) {
      setApiProvider(savedProvider)
    }
    
    if (savedKeys) {
      try {
        const keys = JSON.parse(savedKeys)
        setApiKey(keys[savedProvider] || '')
      } catch (error) {
        console.error('Error loading API settings:', error)
      }
    }
  }, [])

  const handleApiSettingsChange = (provider: any, key: string) => {
    setApiProvider(provider)
    setApiKey(key)
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Peringatan",
        description: "Silakan masukkan teks yang ingin diterjemahkan",
        variant: "destructive"
      })
      return
    }

    const freeServices = ['libretranslate', 'mymemory', 'lingva', 'argos']
    if (!freeServices.includes(apiProvider) && !apiKey) {
      toast({
        title: "API Key Diperlukan",
        description: "Silakan atur API key di pengaturan terlebih dahulu",
        variant: "destructive"
      })
      return
    }

    setIsTranslating(true)
    setProgress(0)
    setOutputResult(null)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      let result: TranslationResult | ReverseTranslationResult

      if (direction === 'id_to_jp') {
        result = await translateToJapanese(inputText, apiProvider, apiKey)
      } else {
        result = await translateToIndonesian(inputText, apiProvider, apiKey)
      }

      setOutputResult(result)
      setProgress(100)

      setTimeout(() => {
        setProgress(0)
      }, 1000)

      toast({
        title: "Berhasil!",
        description: `Terjemahan selesai via ${apiProvider.toUpperCase()}`
      })

    } catch (error) {
      console.error('Translation error:', error)
      toast({
        title: "Terjadi Kesalahan",
        description: error instanceof Error ? error.message : "Gagal menerjemahkan teks. Silakan coba lagi.",
        variant: "destructive"
      })
    } finally {
      clearInterval(progressInterval)
      setIsTranslating(false)
    }
  }

  const handleSwapDirection = () => {
    const newDirection = direction === 'id_to_jp' ? 'jp_to_id' : 'id_to_jp'
    setDirection(newDirection)
    
    if (outputResult && inputText) {
      const currentOutput = direction === 'id_to_jp' 
        ? (outputResult as TranslationResult).japaneseText || (outputResult as TranslationResult).translation
        : (outputResult as ReverseTranslationResult).indonesianText
      
      setInputText(currentOutput)
      setOutputResult(null)
    }
  }

  const handleReset = () => {
    setInputText('')
    setOutputResult(null)
    setProgress(0)
  }

  const handleCopyResult = () => {
    if (!outputResult) return

    const textToCopy = direction === 'id_to_jp' 
      ? (outputResult as TranslationResult).japaneseText || (outputResult as TranslationResult).translation
      : (outputResult as ReverseTranslationResult).indonesianText

    navigator.clipboard.writeText(textToCopy)
    toast({
      title: "Tersalin!",
      description: "Hasil terjemahan telah disalin ke clipboard"
    })
  }

  const handleSaveHistory = async () => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk menyimpan riwayat",
        variant: "destructive"
      })
      return
    }

    if (!outputResult || !inputText) {
      toast({
        title: "Tidak Ada Data",
        description: "Belum ada terjemahan yang bisa disimpan",
        variant: "destructive"
      })
      return
    }

    try {
      const outputText = direction === 'id_to_jp' 
        ? (outputResult as TranslationResult).japaneseText || (outputResult as TranslationResult).translation
        : (outputResult as ReverseTranslationResult).indonesianText

      const romaji = 'romaji' in outputResult ? outputResult.romaji : null
      const jlptLevel = outputResult.jlptLevel

      const { error } = await supabase
        .from('translations')
        .insert([{
          user_id: user.id,
          input_text: inputText,
          output_text: outputText,
          romaji: romaji,
          jlpt_level: jlptLevel,
          translation_direction: direction
        }])

      if (error) throw error

      toast({
        title: "Tersimpan!",
        description: "Terjemahan telah disimpan ke riwayat"
      })
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan riwayat",
        variant: "destructive"
      })
    }
  }

  const handleKeyboardInput = (char: string) => {
    if (char === '\n') {
      setInputText(prev => prev + '\n')
    } else {
      setInputText(prev => prev + char)
    }
    
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Direction Selector */}
      <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {direction === 'id_to_jp' ? 'Indonesia' : 'Jepang'}
        </span>
        <Button
          onClick={handleSwapDirection}
          variant="outline"
          size="sm"
          className="p-2 hover:scale-105 transition-transform"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </Button>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {direction === 'id_to_jp' ? 'Jepang' : 'Indonesia'}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Input ({direction === 'id_to_jp' ? 'Indonesia' : 'Jepang'})
            </h3>
            {direction === 'jp_to_id' && (
              <Button
                onClick={() => setShowKeyboard(!showKeyboard)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Keyboard className="w-4 h-4" />
                <span>Keyboard</span>
              </Button>
            )}
          </div>

          <Textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              direction === 'id_to_jp' 
                ? "Masukkan teks dalam Bahasa Indonesia..."
                : "日本語のテキストを入力してください..."
            }
            className="min-h-[120px] resize-none text-base"
          />

          {showKeyboard && direction === 'jp_to_id' && (
            <EnhancedVirtualKeyboard
              onKeyPress={handleKeyboardInput}
              className="mt-4"
            />
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || !inputText.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isTranslating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menerjemahkan...</span>
                </div>
              ) : (
                'Terjemahkan'
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-4"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {progress > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Output ({direction === 'id_to_jp' ? 'Jepang' : 'Indonesia'})
          </h3>

          <div className="min-h-[120px] p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            {outputResult ? (
              <div className="space-y-3">
                <TextToSpeechWithHighlight
                  text={direction === 'id_to_jp' 
                    ? (outputResult as TranslationResult).japaneseText || (outputResult as TranslationResult).translation
                    : (outputResult as ReverseTranslationResult).indonesianText
                  }
                  romaji={'romaji' in outputResult ? outputResult.romaji : undefined}
                  language={direction === 'id_to_jp' ? 'ja-JP' : 'id-ID'}
                />
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                      JLPT {outputResult.jlptLevel}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      via {apiProvider.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 italic">
                Hasil terjemahan akan muncul di sini...
              </div>
            )}
          </div>

          {outputResult && (
            <div className="flex space-x-2">
              <Button
                onClick={handleCopyResult}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </Button>
              <Button
                onClick={handleSaveHistory}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TranslatorForm

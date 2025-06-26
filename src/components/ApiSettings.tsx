
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Settings, Key, CheckCircle, Zap } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export type ApiProvider = 'openai' | 'google' | 'deepl' | 'libretranslate' | 'mymemory' | 'lingva' | 'argos' | 'auto'

interface ApiSettingsProps {
  onApiChange?: (provider: ApiProvider, apiKey: string) => void
}

const ApiSettings = ({ onApiChange }: ApiSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<ApiProvider>('libretranslate')
  const [autoMode, setAutoMode] = useState(false)
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    google: '',
    deepl: '',
    mymemory: '',
    lingva: '',
    libretranslate: '',
    argos: '',
    auto: ''
  })
  const [isSaved, setIsSaved] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedProvider = localStorage.getItem('translation-provider') as ApiProvider
    const savedKeys = localStorage.getItem('translation-api-keys')
    const savedAutoMode = localStorage.getItem('translation-auto-mode') === 'true'
    
    if (savedProvider) {
      setSelectedProvider(savedProvider)
    }
    
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys)
        setApiKeys({ ...apiKeys, ...parsedKeys })
        setIsSaved(true)
      } catch (error) {
        console.error('Error parsing saved API keys:', error)
      }
    }

    setAutoMode(savedAutoMode)
  }, [])

  const handleProviderChange = (provider: ApiProvider) => {
    setSelectedProvider(provider)
    if (provider === 'auto') {
      setAutoMode(true)
    } else {
      setAutoMode(false)
    }
    console.log('Provider changed to:', provider)
  }

  const handleAutoModeChange = (checked: boolean) => {
    setAutoMode(checked)
    if (checked) {
      setSelectedProvider('auto')
    } else {
      setSelectedProvider('libretranslate')
    }
  }

  const handleApiKeyChange = (provider: ApiProvider, key: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: key
    }))
    console.log(`API key for ${provider} updated`)
  }

  const handleSave = () => {
    const freeServices: ApiProvider[] = ['libretranslate', 'mymemory', 'lingva', 'argos', 'auto']
    
    if (!freeServices.includes(selectedProvider) && !apiKeys[selectedProvider]) {
      toast({
        title: "API Key Diperlukan",
        description: `Silakan masukkan API key untuk ${selectedProvider.toUpperCase()}`,
        variant: "destructive"
      })
      return
    }

    localStorage.setItem('translation-provider', selectedProvider)
    localStorage.setItem('translation-api-keys', JSON.stringify(apiKeys))
    localStorage.setItem('translation-auto-mode', autoMode.toString())

    if (onApiChange) {
      onApiChange(selectedProvider, apiKeys[selectedProvider])
    }

    setIsSaved(true)
    
    toast({
      title: "Pengaturan Tersimpan",
      description: autoMode 
        ? "Mode Auto diaktifkan - sistem akan memilih API terbaik"
        : `API ${selectedProvider.toUpperCase()} berhasil diatur`
    })

    console.log('Settings saved:', { provider: selectedProvider, autoMode, hasKey: !!apiKeys[selectedProvider] })
    setIsOpen(false)
  }

  const getProviderName = (provider: ApiProvider) => {
    switch (provider) {
      case 'openai': return 'OpenAI GPT'
      case 'google': return 'Google Translate'
      case 'deepl': return 'DeepL'
      case 'mymemory': return 'MyMemory (Free)'
      case 'lingva': return 'Lingva (Free)'
      case 'libretranslate': return 'LibreTranslate (Free)'
      case 'argos': return 'Argos Translate (Free)'
      case 'auto': return 'Mode Auto (Smart)'
      default: return provider
    }
  }

  const isProviderFree = (provider: ApiProvider) => {
    return ['mymemory', 'lingva', 'libretranslate', 'argos', 'auto'].includes(provider)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 relative">
          <Settings className="w-4 h-4" />
          <span>API</span>
          {isSaved && (
            <CheckCircle className="w-3 h-3 text-green-500 absolute -top-1 -right-1" />
          )}
          {autoMode && (
            <Zap className="w-3 h-3 text-yellow-500 absolute -top-1 -left-1" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Pengaturan API Terjemahan</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Auto Mode Checkbox */}
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Checkbox
              id="auto-mode"
              checked={autoMode}
              onCheckedChange={handleAutoModeChange}
            />
            <div className="flex-1">
              <Label htmlFor="auto-mode" className="text-sm font-medium cursor-pointer">
                🤖 Mode Auto (Pintar)
              </Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Sistem akan memilih API terbaik secara otomatis berdasarkan prioritas
              </p>
            </div>
          </div>

          {!autoMode && (
            <div className="space-y-2">
              <Label htmlFor="provider">Provider API</Label>
              <Select value={selectedProvider} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih provider API" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mymemory">🆓 MyMemory (Free)</SelectItem>
                  <SelectItem value="lingva">🆓 Lingva (Free)</SelectItem>
                  <SelectItem value="libretranslate">🆓 LibreTranslate (Free)</SelectItem>
                  <SelectItem value="argos">🆓 Argos Translate (Free)</SelectItem>
                  <SelectItem value="openai">🤖 OpenAI GPT (Paid)</SelectItem>
                  <SelectItem value="google">🌐 Google Translate (Paid)</SelectItem>
                  <SelectItem value="deepl">🔤 DeepL (Paid)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {!autoMode && !isProviderFree(selectedProvider) && (
            <div className="space-y-2">
              <Label htmlFor="apikey">API Key untuk {getProviderName(selectedProvider)}</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="apikey"
                  type="password"
                  placeholder={`Masukkan API key ${selectedProvider.toUpperCase()}`}
                  className="pl-10"
                  value={apiKeys[selectedProvider]}
                  onChange={(e) => handleApiKeyChange(selectedProvider, e.target.value)}
                />
              </div>
            </div>
          )}

          {(autoMode || isProviderFree(selectedProvider)) && (
            <div className="text-xs text-green-600 dark:text-green-400 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p><strong>✅ {autoMode ? 'Mode Auto Aktif!' : 'Layanan Gratis!'}</strong></p>
              <p>
                {autoMode 
                  ? 'Sistem akan otomatis memilih API terbaik berdasarkan prioritas yang telah diatur admin.'
                  : 'Provider ini tidak memerlukan API key dan dapat digunakan secara gratis.'
                }
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p><strong>Rekomendasi:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li><strong>Mode Auto:</strong> Sistem pilih API terbaik otomatis</li>
              <li><strong>MyMemory:</strong> Gratis 1000 karakter/hari</li>
              <li><strong>LibreTranslate:</strong> Open source, gratis tanpa batas</li>
              <li><strong>OpenAI:</strong> Terjemahan paling akurat dengan konteks</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Simpan Pengaturan
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ApiSettings

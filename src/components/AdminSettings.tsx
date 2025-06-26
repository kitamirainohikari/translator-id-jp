
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Settings, GripVertical, Eye, EyeOff, Shield, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import useUserRole from '@/hooks/useUserRole'

export type ApiProvider = 'openai' | 'google' | 'deepl' | 'libretranslate' | 'mymemory' | 'lingva' | 'argos'

interface ApiConfig {
  id: ApiProvider
  name: string
  enabled: boolean
  apiKey: string
  isFree: boolean
  order: number
}

const AdminSettings = () => {
  const [user, setUser] = useState<User | null>(null)
  const { isAdmin, isLoading } = useUserRole(user)
  const [isOpen, setIsOpen] = useState(false)
  const [apis, setApis] = useState<ApiConfig[]>([
    { id: 'mymemory', name: 'MyMemory (Free)', enabled: true, apiKey: '', isFree: true, order: 1 },
    { id: 'lingva', name: 'Lingva (Free)', enabled: true, apiKey: '', isFree: true, order: 2 },
    { id: 'libretranslate', name: 'LibreTranslate (Free)', enabled: true, apiKey: '', isFree: true, order: 3 },
    { id: 'argos', name: 'Argos Translate (Free)', enabled: true, apiKey: '', isFree: true, order: 4 },
    { id: 'openai', name: 'OpenAI GPT', enabled: false, apiKey: '', isFree: false, order: 5 },
    { id: 'google', name: 'Google Translate', enabled: false, apiKey: '', isFree: false, order: 6 },
    { id: 'deepl', name: 'DeepL', enabled: false, apiKey: '', isFree: false, order: 7 }
  ])
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({})
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const savedApis = localStorage.getItem('admin-api-configs')
    if (savedApis) {
      try {
        setApis(JSON.parse(savedApis))
      } catch (error) {
        console.error('Error loading admin API configs:', error)
      }
    }
  }, [])

  // Show loading while checking admin status
  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className="flex items-center space-x-2">
        <Settings className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    )
  }

  // Only show button if user is admin
  if (!isAdmin) {
    return null
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(apis)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const reorderedApis = items.map((item, index) => ({
      ...item,
      order: index + 1
    }))

    setApis(reorderedApis)
  }

  const toggleApiEnabled = (apiId: ApiProvider) => {
    setApis(prev => prev.map(api => 
      api.id === apiId ? { ...api, enabled: !api.enabled } : api
    ))
  }

  const updateApiKey = (apiId: ApiProvider, key: string) => {
    setApis(prev => prev.map(api => 
      api.id === apiId ? { ...api, apiKey: key } : api
    ))
  }

  const toggleShowKey = (apiId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [apiId]: !prev[apiId]
    }))
  }

  const handleSave = () => {
    localStorage.setItem('admin-api-configs', JSON.stringify(apis))
    toast({
      title: "Konfigurasi Tersimpan",
      description: "Pengaturan API administrator berhasil disimpan"
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
          <Shield className="w-4 h-4" />
          <span>Super Admin</span>
          <Lock className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Pengaturan API Super Administrator</span>
            <Lock className="w-4 h-4 text-red-600" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p><strong>⚠️ Akses Terbatas:</strong> Halaman ini hanya dapat diakses oleh Super Administrator aplikasi.</p>
            <p><strong>Info:</strong> Drag & drop untuk mengurutkan prioritas API. Sistem akan mencoba API dari atas ke bawah saat mode auto aktif.</p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="apis">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {apis.sort((a, b) => a.order - b.order).map((api, index) => (
                    <Draggable key={api.id} draggableId={api.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div {...provided.dragHandleProps} className="cursor-grab">
                                  <GripVertical className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                  <CardTitle className="text-base">{api.name}</CardTitle>
                                  <p className="text-xs text-gray-500">Urutan: {api.order}</p>
                                </div>
                              </div>
                              <Switch
                                checked={api.enabled}
                                onCheckedChange={() => toggleApiEnabled(api.id)}
                              />
                            </div>
                          </CardHeader>
                          
                          {!api.isFree && (
                            <CardContent className="pt-0">
                              <div className="space-y-2">
                                <Label htmlFor={`key-${api.id}`}>API Key</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    id={`key-${api.id}`}
                                    type={showKeys[api.id] ? "text" : "password"}
                                    placeholder={`Masukkan API key ${api.name}`}
                                    value={api.apiKey}
                                    onChange={(e) => updateApiKey(api.id, e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleShowKey(api.id)}
                                  >
                                    {showKeys[api.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex-1 bg-red-600 hover:bg-red-700">
              Simpan Konfigurasi
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

export default AdminSettings

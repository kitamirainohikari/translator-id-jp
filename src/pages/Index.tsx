import { useState } from 'react'
import Header from '@/components/Header'
import TranslatorForm from '@/components/TranslatorForm'
import TranslationHistory from '@/components/TranslationHistory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Languages, History, Globe, BookOpen, Users, Zap } from 'lucide-react'
import AnimatedTitle from '@/components/AnimatedTitle'

const Index = () => {
  const [activeTab, setActiveTab] = useState('translator')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sakura-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <AnimatedTitle /> <span className="text-blue-600">Translator</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Aplikasi translate Indonesia ⇄ Jepang dengan AI yang mendukung level JLPT N5-N3
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Translate 2 Arah</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>JLPT N5-N3</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="translator" className="flex items-center space-x-2">
              <Languages className="w-4 h-4" />
              <span>Translator</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translator">
            <TranslatorForm />
          </TabsContent>

          <TabsContent value="history">
            <TranslationHistory />
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Fitur Unggulan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Translate 2 Arah</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Indonesia ke Jepang dan sebaliknya dengan akurasi tinggi menggunakan AI
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-sakura-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-sakura-200 dark:border-pink-700">
              <div className="w-12 h-12 bg-gradient-to-br from-sakura-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Level JLPT</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Otomatis mendeteksi level kesulitan N5, N4, atau N3 untuk membantu pembelajaran
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Untuk Pekerja Migran</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Dirancang khusus untuk membantu calon pekerja migran Indonesia ke Jepang
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            © 2024 CodeParcel Translator. Dibuat dengan ❤️ untuk calon pekerja migran Indonesia
          </p>
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Catatan:</strong> Gunakan pengaturan API untuk mengatur provider terjemahan atau aktifkan mode auto untuk pengalaman terbaik.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Index

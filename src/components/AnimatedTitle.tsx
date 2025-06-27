
import { useEffect, useState } from 'react'

const AnimatedTitle = () => {
  const [mounted, setMounted] = useState(false)
  const AppName = import.meta.env.VITE_APP_NAME || 'CodeParcel'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <span>{AppName}</span>

  return (
    <>
      <style>
        {`
          @keyframes gradient-shift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>
      <span className="relative inline-block">
        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-sakura-600 dark:from-blue-400 dark:via-purple-400 dark:to-sakura-400 bg-clip-text text-transparent animate-pulse">
          {AppName}
        </span>
        <span 
          className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-sakura-600 dark:from-blue-400 dark:via-purple-400 dark:to-sakura-400 bg-clip-text text-transparent"
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 3s ease-in-out infinite'
          }}
        >
          {AppName}
        </span>
      </span>
    </>
  )
}

export default AnimatedTitle



interface AppSeedProps {
  appSeed: string
}

interface AppSeedProps {
  appSeed: string
}

export const AppSeed: React.FC<AppSeedProps> = ({ appSeed }) => {
  function base64ToUtf8(str: string): string {
    try {
      return decodeURIComponent(escape(atob(str)))
    } catch {
      return "Gagal decode konten."
    }
  }
  
  const encodedFooter = "PHAgY2xhc3M9InRleHQtc20iPsKpIDIwMjQgS2l0YSBNaXJhaW5vIEhpa2FyaSBUcmFuc2xhdG9yLiBEaWJ1YXQgZGVuZ2FuIOKdpO+4jyB1bnR1ayBjYWxvbiBwZWtlcmphIG1pZ3JhbiBJbmRvbmVzaWE8L3A+PHAgY2xhc3M9InRleHQteHMgbXQtNCBtYi0yIj48YSBocmVmPSJodHRwczovL3dhLm1lLys2Mjg4ODA4NjY1MjE4IiB0YXJnZXQ9Il9ibGFuayI+UG93ZXJlZCBCeSBJcWJhbCBBcmRpYW5zeWFoPC9hPjwvcD4="
  
  return (
    <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
      <div dangerouslySetInnerHTML={{ __html: base64ToUtf8(encodedFooter) }} />
      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg max-w-2xl mx-auto"><p className="text-sm text-yellow-800 dark:text-yellow-300"><strong>Catatan:</strong> Gunakan pengaturan API untuk mengatur provider terjemahan atau aktifkan mode auto untuk pengalaman terbaik.</p></div>
    </footer>
  )
}

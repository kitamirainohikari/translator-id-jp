
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
  const AppName = import.meta.env.VITE_APP_NAME || 'CodeParcel'
  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)))
  }

  function base64ToUtf8(str: string): string {
    try {
      return decodeURIComponent(escape(atob(str)))
    } catch {
      return "Gagal decode konten."
    }
  }
  
  const encodedFooter = "PHAgY2xhc3M9InRleHQtc20iPsKpIDIwMjQgS2l0YSBNaXJhaW5vIEhpa2FyaSBUcmFuc2xhdG9yLiBEaWJ1YXQgZGVuZ2FuIOKdpO+4jyB1bnR1ayBjYWxvbiBwZWtlcmphIG1pZ3JhbiBJbmRvbmVzaWE8L3A+PHAgY2xhc3M9InRleHQteHMgbXQtNCBtYi0yIj48YSBocmVmPSJodHRwczovL3dhLm1lLys2Mjg4ODA4NjY1MjE4IiB0YXJnZXQ9Il9ibGFuayI+UG93ZXJlZCBCeSBJcWJhbCBBcmRpYW5zeWFoPC9hPjwvcD48ZGl2IGNsYXNzPSJtdC00IHAtNCBiZy1ncmFkaWVudC10by1yIGZyb20teWVsbG93LTUwIHRvLW9yYW5nZS01MCBkYXJrOmZyb20teWVsbG93LTkwMC8yMCBkYXJrOnRvLW9yYW5nZS05MDAvMjAgYm9yZGVyIGJvcmRlci15ZWxsb3ctMjAwIGRhcms6Ym9yZGVyLXllbGxvdy04MDAgcm91bmRlZC1sZyBtYXgtdy0yeGwgbXgtYXV0byI+PHAgY2xhc3M9InRleHQtc20gdGV4dC15ZWxsb3ctODAwIGRhcms6dGV4dC15ZWxsb3ctMzAwIj48c3Ryb25nPkNhdGF0YW46PC9zdHJvbmc+IEd1bmFrYW4gcGVuZ2F0dXJhbiBBUEkgdW50dWsgbWVuZ2F0dXIgcHJvdmlkZXIgdGVyamVtYWhhbiBhdGF1IGFrdGlma2FuIG1vZGUgYXV0byB1bnR1ayBwZW5nYWxhbWFuIHRlcmJhaWsuPC9wPjwvZGl2Pg=="
  
  return (
    <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
      <div dangerouslySetInnerHTML={{ __html: base64ToUtf8(encodedFooter) }} />
    </footer>
  )
}

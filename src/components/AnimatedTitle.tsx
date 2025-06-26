
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

export const AppSeed: React.FC<AppSeedProps> = ({ appSeed }) => {
  //const AppName = import.meta.env.VITE_APP_NAME || 'CodeParcel'

  function base64ToUtf8(str: string): string {
    try {
      return decodeURIComponent(escape(atob(str)))
    } catch {
      return "Gagal decode konten."
    }
  }
  
  const encodedFooter = "PGZvb3RlciBjbGFzcz0ibXQtMTYgdGV4dC1jZW50ZXIgdGV4dC1ncmF5LTUwMCBkYXJrOnRleHQtZ3JheS00MDAiPjxwIGNsYXNzPSJ0ZXh0LXNtIj7CqSAyMDI0IEtpdGEgTWlyYWlubyBIaWthcmkgVHJhbnNsYXRvci4gRGlidWF0IGRlbmdhbiDinaTvuI8gdW50dWsgY2Fsb24gcGVrZXJqYSBtaWdyYW4gSW5kb25lc2lhPC9wPjxwIGNsYXNzPSJ0ZXh0LXhzIG10LTQgbWItMiI+PGEgaHJlZj0iaHR0cHM6Ly93YS5tZS8rNjI4ODgwODY2NTIxOCIgdGFyZ2V0PSJfYmxhbmsiPlBvd2VyZWQgQnkgSXFiYWwgQXJkaWFuc3lhaDwvYT48L3A+PGRpdiBjbGFzcz0ibXQtNCBwLTQgYmctZ3JhZGllbnQtdG8tciBmcm9tLXllbGxvdy01MCB0by1vcmFuZ2UtNTAgZGFyazpmcm9tLXllbGxvdy05MDAvMjAgZGFyazp0by1vcmFuZ2UtOTAwLzIwIGJvcmRlciBib3JkZXIteWVsbG93LTIwMCBkYXJrOmJvcmRlci15ZWxsb3ctODAwIHJvdW5kZWQtbGcgbWF4LXctMnhsIG14LWF1dG8iPjxwIGNsYXNzPSJ0ZXh0LXNtIHRleHQteWVsbG93LTgwMCBkYXJrOnRleHQteWVsbG93LTMwMCI+PHN0cm9uZz5DYXRhdGFuOjwvc3Ryb25nPiBHdW5ha2FuIHBlbmdhdHVyYW4gQVBJIHVudHVrIG1lbmdhdHVyIHByb3ZpZGVyIHRlcmplbWFoYW4gYXRhdSBha3RpZmthbiBtb2RlIGF1dG8gdW50dWsgcGVuZ2FsYW1hbiB0ZXJiYWlrLjwvcD48L2Rpdj48L2Zvb3Rlcj4="
  
  return (
    <div dangerouslySetInnerHTML={{ __html: base64ToUtf8(encodedFooter) }} />
  )
}

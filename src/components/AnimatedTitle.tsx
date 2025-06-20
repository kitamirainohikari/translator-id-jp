
import { useEffect, useState } from 'react'

const AnimatedTitle = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <span>CodeParcel</span>

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
          CodeParcel
        </span>
        <span 
          className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-sakura-600 dark:from-blue-400 dark:via-purple-400 dark:to-sakura-400 bg-clip-text text-transparent"
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 3s ease-in-out infinite'
          }}
        >
          CodeParcel
        </span>
      </span>
    </>
  )
}

export default AnimatedTitle

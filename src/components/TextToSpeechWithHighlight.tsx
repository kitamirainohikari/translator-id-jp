
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'

interface TextToSpeechWithHighlightProps {
  text: string
  romaji?: string
  language: 'ja-JP' | 'id-ID'
  className?: string
}

const TextToSpeechWithHighlight = ({ 
  text, 
  romaji, 
  language, 
  className = '' 
}: TextToSpeechWithHighlightProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const wordsRef = useRef<string[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const durationRef = useRef<number>(0)

  useEffect(() => {
    // Split text into words/characters for highlighting
    if (language === 'ja-JP') {
      // For Japanese, highlight character by character
      wordsRef.current = text.split('').filter(char => char.trim() !== '')
    } else {
      // For Indonesian, highlight word by word  
      wordsRef.current = text.split(/(\s+)/).filter(word => word.trim() !== '')
    }
  }, [text, language])

  const estimateSpeechDuration = (text: string, rate: number = 0.6): number => {
    // More accurate duration estimation based on language and speech rate
    const wordsPerMinute = language === 'ja-JP' ? 300 : 150 // Japanese is typically faster
    const charactersPerMinute = wordsPerMinute * 5 // Average word length
    const baseWPM = charactersPerMinute / rate
    return (text.length / (baseWPM / 60)) * 1000
  }

  const updateProgress = () => {
    if (!isPlaying || isPaused) return

    const elapsed = Date.now() - startTimeRef.current
    const progressPercent = Math.min(elapsed / durationRef.current, 1)
    
    setProgress(progressPercent)
    
    // Calculate current word/character index based on progress
    const totalItems = wordsRef.current.length
    const currentIndex = Math.floor(progressPercent * totalItems)
    
    if (currentIndex !== currentWordIndex && currentIndex < totalItems) {
      setCurrentWordIndex(currentIndex)
    }

    if (progressPercent < 1) {
      animationFrameRef.current = requestAnimationFrame(updateProgress)
    } else {
      // Speech completed
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentWordIndex(-1)
      setProgress(0)
    }
  }

  const handleSpeak = () => {
    if (!text || !('speechSynthesis' in window)) return

    if (isPaused) {
      speechSynthesis.resume()
      setIsPaused(false)
      startTimeRef.current = Date.now() - (progress * durationRef.current)
      animationFrameRef.current = requestAnimationFrame(updateProgress)
      return
    }

    if (isPlaying) {
      speechSynthesis.pause()
      setIsPaused(true)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    // Stop any ongoing speech
    speechSynthesis.cancel()
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = 0.6 // Consistent rate for better timing
    utterance.pitch = 1
    utterance.volume = 0.8

    // Estimate duration more accurately
    durationRef.current = estimateSpeechDuration(text, utterance.rate)

    utterance.onstart = () => {
      console.log('Speech started, estimated duration:', durationRef.current)
      setIsPlaying(true)
      setCurrentWordIndex(0)
      setProgress(0)
      startTimeRef.current = Date.now()
      animationFrameRef.current = requestAnimationFrame(updateProgress)
    }

    utterance.onend = () => {
      console.log('Speech ended')
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentWordIndex(-1)
      setProgress(0)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    utterance.onerror = (event) => {
      console.error('Speech error:', event)
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentWordIndex(-1)
      setProgress(0)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    // Use boundary events for more accurate timing (if supported)
    utterance.onboundary = (event) => {
      console.log('Speech boundary:', event.name, event.charIndex)
      if (event.name === 'word' || event.name === 'sentence') {
        const charIndex = event.charIndex
        const words = wordsRef.current
        let currentIndex = 0
        let charCount = 0
        
        for (let i = 0; i < words.length; i++) {
          if (charCount >= charIndex) {
            currentIndex = i
            break
          }
          charCount += words[i].length
        }
        
        setCurrentWordIndex(currentIndex)
      }
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }

  const handleStop = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentWordIndex(-1)
    setProgress(0)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const renderHighlightedText = () => {
    return wordsRef.current.map((word, index) => {
      const isCurrentWord = index === currentWordIndex
      const isPastWord = index < currentWordIndex
      
      return (
        <span
          key={index}
          className={`
            transition-all duration-200 ease-in-out
            ${isCurrentWord
              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 text-black dark:text-white shadow-lg scale-110 font-bold px-1 rounded-sm animate-pulse'
              : isPastWord
              ? 'bg-green-200 dark:bg-green-700 text-gray-700 dark:text-gray-200 px-1 rounded-sm opacity-75'
              : 'text-gray-900 dark:text-gray-100'
            }
          `}
          style={{
            display: 'inline-block',
            margin: '0 1px',
            minWidth: word === ' ' ? '4px' : 'auto',
            transform: isCurrentWord ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          {word === ' ' ? '\u00A0' : word}
        </span>
      )
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      speechSynthesis.cancel()
    }
  }, [])

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main text with highlighting */}
      <div className="text-lg leading-relaxed japanese-text dark:text-gray-100 min-h-[60px] p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900 rounded-lg border border-gray-200 dark:border-gray-600">
        {renderHighlightedText()}
      </div>

      {/* Romaji text if available */}
      {romaji && (
        <div className="text-sm text-gray-600 dark:text-gray-400 romaji-text p-3 bg-gradient-to-r from-gray-100 to-purple-100 dark:from-gray-600 dark:to-purple-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <strong>Romaji:</strong> <span className="font-mono">{romaji}</span>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={handleSpeak}
          variant="outline"
          size="sm"
          disabled={!text}
          className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900 dark:hover:to-purple-900 border-2 border-blue-200 dark:border-blue-700"
        >
          {isPlaying && !isPaused ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>
            {isPlaying && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Play'}
          </span>
        </Button>

        {isPlaying && (
          <Button
            onClick={handleStop}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900 dark:hover:to-pink-900 border-2 border-red-200 dark:border-red-700"
          >
            <VolumeX className="w-4 h-4" />
            <span>Stop</span>
          </Button>
        )}

        {/* Enhanced progress bar */}
        {isPlaying && (
          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden border border-gray-300 dark:border-gray-500">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-100 relative"
              style={{ width: `${progress * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Enhanced progress indicator */}
        {isPlaying && (
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {currentWordIndex + 1} / {wordsRef.current.length}
            <div className="text-[10px] opacity-75">
              {Math.round(progress * 100)}%
            </div>
          </div>
        )}

        {/* Duration estimate */}
        {!isPlaying && durationRef.current > 0 && (
          <div className="text-xs text-gray-400 dark:text-gray-500">
            ~{Math.round(durationRef.current / 1000)}s
          </div>
        )}
      </div>
    </div>
  )
}

export default TextToSpeechWithHighlight

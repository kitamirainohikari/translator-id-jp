
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Volume2, VolumeX } from 'lucide-react'

interface EnhancedVirtualKeyboardProps {
  onKeyPress: (char: string) => void
  className?: string
}

interface KanaData {
  char: string
  romaji: string
}

const EnhancedVirtualKeyboard = ({ onKeyPress, className = '' }: EnhancedVirtualKeyboardProps) => {
  const [isKatakana, setIsKatakana] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const hiraganaData: KanaData[][] = [
    [
      { char: 'あ', romaji: 'a' },
      { char: 'い', romaji: 'i' },
      { char: 'う', romaji: 'u' },
      { char: 'え', romaji: 'e' },
      { char: 'お', romaji: 'o' }
    ],
    [
      { char: 'か', romaji: 'ka' },
      { char: 'き', romaji: 'ki' },
      { char: 'く', romaji: 'ku' },
      { char: 'け', romaji: 'ke' },
      { char: 'こ', romaji: 'ko' }
    ],
    [
      { char: 'さ', romaji: 'sa' },
      { char: 'し', romaji: 'shi' },
      { char: 'す', romaji: 'su' },
      { char: 'せ', romaji: 'se' },
      { char: 'そ', romaji: 'so' }
    ],
    [
      { char: 'た', romaji: 'ta' },
      { char: 'ち', romaji: 'chi' },
      { char: 'つ', romaji: 'tsu' },
      { char: 'て', romaji: 'te' },
      { char: 'と', romaji: 'to' }
    ],
    [
      { char: 'な', romaji: 'na' },
      { char: 'に', romaji: 'ni' },
      { char: 'ぬ', romaji: 'nu' },
      { char: 'ね', romaji: 'ne' },
      { char: 'の', romaji: 'no' }
    ],
    [
      { char: 'は', romaji: 'ha' },
      { char: 'ひ', romaji: 'hi' },
      { char: 'ふ', romaji: 'fu' },
      { char: 'へ', romaji: 'he' },
      { char: 'ほ', romaji: 'ho' }
    ],
    [
      { char: 'ま', romaji: 'ma' },
      { char: 'み', romaji: 'mi' },
      { char: 'む', romaji: 'mu' },
      { char: 'め', romaji: 'me' },
      { char: 'も', romaji: 'mo' }
    ],
    [
      { char: 'や', romaji: 'ya' },
      { char: '', romaji: '' },
      { char: 'ゆ', romaji: 'yu' },
      { char: '', romaji: '' },
      { char: 'よ', romaji: 'yo' }
    ],
    [
      { char: 'ら', romaji: 'ra' },
      { char: 'り', romaji: 'ri' },
      { char: 'る', romaji: 'ru' },
      { char: 'れ', romaji: 're' },
      { char: 'ろ', romaji: 'ro' }
    ],
    [
      { char: 'わ', romaji: 'wa' },
      { char: '', romaji: '' },
      { char: '', romaji: '' },
      { char: '', romaji: '' },
      { char: 'を', romaji: 'wo' }
    ],
    [
      { char: 'ん', romaji: 'n' },
      { char: '、', romaji: ',' },
      { char: '。', romaji: '.' },
      { char: 'ー', romaji: '-' },
      { char: 'っ', romaji: 'tsu' }
    ]
  ]

  const katakanaData: KanaData[][] = [
    [
      { char: 'ア', romaji: 'a' },
      { char: 'イ', romaji: 'i' },
      { char: 'ウ', romaji: 'u' },
      { char: 'エ', romaji: 'e' },
      { char: 'オ', romaji: 'o' }
    ],
    [
      { char: 'カ', romaji: 'ka' },
      { char: 'キ', romaji: 'ki' },
      { char: 'ク', romaji: 'ku' },
      { char: 'ケ', romaji: 'ke' },
      { char: 'コ', romaji: 'ko' }
    ],
    [
      { char: 'サ', romaji: 'sa' },
      { char: 'シ', romaji: 'shi' },
      { char: 'ス', romaji: 'su' },
      { char: 'セ', romaji: 'se' },
      { char: 'ソ', romaji: 'so' }
    ],
    [
      { char: 'タ', romaji: 'ta' },
      { char: 'チ', romaji: 'chi' },
      { char: 'ツ', romaji: 'tsu' },
      { char: 'テ', romaji: 'te' },
      { char: 'ト', romaji: 'to' }
    ],
    [
      { char: 'ナ', romaji: 'na' },
      { char: 'ニ', romaji: 'ni' },
      { char: 'ヌ', romaji: 'nu' },
      { char: 'ネ', romaji: 'ne' },
      { char: 'ノ', romaji: 'no' }
    ],
    [
      { char: 'ハ', romaji: 'ha' },
      { char: 'ヒ', romaji: 'hi' },
      { char: 'フ', romaji: 'fu' },
      { char: 'ヘ', romaji: 'he' },
      { char: 'ホ', romaji: 'ho' }
    ],
    [
      { char: 'マ', romaji: 'ma' },
      { char: 'ミ', romaji: 'mi' },
      { char: 'ム', romaji: 'mu' },
      { char: 'メ', romaji: 'me' },
      { char: 'モ', romaji: 'mo' }
    ],
    [
      { char: 'ヤ', romaji: 'ya' },
      { char: '', romaji: '' },
      { char: 'ユ', romaji: 'yu' },
      { char: '', romaji: '' },
      { char: 'ヨ', romaji: 'yo' }
    ],
    [
      { char: 'ラ', romaji: 'ra' },
      { char: 'リ', romaji: 'ri' },
      { char: 'ル', romaji: 'ru' },
      { char: 'レ', romaji: 're' },
      { char: 'ロ', romaji: 'ro' }
    ],
    [
      { char: 'ワ', romaji: 'wa' },
      { char: '', romaji: '' },
      { char: '', romaji: '' },
      { char: '', romaji: '' },
      { char: 'ヲ', romaji: 'wo' }
    ],
    [
      { char: 'ン', romaji: 'n' },
      { char: '、', romaji: ',' },
      { char: '。', romaji: '.' },
      { char: 'ー', romaji: '-' },
      { char: 'ッ', romaji: 'tsu' }
    ]
  ]

  const currentData = isKatakana ? katakanaData : hiraganaData

  const playKanaSound = (romaji: string) => {
    if (!audioEnabled || !romaji) return

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(romaji)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.7
      speechSynthesis.speak(utterance)
    }
  }

  const handleKeyPress = (kanaData: KanaData) => {
    if (!kanaData.char) return
    
    onKeyPress(kanaData.char)
    playKanaSound(kanaData.romaji)
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-lg ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ひらがな</span>
            <Switch
              checked={isKatakana}
              onCheckedChange={setIsKatakana}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">カタカナ</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 ${audioEnabled ? 'text-blue-600' : 'text-gray-400'}`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Keyboard */}
      <div className="space-y-2">
        {currentData.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-1">
            {row.map((kanaData, keyIndex) => (
              <div key={keyIndex} className="relative group">
                <Button
                  onClick={() => handleKeyPress(kanaData)}
                  variant="outline"
                  size="sm"
                  className={`
                    w-10 h-10 p-0 text-lg font-medium relative overflow-hidden
                    transition-all duration-200 transform
                    ${kanaData.char ? 'hover:scale-110 hover:shadow-md' : 'opacity-30 cursor-not-allowed'}
                    ${hoveredKey === kanaData.char ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900' : ''}
                    hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100
                    dark:hover:from-blue-800 dark:hover:to-purple-800
                    active:scale-95
                  `}
                  disabled={!kanaData.char}
                  onMouseEnter={() => setHoveredKey(kanaData.char)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  {/* Ripple effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {kanaData.char}
                </Button>
                
                {/* Tooltip */}
                {kanaData.char && kanaData.romaji && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                    {kanaData.romaji}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Control buttons */}
      <div className="flex justify-center space-x-2 mt-4">
        <Button
          onClick={() => onKeyPress(' ')}
          variant="outline"
          className="px-8 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900 dark:hover:to-purple-900"
        >
          スペース
        </Button>
        <Button
          onClick={() => onKeyPress('\n')}
          variant="outline"
          className="px-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900 dark:hover:to-purple-900"
        >
          改行
        </Button>
      </div>
    </div>
  )
}

export default EnhancedVirtualKeyboard

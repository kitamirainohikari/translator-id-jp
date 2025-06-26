
import { Button } from '@/components/ui/button'

interface VirtualKeyboardProps {
  onKeyPress: (char: string) => void
  className?: string
}

const VirtualKeyboard = ({ onKeyPress, className = '' }: VirtualKeyboardProps) => {
  const hiraganaRows = [
    ['あ', 'い', 'う', 'え', 'お'],
    ['か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ'],
    ['た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の'],
    ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も'],
    ['や', '', 'ゆ', '', 'よ'],
    ['ら', 'り', 'る', 'れ', 'ろ'],
    ['わ', '', '', '', 'を'],
    ['ん', '、', '。', 'ー', 'っ']
  ]

  const katakanaRows = [
    ['ア', 'イ', 'ウ', 'エ', 'オ'],
    ['カ', 'キ', 'ク', 'ケ', 'コ'],
    ['サ', 'シ', 'ス', 'セ', 'ソ'],
    ['タ', 'チ', 'ツ', 'テ', 'ト'],
    ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
    ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
    ['マ', 'ミ', 'ム', 'メ', 'モ'],
    ['ヤ', '', 'ユ', '', 'ヨ'],
    ['ラ', 'リ', 'ル', 'レ', 'ロ'],
    ['ワ', '', '', '', 'ヲ'],
    ['ン', '、', '。', 'ー', 'ッ']
  ]

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-lg ${className}`}>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Hiragana</h4>
          <div className="space-y-1">
            {hiraganaRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center space-x-1">
                {row.map((char, charIndex) => (
                  <Button
                    key={charIndex}
                    onClick={() => char && onKeyPress(char)}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 text-sm"
                    disabled={!char}
                  >
                    {char}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Katakana</h4>
          <div className="space-y-1">
            {katakanaRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center space-x-1">
                {row.map((char, charIndex) => (
                  <Button
                    key={charIndex}
                    onClick={() => char && onKeyPress(char)}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 text-sm"
                    disabled={!char}
                  >
                    {char}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => onKeyPress(' ')}
            variant="outline"
            className="px-8"
          >
            Spasi
          </Button>
          <Button
            onClick={() => onKeyPress('\n')}
            variant="outline"
            className="px-4"
          >
            Enter
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VirtualKeyboard

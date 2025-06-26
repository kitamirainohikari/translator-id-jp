
import { translateWithFreeService, FreeTranslationResult } from './freeTranslationApis'

export interface TranslationResult {
  translation: string
  japaneseText?: string
  romaji?: string
  jlptLevel: string
}

export interface ReverseTranslationResult {
  indonesianText: string
  romaji?: string
  jlptLevel: string
}

export const translateToJapanese = async (
  text: string, 
  provider: 'openai' | 'google' | 'deepl' | 'libretranslate' | 'mymemory' | 'lingva' | 'argos' = 'libretranslate',
  apiKey: string = ''
): Promise<TranslationResult> => {
  
  // Free APIs that don't need API key
  if (['libretranslate', 'mymemory', 'lingva', 'argos'].includes(provider)) {
    try {
      const result = await translateWithFreeService(text, 'id_to_jp', provider as any)
      return {
        translation: result.translatedText,
        japaneseText: result.translatedText,
        romaji: result.romaji,
        jlptLevel: result.jlptLevel
      }
    } catch (error) {
      console.error(`${provider} translation error:`, error)
      // Fallback to another free service
      try {
        const fallbackResult = await translateWithFreeService(text, 'id_to_jp', 'libretranslate')
        return {
          translation: fallbackResult.translatedText,
          japaneseText: fallbackResult.translatedText,
          romaji: fallbackResult.romaji,
          jlptLevel: fallbackResult.jlptLevel
        }
      } catch (fallbackError) {
        throw new Error('Semua layanan terjemahan gratis tidak tersedia. Silakan coba lagi nanti.')
      }
    }
  }

  // Paid APIs
  if (provider === 'openai') {
    return translateWithOpenAI(text, 'japanese', apiKey)
  } else if (provider === 'google') {
    return translateWithGoogle(text, 'ja', apiKey)
  } else if (provider === 'deepl') {
    return translateWithDeepL(text, 'JA', apiKey)
  }
  
  throw new Error('Provider tidak didukung')
}

export const translateToIndonesian = async (
  text: string,
  provider: 'openai' | 'google' | 'deepl' | 'libretranslate' | 'mymemory' | 'lingva' | 'argos' = 'libretranslate',
  apiKey: string = ''
): Promise<ReverseTranslationResult> => {

  // Free APIs that don't need API key
  if (['libretranslate', 'mymemory', 'lingva', 'argos'].includes(provider)) {
    try {
      const result = await translateWithFreeService(text, 'jp_to_id', provider as any)
      return {
        indonesianText: result.translatedText,
        romaji: result.romaji,
        jlptLevel: result.jlptLevel
      }
    } catch (error) {
      console.error(`${provider} translation error:`, error)
      // Fallback to another free service
      try {
        const fallbackResult = await translateWithFreeService(text, 'jp_to_id', 'libretranslate')
        return {
          indonesianText: fallbackResult.translatedText,
          romaji: fallbackResult.romaji,
          jlptLevel: fallbackResult.jlptLevel
        }
      } catch (fallbackError) {
        throw new Error('Semua layanan terjemahan gratis tidak tersedia. Silakan coba lagi nanti.')
      }
    }
  }

  // Paid APIs
  if (provider === 'openai') {
    return translateWithOpenAIReverse(text, 'indonesian', apiKey)
  } else if (provider === 'google') {
    return translateWithGoogleReverse(text, 'id', apiKey)
  } else if (provider === 'deepl') {
    return translateWithDeepLReverse(text, 'ID', apiKey)
  }
  
  throw new Error('Provider tidak didukung')
}

// OpenAI Implementation
const translateWithOpenAI = async (text: string, target: string, apiKey: string): Promise<TranslationResult> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Kamu adalah ahli translator Indonesia-Jepang yang spesialisasi untuk pekerja migran. 
            Berikan terjemahan dalam format JSON dengan struktur:
            {
              "translation": "terjemahan dalam hiragana/katakana/kanji",
              "romaji": "bacaan romaji",
              "jlptLevel": "N5/N4/N3"
            }
            Fokus pada kosakata praktis untuk kehidupan sehari-hari di Jepang.`
          },
          {
            role: 'user',
            content: `Terjemahkan ke bahasa Jepang: "${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    try {
      const parsed = JSON.parse(content)
      return {
        translation: parsed.translation,
        japaneseText: parsed.translation,
        romaji: parsed.romaji,
        jlptLevel: parsed.jlptLevel || 'N5'
      }
    } catch {
      return {
        translation: content,
        japaneseText: content,
        romaji: '',
        jlptLevel: 'N5'
      }
    }
  } catch (error) {
    console.error('OpenAI translation error:', error)
    throw new Error('Gagal menerjemahkan dengan OpenAI. Periksa API key dan koneksi internet.')
  }
}

const translateWithOpenAIReverse = async (text: string, target: string, apiKey: string): Promise<ReverseTranslationResult> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Kamu adalah ahli translator Jepang-Indonesia yang spesialisasi untuk pekerja migran. 
            Berikan terjemahan dalam format JSON dengan struktur:
            {
              "indonesianText": "terjemahan bahasa Indonesia",
              "romaji": "bacaan romaji dari teks Jepang",
              "jlptLevel": "N5/N4/N3"
            }
            Fokus pada terjemahan yang mudah dipahami untuk pekerja Indonesia.`
          },
          {
            role: 'user',
            content: `Terjemahkan ke bahasa Indonesia: "${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    try {
      const parsed = JSON.parse(content)
      return {
        indonesianText: parsed.indonesianText,
        romaji: parsed.romaji,
        jlptLevel: parsed.jlptLevel || 'N5'
      }
    } catch {
      return {
        indonesianText: content,
        romaji: '',
        jlptLevel: 'N5'
      }
    }
  } catch (error) {
    console.error('OpenAI reverse translation error:', error)
    throw new Error('Gagal menerjemahkan dengan OpenAI. Periksa API key dan koneksi internet.')
  }
}

// Google Translate Implementation
const translateWithGoogle = async (text: string, target: string, apiKey: string): Promise<TranslationResult> => {
  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'id',
        target: target,
        format: 'text'
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const translatedText = data.data.translations[0].translatedText

    return {
      translation: translatedText,
      japaneseText: translatedText,
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    console.error('Google Translate error:', error)
    throw new Error('Gagal menerjemahkan dengan Google Translate. Periksa API key dan koneksi internet.')
  }
}

const translateWithGoogleReverse = async (text: string, target: string, apiKey: string): Promise<ReverseTranslationResult> => {
  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'ja',
        target: target,
        format: 'text'
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const translatedText = data.data.translations[0].translatedText

    return {
      indonesianText: translatedText,
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    console.error('Google Translate reverse error:', error)
    throw new Error('Gagal menerjemahkan dengan Google Translate. Periksa API key dan koneksi internet.')
  }
}

// DeepL Implementation
const translateWithDeepL = async (text: string, target: string, apiKey: string): Promise<TranslationResult> => {
  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        source_lang: 'ID',
        target_lang: target
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const translatedText = data.translations[0].text

    return {
      translation: translatedText,
      japaneseText: translatedText,
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    console.error('DeepL translation error:', error)
    throw new Error('Gagal menerjemahkan dengan DeepL. Periksa API key dan koneksi internet.')
  }
}

const translateWithDeepLReverse = async (text: string, target: string, apiKey: string): Promise<ReverseTranslationResult> => {
  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        source_lang: 'JA',
        target_lang: target
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const translatedText = data.translations[0].text

    return {
      indonesianText: translatedText,
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    console.error('DeepL reverse translation error:', error)
    throw new Error('Gagal menerjemahkan dengan DeepL. Periksa API key dan koneksi internet.')
  }
}

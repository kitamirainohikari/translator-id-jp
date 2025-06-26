
// Free translation APIs implementation
export interface FreeTranslationResult {
  translatedText: string
  romaji?: string
  jlptLevel: string
}

// LibreTranslate API
export const translateWithLibreTranslate = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<FreeTranslationResult> => {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    })

    if (!response.ok) {
      throw new Error(`LibreTranslate error: ${response.status}`)
    }

    const data = await response.json()
    return {
      translatedText: data.translatedText,
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.error('LibreTranslate error:', error)
    }
    throw new Error('Gagal menerjemahkan dengan LibreTranslate')
  }
}

// MyMemory API - Fixed and improved
export const translateWithMyMemory = async (
  text: string,
  langPair: string
): Promise<FreeTranslationResult> => {
  try {
    const encodedText = encodeURIComponent(text)
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TranslatorApp/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`MyMemory error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory API error: ${data.responseDetails}`)
    }

    return {
      translatedText: data.responseData.translatedText,
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.error('MyMemory error:', error)
    }
    throw new Error('Gagal menerjemahkan dengan MyMemory')
  }
}

// Lingva API - Updated endpoint
export const translateWithLingva = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<FreeTranslationResult> => {
  try {
    const encodedText = encodeURIComponent(text)
    const url = `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodedText}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TranslatorApp/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`Lingva error: ${response.status}`)
    }

    const data = await response.json()
    return {
      translatedText: data.translation,
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.error('Lingva error:', error)
    }
    throw new Error('Gagal menerjemahkan dengan Lingva')
  }
}

// Alternative free translation service
export const translateWithFreeGoogleTranslate = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<FreeTranslationResult> => {
  try {
    // Use unofficial Google Translate API
    const encodedText = encodeURIComponent(text)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TranslatorApp/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`Google Translate error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data || !data[0] || !data[0][0]) {
      throw new Error('Invalid response from Google Translate')
    }

    let translatedText = ''
    for (const item of data[0]) {
      if (item[0]) {
        translatedText += item[0]
      }
    }

    return {
      translatedText: translatedText.trim(),
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.error('Google Translate error:', error)
    }
    throw new Error('Gagal menerjemahkan dengan Google Translate')
  }
}

// Free translation service router with improved error handling
export const translateWithFreeService = async (
  text: string,
  direction: 'id_to_jp' | 'jp_to_id',
  provider: 'libretranslate' | 'mymemory' | 'lingva' | 'google-free' = 'mymemory'
): Promise<FreeTranslationResult> => {
  const sourceLang = direction === 'id_to_jp' ? 'id' : 'ja'
  const targetLang = direction === 'id_to_jp' ? 'ja' : 'id'

  // Try primary provider
  try {
    switch (provider) {
      case 'mymemory':
        const langPair = `${sourceLang}|${targetLang}`
        return await translateWithMyMemory(text, langPair)
      case 'google-free':
        return await translateWithFreeGoogleTranslate(text, sourceLang, targetLang)
      case 'lingva':
        return await translateWithLingva(text, sourceLang, targetLang)
      case 'libretranslate':
        return await translateWithLibreTranslate(text, sourceLang, targetLang)
      default:
        throw new Error('Provider tidak didukung')
    }
  } catch (primaryError) {
    if (import.meta.env.MODE === 'development') {
      console.warn(`Primary provider ${provider} failed:`, primaryError)
    }

    // Fallback to MyMemory if primary fails
    if (provider !== 'mymemory') {
      try {
        const langPair = `${sourceLang}|${targetLang}`
        return await translateWithMyMemory(text, langPair)
      } catch (fallbackError) {
        if (import.meta.env.MODE === 'development') {
          console.error('Fallback to MyMemory also failed:', fallbackError)
        }
      }
    }

    // Final fallback to Google Free
    if (provider !== 'google-free') {
      try {
        return await translateWithFreeGoogleTranslate(text, sourceLang, targetLang)
      } catch (finalError) {
        if (import.meta.env.MODE === 'development') {
          console.error('Final fallback to Google Free also failed:', finalError)
        }
      }
    }

    throw new Error(`Semua layanan terjemahan tidak tersedia. Error: ${(primaryError as Error).message}`)
  }
}
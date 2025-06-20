
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
    console.error('LibreTranslate error:', error)
    throw new Error('Gagal menerjemahkan dengan LibreTranslate')
  }
}

// MyMemory API
export const translateWithMyMemory = async (
  text: string,
  langPair: string
): Promise<FreeTranslationResult> => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
    )

    if (!response.ok) {
      throw new Error(`MyMemory error: ${response.status}`)
    }

    const data = await response.json()
    return {
      translatedText: data.responseData.translatedText,
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    console.error('MyMemory error:', error)
    throw new Error('Gagal menerjemahkan dengan MyMemory')
  }
}

// Lingva API
export const translateWithLingva = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<FreeTranslationResult> => {
  try {
    const response = await fetch(
      `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text)}`
    )

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
    console.error('Lingva error:', error)
    throw new Error('Gagal menerjemahkan dengan Lingva')
  }
}

// Argos Translate (via public instance)
export const translateWithArgos = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<FreeTranslationResult> => {
  try {
    const response = await fetch('https://translate.argosopentech.com/translate', {
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
      throw new Error(`Argos error: ${response.status}`)
    }

    const data = await response.json()
    return {
      translatedText: data.translatedText,
      romaji: '',
      jlptLevel: 'N5'
    }
  } catch (error) {
    console.error('Argos error:', error)
    throw new Error('Gagal menerjemahkan dengan Argos')
  }
}

// Free translation service router
export const translateWithFreeService = async (
  text: string,
  direction: 'id_to_jp' | 'jp_to_id',
  provider: 'libretranslate' | 'mymemory' | 'lingva' | 'argos' = 'libretranslate'
): Promise<FreeTranslationResult> => {
  const sourceLang = direction === 'id_to_jp' ? 'id' : 'ja'
  const targetLang = direction === 'id_to_jp' ? 'ja' : 'id'

  switch (provider) {
    case 'libretranslate':
      return translateWithLibreTranslate(text, sourceLang, targetLang)
    case 'mymemory':
      const langPair = `${sourceLang}|${targetLang}`
      return translateWithMyMemory(text, langPair)
    case 'lingva':
      return translateWithLingva(text, sourceLang, targetLang)
    case 'argos':
      return translateWithArgos(text, sourceLang, targetLang)
    default:
      throw new Error('Provider tidak didukung')
  }
}

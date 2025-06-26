
import imageCompression from 'browser-image-compression'

export const compressImage = async (
  file: File,
  maxWidth: number = 300,
  maxHeight: number = 300,
  quality: number = 0.7
): Promise<Blob> => {
  try {
    // Primary method: Use browser-image-compression for better compatibility
    const options = {
      maxSizeMB: 0.5, // 500KB max
      maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: quality
    }
    
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.warn('Image compression library failed, using canvas fallback:', error)
    }
    
    // Fallback: Canvas method
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Canvas compression failed'))
            }
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => reject(new Error('Image load failed'))
      img.src = URL.createObjectURL(file)
    })
  }
}

export const generateAvatarUrl = (userId: string): string => {
  return `${userId}/avatar.webp`
}

const avatarCache = new Map<string, { url: string, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const getCachedAvatarUrl = (userId: string, publicUrl: string): string => {
  const cacheKey = `avatar_${userId}`
  const cached = avatarCache.get(cacheKey)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.url
  }
  
  avatarCache.set(cacheKey, { url: publicUrl, timestamp: now })
  return publicUrl
}

export const clearAvatarCache = (userId: string): void => {
  const cacheKey = `avatar_${userId}`
  avatarCache.delete(cacheKey)
}

// Clean old cache entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of avatarCache.entries()) {
    if ((now - value.timestamp) > CACHE_DURATION) {
      avatarCache.delete(key)
    }
  }
}, 10 * 60 * 1000) // Clean every 10 minutes
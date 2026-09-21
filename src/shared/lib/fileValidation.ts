export type FileUploadType = 'avatar' | 'skillImages'

export type FileValidationResult =
  | {
      success: true
      files: string[]
    }
  | {
      success: false
      error: string
    }

export const FILE_LIMITS = {
  avatar: {
    min: 0,
    max: 1,
  },
  skillImages: {
    min: 1,
    max: 6,
  },
} as const

const MAX_SOURCE_FILE_SIZE = 5 * 1024 * 1024 // 5 МБ

const ALLOWED_FILE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const IMAGE_SETTINGS = {
  avatar: {
    maxSide: 512,
    targetSize: 200 * 1024,
  },
  skillImages: {
    maxSide: 1280,
    targetSize: 300 * 1024,
  },
} as const

const INITIAL_QUALITY = 0.82
const MIN_QUALITY = 0.55
const QUALITY_STEP = 0.1
const RESIZE_FACTOR = 0.85
const MAX_OPTIMIZATION_ATTEMPTS = 12

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Не удалось прочитать файл'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл'))
    }

    reader.readAsDataURL(file)
  })
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Не удалось загрузить изображение'))
    }

    image.src = objectUrl
  })
}

function getScaledDimensions(width: number, height: number, maxSide: number) {
  const longestSide = Math.max(width, height)

  if (longestSide <= maxSide) {
    return { width, height }
  }

  const scale = maxSide / longestSide

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Не удалось создать изображение'))
        }
      },
      'image/webp',
      quality,
    )
  })
}

async function optimizeImage(file: File, type: FileUploadType): Promise<string> {
  // В браузере изображения оптимизируются через canvas.
  // Fallback нужен для окружений без browser image API, например unit tests.
  if (
    typeof document === 'undefined' ||
    typeof Image === 'undefined' ||
    typeof URL.createObjectURL !== 'function'
  ) {
    return fileToDataUrl(file)
  }

  const image = await loadImage(file)
  const settings = IMAGE_SETTINGS[type]

  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height

  if (!sourceWidth || !sourceHeight) {
    throw new Error('Некорректный размер изображения')
  }

  let { width, height } = getScaledDimensions(sourceWidth, sourceHeight, settings.maxSide)

  let quality = INITIAL_QUALITY

  for (let attempt = 0; attempt < MAX_OPTIMIZATION_ATTEMPTS; attempt += 1) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Canvas недоступен')
    }

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0, width, height)

    const blob = await canvasToBlob(canvas, quality)

    if (blob.size <= settings.targetSize) {
      return fileToDataUrl(blob)
    }

    if (quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP)
      continue
    }

    width = Math.max(1, Math.round(width * RESIZE_FACTOR))
    height = Math.max(1, Math.round(height * RESIZE_FACTOR))
    quality = INITIAL_QUALITY
  }

  throw new Error('Не удалось уменьшить изображение до допустимого размера')
}

export async function validateAndConvertFiles(
  files: File[],
  type: FileUploadType,
): Promise<FileValidationResult> {
  const limits = FILE_LIMITS[type]

  if (files.length > limits.max) {
    return {
      success: false,
      error:
        type === 'avatar'
          ? 'Можно загрузить только один аватар'
          : `Можно загрузить не более ${limits.max} изображений`,
    }
  }

  for (const file of files) {
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return {
        success: false,
        error: 'Поддерживаются только JPG, JPEG, PNG и WebP',
      }
    }

    if (file.size > MAX_SOURCE_FILE_SIZE) {
      return {
        success: false,
        error: 'Размер исходного изображения не должен превышать 5 МБ',
      }
    }
  }

  try {
    const dataUrls: string[] = []

    // Обрабатываем последовательно, чтобы не держать одновременно
    // несколько больших исходных изображений в памяти.
    for (const file of files) {
      dataUrls.push(await optimizeImage(file, type))
    }

    return {
      success: true,
      files: dataUrls,
    }
  } catch {
    return {
      success: false,
      error: 'Не удалось обработать изображение',
    }
  }
}

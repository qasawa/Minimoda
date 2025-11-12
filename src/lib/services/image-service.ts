import { supabase } from '../supabase/client'

export interface ImageUploadOptions {
  quality?: number
  maxWidth?: number
  maxHeight?: number
  format?: 'webp' | 'jpeg' | 'png'
  generateThumbnails?: boolean
}

export interface ImageMetadata {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  width: number
  height: number
  url: string
  thumbnails?: {
    small: string
    medium: string
    large: string
  }
  alt?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ImageOptimizationResult {
  original: string
  optimized: string
  thumbnails: {
    small: string
    medium: string
    large: string
  }
  metadata: {
    originalSize: number
    optimizedSize: number
    compressionRatio: number
    dimensions: { width: number; height: number }
  }
}

export class ImageService {
  private static readonly BUCKET_NAME = 'product-images'
  private static readonly CDN_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/'

  // Upload and optimize image
  static async uploadImage(
    file: File,
    folder: string = 'products',
    options: ImageUploadOptions = {}
  ): Promise<{ data: ImageOptimizationResult | null; error: string | null }> {
    try {
      const {
        quality = 85,
        maxWidth = 1920,
        maxHeight = 1920,
        format = 'webp',
        generateThumbnails = true
      } = options

      // Validate file
      if (!this.isValidImageFile(file)) {
        return { data: null, error: 'Invalid image file' }
      }

      // Generate unique filename
      const timestamp = Date.now()
      const extension = format === 'webp' ? 'webp' : file.name.split('.').pop()
      const filename = `${folder}/${timestamp}-${this.sanitizeFilename(file.name)}.${extension}`

      // Optimize image
      const optimizedFile = await this.optimizeImage(file, {
        quality,
        maxWidth,
        maxHeight,
        format
      })

      if (!supabase) {
        return { 
          data: null, 
          error: 'Storage service not available'
        }
      }

      // Upload original
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filename, optimizedFile)

      if (uploadError) {
        return { data: null, error: uploadError.message }
      }

      // Generate thumbnails
      const thumbnails = generateThumbnails 
        ? await this.generateThumbnails(optimizedFile, folder, timestamp)
        : { small: '', medium: '', large: '' }

      // Get public URLs
      const originalUrl = this.getPublicUrl(filename)
      
      const result: ImageOptimizationResult = {
        original: originalUrl,
        optimized: originalUrl,
        thumbnails,
        metadata: {
          originalSize: file.size,
          optimizedSize: optimizedFile.size,
          compressionRatio: (file.size - optimizedFile.size) / file.size,
          dimensions: await this.getImageDimensions(optimizedFile)
        }
      }

      return { data: result, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(
    files: FileList | File[],
    folder: string = 'products',
    options: ImageUploadOptions = {}
  ): Promise<{ data: ImageOptimizationResult[]; errors: string[] }> {
    const results: ImageOptimizationResult[] = []
    const errors: string[] = []

    const fileArray = Array.from(files)
    
    for (const file of fileArray) {
      const { data, error } = await this.uploadImage(file, folder, options)
      
      if (data) {
        results.push(data)
      } else if (error) {
        errors.push(`${file.name}: ${error}`)
      }
    }

    return { data: results, errors }
  }

  // Generate thumbnails
  private static async generateThumbnails(
    file: File,
    folder: string,
    timestamp: number
  ): Promise<{ small: string; medium: string; large: string }> {
    try {
      const thumbnailSizes = [
        { name: 'small', width: 150, height: 150 },
        { name: 'medium', width: 400, height: 400 },
        { name: 'large', width: 800, height: 800 }
      ]

      const thumbnails: any = {}

      for (const size of thumbnailSizes) {
        const thumbnail = await this.resizeImage(file, size.width, size.height)
        const thumbnailFilename = `${folder}/thumbnails/${timestamp}-${size.name}.webp`
        
        if (!supabase) continue
        
        const { error } = await supabase.storage
          .from(this.BUCKET_NAME)
          .upload(thumbnailFilename, thumbnail)

        if (!error) {
          thumbnails[size.name] = this.getPublicUrl(thumbnailFilename)
        }
      }

      return thumbnails
    } catch (error) {
      console.error('Error generating thumbnails:', error)
      return { small: '', medium: '', large: '' }
    }
  }

  // Optimize image
  private static async optimizeImage(
    file: File,
    options: {
      quality: number
      maxWidth: number
      maxHeight: number
      format: string
    }
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        const { width, height } = this.calculateOptimalDimensions(
          img.width,
          img.height,
          options.maxWidth,
          options.maxHeight
        )

        canvas.width = width
        canvas.height = height

        // Draw and compress
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name, {
                  type: `image/${options.format}`,
                  lastModified: Date.now()
                })
                resolve(optimizedFile)
              } else {
                reject(new Error('Failed to optimize image'))
              }
            },
            `image/${options.format}`,
            options.quality / 100
          )
        } else {
          reject(new Error('Canvas context not available'))
        }
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Resize image
  private static async resizeImage(
    file: File,
    targetWidth: number,
    targetHeight: number
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = targetWidth
        canvas.height = targetHeight

        if (ctx) {
          // Fill with white background
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, targetWidth, targetHeight)

          // Calculate scaling to maintain aspect ratio
          const scale = Math.min(
            targetWidth / img.width,
            targetHeight / img.height
          )

          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale
          const x = (targetWidth - scaledWidth) / 2
          const y = (targetHeight - scaledHeight) / 2

          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: 'image/webp',
                  lastModified: Date.now()
                })
                resolve(resizedFile)
              } else {
                reject(new Error('Failed to resize image'))
              }
            },
            'image/webp',
            0.9
          )
        } else {
          reject(new Error('Canvas context not available'))
        }
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Get image dimensions
  private static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Calculate optimal dimensions
  private static calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight)
    
    if (ratio >= 1) {
      return { width: originalWidth, height: originalHeight }
    }

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio)
    }
  }

  // Delete image
  static async deleteImage(imagePath: string): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!supabase) {
        return { success: false, error: 'Storage service not available' }
      }
      
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([imagePath])

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  // Delete multiple images
  static async deleteMultipleImages(imagePaths: string[]): Promise<{ success: boolean; errors: string[] }> {
    try {
      if (!supabase) {
        return { success: false, errors: ['Storage service not available'] }
      }
      
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove(imagePaths)

      if (error) {
        return { success: false, errors: [error.message] }
      }

      return { success: true, errors: [] }
    } catch (error) {
      return { success: false, errors: [(error as Error).message] }
    }
  }

  // Get public URL
  static getPublicUrl(path: string): string {
    if (!supabase) {
      return ''
    }
    
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  // Generate responsive image URLs
  static generateResponsiveUrls(imagePath: string): {
    small: string
    medium: string
    large: string
    original: string
  } {
    const basePath = imagePath.replace(/\.[^/.]+$/, '') // Remove extension
    
    return {
      small: this.getPublicUrl(`${basePath}-small.webp`),
      medium: this.getPublicUrl(`${basePath}-medium.webp`),
      large: this.getPublicUrl(`${basePath}-large.webp`),
      original: this.getPublicUrl(imagePath)
    }
  }

  // Validate image file
  private static isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    return validTypes.includes(file.type) && file.size <= maxSize
  }

  // Sanitize filename
  private static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase()
  }

  // Get image metadata
  static async getImageMetadata(imagePath: string): Promise<{ data: any | null; error: string | null }> {
    try {
      // This would typically fetch from a metadata table
      // For now, return basic info
      return {
        data: {
          path: imagePath,
          url: this.getPublicUrl(imagePath),
          createdAt: new Date().toISOString()
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  }

  // Bulk operations
  static async optimizeBulk(images: string[]): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const imagePath of images) {
      try {
        if (!supabase) {
          failed++
          continue
        }
        
        // Download image
        const { data, error } = await supabase.storage
          .from(this.BUCKET_NAME)
          .download(imagePath)

        if (error || !data) {
          failed++
          continue
        }

        // Convert to File
        const file = new File([data], imagePath, { type: data.type })

        // Re-optimize
        const { error: uploadError } = await this.uploadImage(file, 'optimized')

        if (uploadError) {
          failed++
        } else {
          success++
        }
      } catch (error) {
        failed++
      }
    }

    return { success, failed }
  }
}

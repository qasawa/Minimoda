'use client'

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle, Check } from 'lucide-react'
import { ImageService } from '@/lib/services/image-service'

interface ImageUploadProps {
  value?: string[]
  onChange?: (urls: string[]) => void
  maxFiles?: number
  accept?: string
  disabled?: boolean
  className?: string
}

interface UploadState {
  file: File
  id: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

export function ImageUpload({ 
  value = [], 
  onChange, 
  maxFiles = 4, 
  accept = 'image/*',
  disabled = false,
  className = ''
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploads, setUploads] = useState<UploadState[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList) => {
    if (disabled) return
    
    const fileArray = Array.from(files).slice(0, maxFiles - value.length)
    const newUploads: UploadState[] = fileArray.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'uploading' as const
    }))

    setUploads(prev => [...prev, ...newUploads])

    // Upload files one by one
    for (const upload of newUploads) {
      try {
        const { data, error } = await ImageService.uploadImage(
          upload.file,
          'products',
          {
            quality: 85,
            maxWidth: 1200,
            maxHeight: 1200,
            format: 'webp',
            generateThumbnails: true
          }
        )

        if (error) {
          setUploads(prev => prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'error', error }
              : u
          ))
        } else if (data) {
          const imageUrl = data.optimized
          setUploads(prev => prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'success', url: imageUrl, progress: 100 }
              : u
          ))
          
          // Add to value array
          onChange?.([...value, imageUrl])
        }
      } catch (error) {
        setUploads(prev => prev.map(u => 
          u.id === upload.id 
            ? { ...u, status: 'error', error: 'Upload failed' }
            : u
        ))
      }
    }
  }, [disabled, maxFiles, value, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removeImage = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange?.(newValue)
  }

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  const canAddMore = value.length + uploads.filter(u => u.status !== 'error').length < maxFiles

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <motion.div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : disabled 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDragOver ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-8 h-8 ${
                isDragOver ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragOver ? 'Drop images here' : 'Upload product images'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop images or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports JPG, PNG, WebP • Max {maxFiles} images • Up to 10MB each
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upload Progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <div className="space-y-3">
            {uploads.map((upload) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {upload.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                  {upload.status === 'success' && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                  {upload.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {upload.file.name}
                  </p>
                  {upload.status === 'uploading' && (
                    <div className="mt-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}
                  {upload.status === 'error' && (
                    <p className="text-xs text-red-600 mt-1">
                      {upload.error || 'Upload failed'}
                    </p>
                  )}
                  {upload.status === 'success' && (
                    <p className="text-xs text-green-600 mt-1">Upload complete</p>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => removeUpload(upload.id)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Info */}
      {value.length >= maxFiles && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Maximum number of images reached ({maxFiles})
          </p>
        </div>
      )}
    </div>
  )
}

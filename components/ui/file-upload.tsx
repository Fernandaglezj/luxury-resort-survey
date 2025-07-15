"use client"

import * as React from "react"
import { Upload, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onFileSelect,
  acceptedTypes = ".csv",
  maxSize = 5,
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return "Solo se permiten archivos CSV"
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `El archivo es demasiado grande. Máximo ${maxSize}MB`
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer",
          isDragOver && "border-amber-400 bg-amber-50/10",
          selectedFile && "border-green-400 bg-green-50/10",
          error && "border-red-400 bg-red-50/10",
          disabled && "opacity-50 cursor-not-allowed",
          "border-white/30 hover:border-amber-400 hover:bg-white/5"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="space-y-2">
            <FileText className="mx-auto h-8 w-8 text-green-400" />
            <div className="text-sm text-white">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-white/60">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveFile()
              }}
              className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-red-400 transition-colors"
            >
              <X size={12} />
              Remover archivo
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-white/60" />
            <div className="text-sm text-white">
              <p className="font-medium">
                Arrastra tu archivo CSV aquí o haz clic para seleccionar
              </p>
              <p className="text-white/60">
                Máximo {maxSize}MB • Solo archivos CSV
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 border border-red-400/30 rounded-md p-3">
          {error}
        </div>
      )}
    </div>
  )
} 
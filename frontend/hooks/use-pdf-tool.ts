'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX_FILE_SIZE } from '@/lib/constants'

export type PdfToolFile = {
  id: string
  name: string
  size: number
  file: File
}

export type ToolStatus = 'idle' | 'processing' | 'success'

export type ToolError = {
  code: string
  message: string
}

export type ToolResult = {
  fileName: string
  fileSize: number
  downloadUrl: string
}

const PROCESSING_STEPS = [
  'Preparing...',
  'Uploading...',
  'Processing PDF...',
  'Finalizing...',
  'Ready...',
] as const

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:4000/api'

function createId() {
  return Math.random().toString(36).slice(2, 10)
}

function parseFilename(header: string | null, defaultName = 'processed.pdf') {
  if (!header) return defaultName

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const asciiMatch = header.match(/filename="([^"]+)"/i) ?? header.match(/filename=([^;]+)/i)
  if (asciiMatch?.[1]) {
    return asciiMatch[1].trim()
  }

  return defaultName
}

export interface UsePdfToolOptions {
  endpoint: string
  acceptTypes?: string[] // e.g. ['application/pdf'] or ['image/jpeg', 'image/png']
  minFiles?: number
  defaultOutputName?: string
}

export function usePdfTool({
  endpoint,
  acceptTypes = ['application/pdf'],
  minFiles = 1,
  defaultOutputName = 'processed.pdf'
}: UsePdfToolOptions) {
  const [files, setFiles] = useState<PdfToolFile[]>([])
  const [status, setStatus] = useState<ToolStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState<ToolError | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)

  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current)
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    }
  }, [])

  const dismissError = useCallback(() => setError(null), [])

  const clearResult = useCallback(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }
    setResult(null)
  }, [])

  const startProgress = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    setProgress(10)
    setStepIndex(0)

    progressTimer.current = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 8, 92)
        const ratio = next / 100
        const nextStep = Math.min(
          PROCESSING_STEPS.length - 1,
          Math.floor(ratio * PROCESSING_STEPS.length)
        )
        setStepIndex(nextStep)
        return next
      })
    }, 300)
  }, [])

  const stopProgress = useCallback(() => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current)
      progressTimer.current = null
    }
  }, [])

  const addFiles = useCallback(
    (list: FileList | File[] | null) => {
      if (!list) return
      const incoming = Array.from(list)
      if (incoming.length === 0) return

      let nextError: ToolError | null = null

      setFiles((prev) => {
        const next = [...prev]

        for (const file of incoming) {
          const cleanName = file.name.trim()
          const isPdfTarget = acceptTypes.some((t) => t.includes('pdf'))
          const isImageTarget = acceptTypes.some((t) => t.includes('image'))

          let isAllowedExt = false
          if (isPdfTarget) {
            isAllowedExt =
              file.type === 'application/pdf' ||
              cleanName.toLowerCase().endsWith('.pdf')
          } else if (isImageTarget) {
            isAllowedExt =
              file.type.startsWith('image/') ||
              /\.(jpe?g|png|webp|gif|bmp|tiff)$/i.test(cleanName)
          } else {
            isAllowedExt = acceptTypes.some((t) =>
              t.includes('/')
                ? file.type === t
                : cleanName.toLowerCase().endsWith(t)
            )
          }

          if (!isAllowedExt) {
            nextError = {
              code: 'unsupported',
              message: isPdfTarget
                ? `"${file.name}" isn't a PDF. Only .pdf files are supported.`
                : `"${file.name}" isn't a supported image. Only JPG, PNG, and WebP images are allowed.`
            }
            continue
          }

          if (file.size > MAX_FILE_SIZE) {
            nextError = {
              code: 'too-large',
              message: `"${file.name}" exceeds the 100MB size limit.`
            }
            continue
          }

          next.push({
            id: createId(),
            name: file.name,
            size: file.size,
            file
          })
        }

        return next
      })

      if (nextError) setError(nextError)
    },
    [acceptTypes]
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const reorderFiles = useCallback((next: PdfToolFile[]) => {
    setFiles(next)
  }, [])

  const executeTool = useCallback(
    async (extraParams: Record<string, string | number | boolean> = {}) => {
      if (files.length < minFiles) {
        setError({
          code: 'min-files',
          message: `Add at least ${minFiles} ${minFiles === 1 ? 'file' : 'files'} to process.`
        })
        return
      }

      setError(null)
      clearResult()
      setStatus('processing')
      startProgress()

      try {
        const formData = new FormData()
        files.forEach((f) => {
          formData.append('files', f.file, f.name)
        })

        Object.entries(extraParams).forEach(([k, v]) => {
          formData.append(k, String(v))
        })

        const response = await fetch(`${API_BASE_URL}/pdf${endpoint}`, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          let msg = 'Failed to process document.'
          try {
            const errJson = await response.json()
            if (errJson.error?.message) msg = errJson.error.message
          } catch {}
          throw new Error(msg)
        }

        const blob = await response.blob()
        const fileName = parseFilename(
          response.headers.get('content-disposition'),
          defaultOutputName
        )
        const downloadUrl = URL.createObjectURL(blob)

        downloadUrlRef.current = downloadUrl
        setResult({
          fileName,
          fileSize: blob.size,
          downloadUrl
        })

        stopProgress()
        setStepIndex(PROCESSING_STEPS.length - 1)
        setProgress(100)
        setStatus('success')
      } catch (toolErr) {
        stopProgress()
        setProgress(0)
        setStepIndex(0)
        setStatus('idle')
        setError({
          code: 'server',
          message:
            toolErr instanceof Error
              ? toolErr.message
              : 'An unexpected error occurred while processing.'
        })
      }
    },
    [clearResult, defaultOutputName, endpoint, files, minFiles, startProgress, stopProgress]
  )

  const reset = useCallback(() => {
    stopProgress()
    clearResult()
    setFiles([])
    setStatus('idle')
    setProgress(0)
    setStepIndex(0)
    setError(null)
  }, [clearResult, stopProgress])

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  return {
    files,
    status,
    progress,
    statusMessage: PROCESSING_STEPS[stepIndex],
    error,
    totalSize,
    result,
    canExecute: files.length >= minFiles,
    addFiles,
    removeFile,
    reorderFiles,
    executeTool,
    reset,
    dismissError
  }
}

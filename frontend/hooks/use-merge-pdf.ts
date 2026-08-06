'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX_FILE_SIZE } from '@/lib/constants'
import { consumePendingFiles } from '@/lib/pending-files'

export type PdfFile = {
  id: string
  name: string
  size: number
  file: File
}

export type MergeStatus = 'idle' | 'processing' | 'success'

export type UploadError = {
  code: 'unsupported' | 'too-large' | 'duplicate' | 'empty' | 'server'
  message: string
}

type MergeResult = {
  fileName: string
  fileSize: number
  downloadUrl: string
}

import { getApiBaseUrl } from '@/lib/api-config'

const PROCESSING_STEPS = [
  'Preparing...',
  'Uploading...',
  'Merging...',
  'Finalizing...',
  'Ready...',
] as const

function createId() {
  return Math.random().toString(36).slice(2, 10)
}

function parseFilename(header: string | null) {
  if (!header) {
    return 'merged.pdf'
  }

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const asciiMatch = header.match(/filename="([^"]+)"/i) ?? header.match(/filename=([^;]+)/i)
  if (asciiMatch?.[1]) {
    return asciiMatch[1].trim()
  }

  return 'merged.pdf'
}

async function parseMergeError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      error?: {
        message?: string
      }
    }

    if (payload.error?.message) {
      return payload.error.message
    }
  } catch {
    return 'Unable to merge the selected PDF files.'
  }

  return 'Unable to merge the selected PDF files.'
}

export function useMergePdf() {
  const [files, setFiles] = useState<PdfFile[]>([])
  const [status, setStatus] = useState<MergeStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState<UploadError | null>(null)
  const [result, setResult] = useState<MergeResult | null>(null)

  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current)
      }

      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current)
      }
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
    if (progressTimer.current) {
      clearInterval(progressTimer.current)
    }

    setProgress(8)
    setStepIndex(0)

    progressTimer.current = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 7, 92)
        const ratio = next / 100
        const nextStep = Math.min(
          PROCESSING_STEPS.length - 1,
          Math.floor(ratio * PROCESSING_STEPS.length),
        )

        setStepIndex(nextStep)
        return next
      })
    }, 350)
  }, [])

  const stopProgress = useCallback(() => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current)
      progressTimer.current = null
    }
  }, [])

  const addFiles = useCallback((list: FileList | File[] | null) => {
    if (!list) return

    const incoming = Array.from(list)
    if (incoming.length === 0) return

    let nextError: UploadError | null = null

    setFiles((prev) => {
      const next = [...prev]

      for (const file of incoming) {
        const isPdf =
          file.type === 'application/pdf' ||
          file.name.toLowerCase().endsWith('.pdf')

        if (!isPdf) {
          nextError = {
            code: 'unsupported',
            message: `"${file.name}" isn't a PDF. Only .pdf files are supported.`,
          }
          continue
        }

        if (file.size > MAX_FILE_SIZE) {
          nextError = {
            code: 'too-large',
            message: `"${file.name}" is larger than 100MB.`,
          }
          continue
        }

        const duplicate = next.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size,
        )

        if (duplicate) {
          nextError = {
            code: 'duplicate',
            message: `"${file.name}" is already in your list.`,
          }
          continue
        }

        next.push({
          id: createId(),
          name: file.name,
          size: file.size,
          file,
        })
      }

      return next
    })

    if (nextError) {
      setError(nextError)
    }
  }, [])

  useEffect(() => {
    const pending = consumePendingFiles()
    if (pending.length > 0) {
      addFiles(pending)
    }
  }, [addFiles])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }, [])

  const reorder = useCallback((next: PdfFile[]) => {
    setFiles(next)
  }, [])

  const merge = useCallback(async () => {
    if (files.length < 2) {
      setError({
        code: 'empty',
        message: 'Add at least two PDF files to merge.',
      })
      return
    }

    setError(null)
    clearResult()
    setStatus('processing')
    startProgress()

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file.file, file.name)
      })

      const response = await fetch(`${getApiBaseUrl()}/pdf/merge`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(await parseMergeError(response))
      }

      const blob = await response.blob()
      const fileName = parseFilename(response.headers.get('content-disposition'))
      const downloadUrl = URL.createObjectURL(blob)

      downloadUrlRef.current = downloadUrl
      setResult({
        fileName,
        fileSize: blob.size,
        downloadUrl,
      })

      stopProgress()
      setStepIndex(PROCESSING_STEPS.length - 1)
      setProgress(100)
      setStatus('success')
    } catch (mergeError) {
      stopProgress()
      setProgress(0)
      setStepIndex(0)
      setStatus('idle')
      setError({
        code: 'server',
        message:
          mergeError instanceof Error
            ? mergeError.message
            : 'Unable to merge the selected PDF files.',
      })
    }
  }, [clearResult, files, startProgress, stopProgress])

  const reset = useCallback(() => {
    stopProgress()
    clearResult()
    setFiles([])
    setStatus('idle')
    setProgress(0)
    setStepIndex(0)
    setError(null)
  }, [clearResult, stopProgress])

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

  return {
    files,
    status,
    progress,
    statusMessage: PROCESSING_STEPS[stepIndex],
    error,
    totalSize,
    result,
    canMerge: files.length >= 2,
    addFiles,
    removeFile,
    reorder,
    merge,
    reset,
    dismissError,
  }
}

export { formatBytes } from '@/lib/format'

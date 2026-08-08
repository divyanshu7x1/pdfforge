'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { CloudUpload, FolderOpen, ShieldCheck } from 'lucide-react'
import { MAX_FILE_SIZE_LABEL } from '@/lib/constants'

type UploadZoneProps = {
  onFiles: (files: FileList | File[]) => void
  compact?: boolean
  accept?: string
  acceptLabel?: string
  title?: string
}

export function UploadZone({
  onFiles,
  compact = false,
  accept = 'application/pdf',
  acceptLabel = 'PDF only',
  title = 'Drop document onto the workbench',
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  function openPicker() {
    inputRef.current?.click()
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current += 1
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)
    onFiles(e.dataTransfer.files)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: compact ? 0 : 0.24 }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files by clicking or dragging them here"
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openPicker()
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`hand-drawn-border cursor-pointer text-center relative overflow-hidden transition-all duration-300 ${
          compact ? 'p-6' : 'p-8 sm:p-12'
        } ${
          isDragging
            ? 'bg-sky-mist/60 border-sky-azure scale-[1.01]'
            : 'bg-gradient-to-b from-parchment-100/60 to-sky-sunlit/40 hover:bg-sky-mist/30'
        }`}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl bg-sky-mist border border-sky-breeze/40 flex items-center justify-center text-sky-deep group-hover:scale-105 transition-transform duration-300 shadow-sm">
          <CloudUpload className="w-8 h-8 sm:w-10 sm:h-10 text-sky-azure" aria-hidden="true" />
        </div>

        <h3 className="font-display text-lg sm:text-xl text-artisan-ink font-medium mb-1">
          {isDragging ? 'Release to add your files' : title}
        </h3>
        <p className="text-xs text-parchment-800 mb-5 font-light">
          Accepts {acceptLabel} up to {MAX_FILE_SIZE_LABEL}
        </p>

        <button
          type="button"
          className="px-5 py-2.5 rounded-xl bg-meadow-emerald text-white text-xs sm:text-sm font-medium shadow-sm hover:bg-meadow-forest transition-all inline-flex items-center gap-2"
        >
          <FolderOpen className="w-4 h-4" aria-hidden="true" />
          <span>Choose Files</span>
        </button>

        <div className="mt-4 text-[11px] text-parchment-800 flex items-center justify-center gap-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-meadow-emerald" aria-hidden="true" />
          <span>Encrypted TLS Transit &amp; Server Processing</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          onChange={(e) => {
            onFiles(e.target.files ?? [])
            e.target.value = ''
          }}
        />
      </div>
    </motion.div>
  )
}
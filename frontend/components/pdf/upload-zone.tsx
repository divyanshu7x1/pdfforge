'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { CloudUpload, FileText, ShieldCheck } from 'lucide-react'
import { MAX_FILE_SIZE_LABEL } from '@/lib/constants'
import { cn } from '@/lib/utils'

type UploadZoneProps = {
  onFiles: (files: FileList | File[]) => void
  /** When true, renders a more compact drop zone for secondary uploads. */
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
  title = 'Drag & drop your PDFs here',
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
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl border border-dashed text-center backdrop-blur-xl transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          compact ? 'gap-3 px-5 py-8 sm:py-10' : 'px-6 py-14 sm:py-20',
          isDragging
            ? 'scale-[1.01] border-primary bg-primary/10 shadow-premium'
            : 'border-border bg-card/40 hover:border-primary/50 hover:bg-card/60',
        )}
      >
        {/* Sheen sweep on hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        <motion.span
          animate={isDragging ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className={cn(
            'bg-premium shadow-premium flex items-center justify-center rounded-2xl text-primary-foreground',
            compact ? 'size-12' : 'size-16',
          )}
        >
          <CloudUpload className={compact ? 'size-6' : 'size-7'} />
        </motion.span>

        <div>
          <p
            className={cn(
              'font-semibold tracking-tight text-foreground',
              compact ? 'text-base' : 'text-lg',
            )}
          >
            {isDragging ? 'Release to add your files' : title}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            or select files from your device to get started
          </p>
        </div>

        {!compact && (
          <span
            className="ring-highlight pointer-events-none inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-black/20"
            aria-hidden="true"
          >
            <FileText className="size-4" />
            Browse files
          </span>
        )}

        {/* Format + size + privacy badges */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
          <span className="ring-highlight inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {acceptLabel}
          </span>
          <span className="ring-highlight inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            Max {MAX_FILE_SIZE_LABEL} per file
          </span>
          <span className="ring-highlight inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Private &amp; secure
          </span>
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
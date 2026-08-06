'use client'

import { motion } from 'motion/react'
import { Check, Download, FileText, RotateCcw } from 'lucide-react'
import { formatBytes } from '@/lib/format'

type SuccessSectionProps = {
  fileName: string
  fileSize: number
  downloadUrl: string
  onReset: () => void
}

export function SuccessSection({
  fileName,
  fileSize,
  downloadUrl,
  onReset,
}: SuccessSectionProps) {
  function handleDownload() {
    const anchor = document.createElement('a')
    anchor.href = downloadUrl
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-live="polite"
      aria-labelledby="merge-success-title"
      className="ring-highlight relative overflow-hidden rounded-3xl border border-border bg-card/40 px-6 py-14 text-center backdrop-blur-xl sm:px-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative">
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          className="bg-premium shadow-premium mx-auto flex size-16 items-center justify-center rounded-2xl text-primary-foreground"
        >
          <Check className="size-8" strokeWidth={2.5} />
        </motion.span>

        <h2
          id="merge-success-title"
          className="mt-6 text-2xl font-semibold tracking-tight text-foreground"
        >
          Your merged PDF is ready
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          All pages combined into one clean document.
        </p>

        <div className="ring-highlight mx-auto mt-8 flex max-w-md items-center gap-3 rounded-2xl border border-border bg-card/60 p-3 text-left backdrop-blur-xl">
          <span className="bg-premium shadow-premium flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {fileName}
            </p>
            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
              {formatBytes(fileSize)}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <motion.button
            type="button"
            onClick={handleDownload}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label={`Download ${fileName}`}
            className="bg-premium shadow-premium inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-primary-foreground sm:w-auto"
          >
            <Download className="size-4" />
            Download PDF
          </motion.button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card/50 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-card/70 focus-visible:border-primary/40 focus-visible:bg-card/70 sm:w-auto"
          >
            <RotateCcw className="size-4" />
            Merge another
          </button>
        </div>
      </div>
    </motion.section>
  )
}

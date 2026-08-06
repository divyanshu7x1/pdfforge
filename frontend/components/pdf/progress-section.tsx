'use client'

import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'

type ProgressSectionProps = {
  progress: number
  statusMessage: string
  fileCount: number
}

export function ProgressSection({
  progress,
  statusMessage,
  fileCount,
}: ProgressSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="merge-progress-title"
      aria-busy="true"
      className="ring-highlight relative overflow-hidden rounded-3xl border border-border bg-card/40 px-6 py-14 text-center backdrop-blur-xl sm:px-12"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative">
        <span
          aria-hidden="true"
          className="bg-premium shadow-premium mx-auto flex size-16 items-center justify-center rounded-2xl text-primary-foreground"
        >
          <Loader2 className="size-7 animate-spin" />
        </span>

        <h2
          id="merge-progress-title"
          className="mt-6 text-xl font-semibold tracking-tight text-foreground"
        >
          Merging your documents
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Combining {fileCount} PDFs into a single file. Hang tight.
        </p>

        {/* Announce only the discrete step label, not every percentage tick. */}
        <p className="sr-only" aria-live="polite">
          {statusMessage}
        </p>

        {/* Progress bar */}
        <div className="mx-auto mt-8 max-w-md">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-foreground">{statusMessage}</span>
            <span className="tabular-nums text-muted-foreground">{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Merge progress"
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary"
          >
            <motion.div
              className="bg-premium h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear', duration: 0.15 }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}

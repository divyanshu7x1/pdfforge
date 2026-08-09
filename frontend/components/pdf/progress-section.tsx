'use client'

import { motion } from 'motion/react'
import { Sun } from 'lucide-react'

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
      className="p-6 sm:p-8 rounded-2xl bg-sky-mist/50 border border-sky-azure/30 text-center"
    >
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3">
        <div className="absolute inset-0 rounded-full border-4 border-sky-breeze/30 border-t-sky-azure animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-sky-azure">
          <Sun className="w-6 h-6 animate-pulse" aria-hidden="true" />
        </div>
      </div>
      <h2 id="merge-progress-title" className="font-display text-base sm:text-lg font-medium text-artisan-ink">
        {statusMessage}
      </h2>
      <p className="text-xs text-parchment-800 mt-1 font-mono">
        Processing {fileCount} file{fileCount === 1 ? '' : 's'} cleanly via PDFYaar API
      </p>

      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Merge progress"
        className="w-full bg-parchment-300 h-2.5 rounded-full mt-4 overflow-hidden"
      >
        <motion.div
          className="bg-gradient-to-r from-sky-azure to-meadow-moss h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear', duration: 0.15 }}
        />
      </div>
    </motion.section>
  )
}

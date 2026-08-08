'use client'

import { motion } from 'motion/react'
import { Check, Download } from 'lucide-react'
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
      aria-labelledby="tool-success-title"
      className="p-5 sm:p-6 rounded-2xl bg-meadow-emerald/10 border border-meadow-emerald/30 text-center space-y-3"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-meadow-emerald text-white flex items-center justify-center shadow-sm">
        <Check className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
      </div>
      <div>
        <h2 id="tool-success-title" className="font-display text-lg sm:text-xl text-artisan-ink font-medium">
          Document Successfully Forged!
        </h2>
        <p className="text-xs text-parchment-800 mt-0.5 font-mono">
          {fileName} ({formatBytes(fileSize)})
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleDownload}
          aria-label={`Download ${fileName}`}
          className="px-5 py-2.5 rounded-xl bg-meadow-emerald text-white text-xs sm:text-sm font-medium shadow-md hover:bg-meadow-forest transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Download File</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2.5 rounded-xl bg-parchment-200 text-artisan-ink text-xs sm:text-sm font-medium border border-parchment-300 hover:bg-parchment-300 transition-all"
        >
          Forge Another
        </button>
      </div>
    </motion.section>
  )
}

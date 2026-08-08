'use client'

import { motion } from 'motion/react'
import { Sparkles, ArrowRight } from 'lucide-react'

type MergeButtonProps = {
  disabled: boolean
  count: number
  onMerge: () => void
}

export function MergeButton({ disabled, count, onMerge }: MergeButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        type="button"
        onClick={onMerge}
        disabled={disabled}
        aria-label={
          disabled
            ? 'Add at least two PDF files to merge'
            : `Merge ${count} PDF${count === 1 ? '' : 's'}`
        }
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={`px-6 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-artisan ${
          disabled
            ? 'cursor-not-allowed bg-parchment-300 text-parchment-800 opacity-60'
            : 'bg-artisan-terracotta text-white hover:bg-artisan-clay'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>Merge {count > 0 ? `${count} PDFs` : 'PDFs'}</span>
        {!disabled && <ArrowRight className="w-4 h-4" />}
      </motion.button>

      {disabled && (
        <p className="text-xs text-parchment-800 font-mono">
          Add at least two files to enable merging.
        </p>
      )}
    </div>
  )
}

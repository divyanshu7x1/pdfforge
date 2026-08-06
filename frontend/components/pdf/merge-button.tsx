'use client'

import { motion } from 'motion/react'
import { Layers, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
        whileHover={disabled ? undefined : { scale: 1.03 }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(
          'group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto',
          disabled
            ? 'cursor-not-allowed border border-border bg-secondary text-muted-foreground'
            : 'bg-premium shadow-premium text-primary-foreground',
        )}
      >
        <Layers className="size-4" />
        Merge {count > 0 ? `${count} PDFs` : 'PDFs'}
        {!disabled && (
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        )}
      </motion.button>

      {disabled && (
        <p className="text-xs text-muted-foreground">
          Add at least two files to enable merging.
        </p>
      )}
    </div>
  )
}

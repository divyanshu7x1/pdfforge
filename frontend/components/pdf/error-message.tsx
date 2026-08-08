'use client'

import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, X } from 'lucide-react'

type ErrorMessageProps = {
  error: { message: string; code?: string } | null
  onDismiss: () => void
}

export function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
  return (
    <AnimatePresence>
      {error ? (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-artisan-terracotta/30 bg-artisan-terracotta/10 px-4 py-3 text-artisan-terracotta font-mono text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="flex-1 leading-relaxed break-words">{error.message}</p>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss error"
              className="p-1 rounded text-artisan-terracotta hover:bg-artisan-terracotta/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

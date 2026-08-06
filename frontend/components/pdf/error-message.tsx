'use client'

import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, X } from 'lucide-react'
import type { UploadError } from '@/hooks/use-merge-pdf'

type ErrorMessageProps = {
  error: { message: string; code?: string } | null
  onDismiss: () => void
}

/** Inline, dismissible error banner. Never uses browser alerts. */
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
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 backdrop-blur-xl">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <AlertTriangle className="size-3.5" />
            </span>
            <p className="flex-1 text-sm leading-relaxed text-foreground">
              {error.message}
            </p>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss error"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

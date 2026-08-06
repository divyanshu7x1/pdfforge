'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { MergeStatus } from '@/hooks/use-merge-pdf'

type ToolWorkspaceProps = {
  status: MergeStatus
  idle: ReactNode
  processing: ReactNode
  success: ReactNode
}

/**
 * Shared state-driven layout shell for tool pages.
 * Handles enter/exit transitions between idle, processing, and success views.
 */
export function ToolWorkspace({
  status,
  idle,
  processing,
  success,
}: ToolWorkspaceProps) {
  return (
    <AnimatePresence mode="wait">
      {status === 'idle' && (
        <motion.div
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {idle}
        </motion.div>
      )}

      {status === 'processing' && (
        <motion.div
          key="processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {processing}
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {success}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

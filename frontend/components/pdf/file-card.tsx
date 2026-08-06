'use client'

import { memo } from 'react'
import { Reorder, useDragControls, useMotionValue } from 'motion/react'
import { FileText, GripVertical, X } from 'lucide-react'
import type { PdfFile } from '@/hooks/use-merge-pdf'
import { formatBytes } from '@/lib/format'

type FileCardProps = {
  file: PdfFile
  index: number
  onRemove: (id: string) => void
  onMove: (index: number, direction: -1 | 1) => void
}

/**
 * A draggable, reorderable file card. Dragging is initiated from the grip
 * handle only, so the rest of the card stays clickable/scrollable.
 */
function FileCardComponent({
  file,
  index,
  onRemove,
  onMove,
}: FileCardProps) {
  const controls = useDragControls()
  const y = useMotionValue(0)

  return (
    <Reorder.Item
      value={file}
      id={file.id}
      style={{ y }}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className="ring-highlight group flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-xl transition-colors hover:border-primary/40"
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label={`Reorder ${file.name}. Use arrow keys to move up or down.`}
        aria-keyshortcuts="ArrowUp ArrowDown"
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault()
            onMove(index, -1)
          } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            onMove(index, 1)
          }
        }}
        className="flex size-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:bg-secondary focus-visible:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      {/* Order badge */}
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold tabular-nums text-muted-foreground"
        aria-hidden="true"
      >
        {index + 1}
      </span>

      {/* PDF icon */}
      <span
        className="bg-premium shadow-premium flex size-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground"
        aria-hidden="true"
      >
        <FileText className="size-5" />
      </span>

      {/* Meta */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
        <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
          {formatBytes(file.size)}
        </p>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        aria-label={`Remove ${file.name}`}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive focus-visible:bg-destructive/15 focus-visible:text-destructive"
      >
        <X className="size-4" />
      </button>
    </Reorder.Item>
  )
}

export const FileCard = memo(FileCardComponent)

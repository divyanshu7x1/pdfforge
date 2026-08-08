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
      className="flex items-center gap-3 rounded-xl border border-parchment-300 bg-parchment-50 p-3 shadow-sm transition-colors hover:border-sky-azure"
    >
      <button
        type="button"
        aria-label={`Reorder ${file.name}`}
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
        className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-parchment-800 hover:bg-parchment-200 transition-colors"
      >
        <GripVertical className="size-4" />
      </button>

      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-parchment-200 text-xs font-mono font-bold text-parchment-800">
        {index + 1}
      </span>

      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-mist text-sky-azure">
        <FileText className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-artisan-ink">{file.name}</p>
        <p className="mt-0.5 text-[11px] font-mono text-parchment-800">
          {formatBytes(file.size)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(file.id)}
        aria-label={`Remove ${file.name}`}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-artisan-terracotta hover:bg-artisan-terracotta/10 transition-colors"
      >
        <X className="size-4" />
      </button>
    </Reorder.Item>
  )
}

export const FileCard = memo(FileCardComponent)

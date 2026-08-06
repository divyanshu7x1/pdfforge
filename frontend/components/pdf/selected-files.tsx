'use client'

import { AnimatePresence, motion, Reorder } from 'motion/react'
import { Plus } from 'lucide-react'
import { FileCard } from './file-card'
import type { PdfFile } from '@/hooks/use-merge-pdf'
import { formatBytes } from '@/lib/format'

type SelectedFilesProps = {
  files: PdfFile[]
  totalSize: number
  onReorder: (files: PdfFile[]) => void
  onRemove: (id: string) => void
  onAddMore: () => void
}

export function SelectedFiles({
  files,
  totalSize,
  onReorder,
  onRemove,
  onAddMore,
}: SelectedFilesProps) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= files.length) return

    const next = [...files]
    ;[next[index], next[target]] = [next[target], next[index]]
    onReorder(next)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Selected files"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Selected files
          </h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            {files.length} {files.length === 1 ? 'file' : 'files'} ·{' '}
            {formatBytes(totalSize)}
          </span>
        </div>
        <button
          type="button"
          onClick={onAddMore}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:border-primary/40 focus-visible:text-foreground"
        >
          <Plus className="size-3.5" />
          Add more
        </button>
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        Drag the handles to set the order pages appear in the merged document.
      </p>

      <Reorder.Group
        axis="y"
        values={files}
        onReorder={onReorder}
        className="flex flex-col gap-2.5"
      >
        <AnimatePresence initial={false}>
          {files.map((file, index) => (
            <FileCard
              key={file.id}
              file={file}
              index={index}
              onRemove={onRemove}
              onMove={move}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </motion.section>
  )
}

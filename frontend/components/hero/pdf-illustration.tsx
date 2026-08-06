'use client'

import { motion } from 'motion/react'
import { FileText, Sparkles, Check } from 'lucide-react'

export function PdfIllustration() {
  return (
    <motion.div
      className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      style={{ perspective: 1200 }}
    >
      {/* Ambient glow behind the stack */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-6 rounded-[2.5rem] blur-3xl"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, var(--primary), var(--accent-glow), var(--chart-3), var(--primary))',
          opacity: 0.45,
        }}
        animate={{ rotate: [0, 360], opacity: [0.35, 0.5, 0.35] }}
        transition={{ rotate: { duration: 28, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }, opacity: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } }}
      />

      {/* Continuous float wrapper */}
      <motion.div
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ y: [0, -16, 0], rotateX: [6, 2, 6], rotateY: [-12, -8, -12] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      >
        {/* Back card */}
        <div
          className="absolute -right-10 top-6 h-64 w-52 rounded-2xl border border-border bg-card/60 backdrop-blur-sm"
          style={{ transform: 'translateZ(-60px) rotate(8deg)' }}
        />
        {/* Middle card */}
        <div
          className="absolute -left-8 top-3 h-64 w-52 rounded-2xl border border-border bg-card/70 backdrop-blur-sm"
          style={{ transform: 'translateZ(-30px) rotate(-6deg)' }}
        />

        {/* Front PDF document */}
        <div
          className="glow-ring relative h-72 w-56 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-b from-card to-secondary p-5"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-center gap-2">
            <span className="bg-premium shadow-premium flex size-9 items-center justify-center rounded-lg text-primary-foreground">
              <FileText className="size-4" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-muted-foreground">
              report.pdf
            </span>
          </div>

          <div className="mt-5 space-y-2.5">
            <div className="h-2.5 w-4/5 rounded-full bg-foreground/15" />
            <div className="h-2.5 w-full rounded-full bg-foreground/10" />
            <div className="h-2.5 w-2/3 rounded-full bg-foreground/10" />
          </div>

          <div className="mt-5 h-20 rounded-lg border border-border bg-background/40" />

          <div className="mt-4 space-y-2.5">
            <div className="h-2.5 w-full rounded-full bg-foreground/10" />
            <div className="h-2.5 w-3/4 rounded-full bg-foreground/10" />
          </div>

          <div className="absolute bottom-4 left-5 flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1">
            <Check className="size-3 text-primary" />
            <span className="text-[10px] font-medium text-foreground">Compressed</span>
          </div>
        </div>

        {/* Floating AI badge */}
        <motion.div
          className="absolute -right-6 -top-6 flex items-center gap-1.5 rounded-full border border-accent-glow/40 bg-card/80 px-3 py-1.5 backdrop-blur-md"
          style={{ transform: 'translateZ(80px)' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 0.5 }}
        >
          <Sparkles className="size-3.5 text-accent-glow" />
          <span className="text-[11px] font-semibold text-foreground">AI Ready</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

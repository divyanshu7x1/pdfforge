'use client'

import { motion } from 'motion/react'
import { Layers } from 'lucide-react'

import { SECTION_EASE } from '@/lib/constants'

const EASE = SECTION_EASE

type PageHeaderProps = {
  eyebrow: string
  title: string
  highlight?: string
  subtitle: string
}

export function PageHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
}: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.span
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="ring-highlight inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-xl"
      >
        <Layers className="size-3.5 text-primary" />
        {eyebrow}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
        className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-5xl"
      >
        {title} {highlight ? <span className="text-gradient">{highlight}</span> : null}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
        className="mx-auto mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground"
      >
        {subtitle}
      </motion.p>
    </div>
  )
}

'use client'

import { motion } from 'motion/react'
import { Layers } from 'lucide-react'

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
    <div className="mx-auto max-w-2xl text-center space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-mist border border-sky-breeze/30 text-sky-deep text-xs font-semibold tracking-wide"
      >
        <Layers className="w-3.5 h-3.5 text-sky-azure" />
        <span>{eyebrow}</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-artisan-ink leading-tight"
      >
        {title}{' '}
        {highlight ? (
          <span className="italic font-normal text-sky-azure underline decoration-artisan-ochre/50 decoration-wavy">
            {highlight}
          </span>
        ) : null}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16 }}
        className="text-xs sm:text-sm text-parchment-800 font-light max-w-md mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  )
}

'use client'

import { motion } from 'motion/react'
import { Zap, ShieldCheck, Layers, Infinity as InfinityIcon } from 'lucide-react'

import { SECTION_EASE } from '@/lib/constants'

const FEATURES = [
  {
    icon: Zap,
    title: 'Blazing fast',
    desc: 'Documents are processed in-browser and on the edge, so most tasks finish before you blink.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    desc: 'Files are encrypted in transit, auto-deleted after an hour, and never used to train anything.',
  },
  {
    icon: Layers,
    title: 'Batch everything',
    desc: 'Queue dozens of files at once and apply the same operation across all of them in one pass.',
  },
  {
    icon: InfinityIcon,
    title: 'No limits that matter',
    desc: 'Generous free usage, no watermarks on your work, and no surprise paywalls mid-task.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: SECTION_EASE },
  },
}

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 border-t border-border/60 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Sticky heading */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: SECTION_EASE }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <span className="ring-highlight inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-xl">
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
              Why PDFForge
            </span>

            <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
              Built for speed, <span className="text-gradient">trusted</span> with your files
            </h2>

            <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
              Every detail is engineered to get you from raw file to finished document without
              friction — and without ever compromising your privacy.
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={item}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="ring-highlight group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/40 p-7 backdrop-blur-xl transition-colors duration-300 hover:border-primary/40"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
                />
                <span className="bg-premium shadow-premium relative flex size-12 items-center justify-center rounded-2xl text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5" />
                </span>
                <h3 className="relative mt-5 text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

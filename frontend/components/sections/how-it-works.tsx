'use client'

import { motion } from 'motion/react'
import { Upload, SlidersHorizontal, Download } from 'lucide-react'

import { SECTION_EASE } from '@/lib/constants'

const STEPS = [
  {
    icon: Upload,
    step: '01',
    title: 'Drop your file',
    desc: 'Drag a PDF in or pick one from your device. Batch uploads welcome.',
  },
  {
    icon: SlidersHorizontal,
    step: '02',
    title: 'Choose your tool',
    desc: 'Merge, compress, convert, sign, or ask the AI. Tune it exactly how you need.',
  },
  {
    icon: Download,
    step: '03',
    title: 'Download instantly',
    desc: 'Grab your polished result in seconds or send it straight to a teammate.',
  },
] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
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

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 border-t border-border/60 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: SECTION_EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="ring-highlight inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-xl">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
            How it works
          </span>
          <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
            Three steps, <span className="text-gradient">zero</span> friction
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            From messy file to finished document in the time it takes to read this sentence.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="relative mt-16 grid gap-6 md:grid-cols-3"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-11 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />

          {STEPS.map(({ icon: Icon, step, title, desc }) => (
            <motion.div
              key={step}
              variants={item}
              className="ring-highlight group relative flex flex-col items-start overflow-hidden rounded-3xl border border-border bg-card/40 p-7 backdrop-blur-xl"
            >
              <div className="flex w-full items-center justify-between">
                <span className="bg-premium shadow-premium flex size-12 items-center justify-center rounded-2xl text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="text-4xl font-semibold tracking-tight text-border transition-colors duration-300 group-hover:text-primary/30">
                  {step}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

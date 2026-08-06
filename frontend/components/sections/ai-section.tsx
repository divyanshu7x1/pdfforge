'use client'

import { motion } from 'motion/react'
import { Sparkles, MessageSquareText, FileSearch, WandSparkles, Send } from 'lucide-react'

import { SECTION_EASE } from '@/lib/constants'

const CAPABILITIES = [
  { icon: FileSearch, label: 'Summarize any document in seconds' },
  { icon: MessageSquareText, label: 'Ask questions and get cited answers' },
  { icon: WandSparkles, label: 'Rewrite, translate, and reformat pages' },
]

export function AiSection() {
  return (
    <section
      id="ai"
      className="relative scroll-mt-24 overflow-hidden border-t border-border/60 py-24 sm:py-32"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[36rem] -translate-y-1/2"
        style={{
          background:
            'radial-gradient(50% 50% at 70% 50%, color-mix(in oklch, var(--accent-glow) 16%, transparent), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: SECTION_EASE }}
        >
          <span className="ring-highlight inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-xl">
            <Sparkles className="size-3 text-primary" />
            Forge Assistant
          </span>

          <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
            Your documents, now <span className="text-gradient">intelligent</span>
          </h2>

          <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            An AI assistant that reads alongside you. Chat with any PDF, extract what matters, and
            turn dense files into clear answers — grounded in the source.
          </p>

          <ul className="mt-8 space-y-3">
            {CAPABILITIES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-card/50 text-primary backdrop-blur-xl">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Chat mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: SECTION_EASE, delay: 0.1 }}
          className="ring-highlight relative overflow-hidden rounded-3xl border border-border bg-card/50 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 border-b border-border/60 pb-4">
            <span className="bg-premium shadow-premium flex size-8 items-center justify-center rounded-lg text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Forge Assistant</p>
              <p className="text-[11px] text-muted-foreground">Reading Q3-Report.pdf · 42 pages</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_1px_var(--primary)]" />
              Online
            </span>
          </div>

          <div className="space-y-4 py-5">
            <div className="flex justify-end">
              <p className="max-w-[75%] rounded-2xl rounded-br-md bg-secondary px-4 py-2.5 text-sm text-foreground">
                What were the three biggest cost drivers this quarter?
              </p>
            </div>
            <div className="flex justify-start">
              <div className="bg-premium max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm text-primary-foreground shadow-premium">
                The top drivers were cloud infrastructure (+18%), headcount in R&D (+12%), and
                marketing spend (+9%). Full breakdown is on page 14.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-card/60 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/60 p-2 pl-4">
            <span className="flex-1 text-sm text-muted-foreground">Ask anything about this PDF…</span>
            <span className="bg-premium shadow-premium flex size-9 items-center justify-center rounded-xl text-primary-foreground">
              <Send className="size-4" />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

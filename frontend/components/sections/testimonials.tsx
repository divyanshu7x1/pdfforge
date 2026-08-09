'use client'

import { motion } from 'motion/react'
import { Star } from 'lucide-react'

import { SECTION_EASE } from '@/lib/constants'

const TESTIMONIALS = [
  {
    quote:
      'We replaced three separate subscriptions with PDFYaar. The batch tools alone save our ops team hours every single week.',
    name: 'Mara Ellison',
    role: 'Head of Operations, Northwind',
    initials: 'ME',
  },
  {
    quote:
      'The AI assistant is genuinely useful — I drop in a 60-page contract and get the risky clauses summarized with citations.',
    name: 'David Okafor',
    role: 'Corporate Counsel, Lumen Legal',
    initials: 'DO',
  },
  {
    quote:
      'Fast, private, and it just works on every device. My students never have to install anything to submit clean PDFs.',
    name: 'Priya Nair',
    role: 'Lecturer, Ashford University',
    initials: 'PN',
  },
  {
    quote:
      'Compression quality is unreal. Files drop 80% in size and still look crisp when we send proofs to clients.',
    name: 'Tomás Rivera',
    role: 'Creative Director, Studio Vale',
    initials: 'TR',
  },
  {
    quote:
      'Signing and sending is one flow now. Deals that took a day of back-and-forth close in an afternoon.',
    name: 'Hannah Schmidt',
    role: 'Founder, Resend Labs',
    initials: 'HS',
  },
  {
    quote:
      'Rock-solid reliability at scale. We push thousands of documents a month and have never lost one.',
    name: 'Kenji Watanabe',
    role: 'Platform Lead, Kaizen Health',
    initials: 'KW',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: SECTION_EASE },
  },
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
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
            Loved by teams
          </span>
          <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
            Trusted by <span className="text-gradient">2 million</span> document wranglers
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            From solo founders to enterprise teams, PDFYaar is the tool people keep open in a tab
            all day.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
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
              <div className="relative flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="relative mt-4 flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                {`"${t.quote}"`}
              </blockquote>
              <figcaption className="relative mt-6 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground">
                  {t.initials}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

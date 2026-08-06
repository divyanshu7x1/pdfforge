'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Combine,
  Scissors,
  Minimize2,
  RotateCw,
  FileType2,
  FileSignature,
  Lock,
  Stamp,
  FileOutput,
  ScanText,
  Crop,
  Hash,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'

const MotionLink = motion.create(Link)

type Tool = {
  icon: LucideIcon
  title: string
  desc: string
  /** Route for a shipped tool. Tools without an href are marked "Soon". */
  href?: string
}

const TOOLS: Tool[] = [
  { icon: Combine, title: 'Merge', desc: 'Combine multiple PDFs into one clean document, in any order.', href: '/merge' },
  { icon: Scissors, title: 'Split', desc: 'Extract pages or break a large file into separate documents.', href: '/split' },
  { icon: Minimize2, title: 'Compress', desc: 'Shrink file size dramatically while keeping crisp quality.', href: '/compress' },
  { icon: RotateCw, title: 'Rotate', desc: 'Fix orientation across pages with a single click.', href: '/rotate' },
  { icon: FileType2, title: 'Word → PDF', desc: 'Convert Word (.docx, .doc) files to clean PDF documents.', href: '/word-to-pdf' },
  { icon: FileOutput, title: 'PDF → Word', desc: 'Extract text and layout from PDF into editable Word (.docx).', href: '/pdf-to-word' },
  { icon: FileType2, title: 'Excel → PDF', desc: 'Convert Excel spreadsheets (.xlsx) to formatted PDF tables.', href: '/excel-to-pdf' },
  { icon: FileType2, title: 'PowerPoint → PDF', desc: 'Convert PowerPoint (.pptx) slides to portable PDF documents.', href: '/powerpoint-to-pdf' },
  { icon: FileSignature, title: 'Images → PDF', desc: 'Convert JPG, PNG and WebP images into a single PDF.', href: '/images-to-pdf' },
  { icon: FileOutput, title: 'PDF → Images', desc: 'Extract PDF pages as high-quality downloadable images.', href: '/pdf-to-images' },
  { icon: Lock, title: 'Protect', desc: 'Encrypt with a password or remove protection you own.', href: '/protect' },
  { icon: Stamp, title: 'Watermark', desc: 'Brand and secure documents with text or image stamps.', href: '/watermark' },
  { icon: ScanText, title: 'Unlock', desc: 'Remove password security from protected PDF files.', href: '/unlock' },
  { icon: Crop, title: 'Organize', desc: 'Reorder, delete, and extract specific pages with ease.', href: '/organize' },
  { icon: Hash, title: 'Page Numbers', desc: 'Insert custom numbering, headers, and footers instantly.', href: '/page-numbers' },
  { icon: FileType2, title: 'HTML → PDF', desc: 'Render raw HTML and styled text to paginated PDF.', href: '/convert' },
]

const CARD_CLASS =
  'ring-highlight group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/40 p-6 backdrop-blur-xl transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const card = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function ToolsSection() {
  return (
    <section id="tools" className="relative scroll-mt-24 py-24 sm:py-32">
      {/* Ambient section glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[40rem]"
        style={{
          background:
            'radial-gradient(55% 60% at 50% 0%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="ring-highlight inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-xl">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
            The toolkit
          </span>

          <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
            One workspace for <span className="text-gradient">every</span> document task
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            Twelve purpose-built tools that feel instant. No installs, no learning curve — just
            drop a file and go.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {TOOLS.map(({ icon: Icon, title, desc, href }) => {
            const inner = (
              <>
                {/* Sheen sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                {/* Hover gradient wash */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(circle, var(--primary), transparent 70%)' }}
                />

                {href ? (
                  <ArrowUpRight className="absolute right-5 top-5 size-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
                ) : (
                  <span className="absolute right-5 top-5 rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Soon
                  </span>
                )}

                <span className="bg-premium shadow-premium relative flex size-12 items-center justify-center rounded-2xl text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5" />
                </span>

                <h3 className="relative mt-5 text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </>
            )

            if (href) {
              return (
                <MotionLink
                  key={title}
                  href={href}
                  variants={card}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`${CARD_CLASS} hover:border-primary/40`}
                >
                  {inner}
                </MotionLink>
              )
            }

            return (
              <motion.div
                key={title}
                variants={card}
                aria-disabled="true"
                title={`${title} — coming soon`}
                className={`${CARD_CLASS} cursor-not-allowed opacity-80`}
              >
                {inner}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

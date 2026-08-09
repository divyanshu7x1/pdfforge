'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'

import { SECTION_EASE } from '@/lib/constants'

const FAQS = [
  {
    q: 'Are my files really private?',
    a: 'Yes. Files are encrypted in transit, processed in isolated environments, and automatically deleted within one hour. We never read, sell, or train models on your documents.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. PDFYaar runs entirely in your browser. It works on any device with a modern browser — no downloads, plugins, or accounts required to get started.',
  },
  {
    q: 'Is there a file size or usage limit?',
    a: 'Free users can process files up to 100MB with generous daily usage. Pro plans raise limits substantially and unlock batch processing across unlimited files.',
  },
  {
    q: 'What can the AI assistant actually do?',
    a: 'It can summarize documents, answer questions with citations to the source pages, translate content, and rewrite or reformat text — all grounded in the file you upload.',
  },
  {
    q: 'Can I use PDFYaar for signed, legal documents?',
    a: 'Absolutely. Our e-signatures are legally recognized in most jurisdictions, with a full audit trail and tamper-evident sealing on every signed document.',
  },
  {
    q: 'How do I cancel or change my plan?',
    a: 'Manage everything from your account settings in a single click. There are no cancellation fees and no lock-in contracts — change or cancel any time.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative scroll-mt-24 border-t border-border/60 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: SECTION_EASE }}
          className="text-center"
        >
          <span className="ring-highlight inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-xl">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
            FAQ
          </span>
          <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl">
            Questions, <span className="text-gradient">answered</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: SECTION_EASE, delay: 0.1 }}
          className="mt-14 space-y-3"
        >
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            const triggerId = `faq-trigger-${i}`
            const panelId = `faq-panel-${i}`
            return (
              <div
                key={faq.q}
                className="ring-highlight overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl transition-colors duration-300 hover:border-primary/30"
              >
                <h3>
                  <button
                    type="button"
                    id={triggerId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-medium text-foreground">{faq.q}</span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: SECTION_EASE }}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-foreground"
                    >
                      <Plus className="size-4" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: SECTION_EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

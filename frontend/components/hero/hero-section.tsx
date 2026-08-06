'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Upload, CloudUpload, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/logo'
import { MobileMenu } from '@/components/mobile-menu'
import { AnimatedBackground } from './animated-background'
import { PdfIllustration } from './pdf-illustration'
import { LANDING_NAV_LINKS, MAX_FILE_SIZE_LABEL, SECTION_EASE } from '@/lib/constants'
import { setPendingFiles } from '@/lib/pending-files'
import { cn } from '@/lib/utils'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: SECTION_EASE },
  },
}

export function HeroSection() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(list: FileList | null) {
    if (!list?.length) return
    setPendingFiles(Array.from(list))
    router.push('/merge')
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current += 1
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <AnimatedBackground />

      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7"
      >
        <Link href="/" aria-label="PDFForge home">
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="ring-highlight hidden items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-1.5 backdrop-blur-xl md:flex"
        >
          {LANDING_NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#faq"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </a>
          <Link
            href="/merge"
            className="ring-highlight hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-[1.03] focus-visible:scale-[1.03] sm:inline-flex"
          >
            Get started
          </Link>
          <MobileMenu links={LANDING_NAV_LINKS} getStartedHref="/merge" />
        </div>
      </motion.header>

      {/* Hero content */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-6 pb-32 pt-14 lg:grid-cols-2 lg:gap-12 lg:pt-24">
        {/* Left: copy + uploader */}
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
          <motion.span
            variants={item}
            className="ring-highlight inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-xl"
          >
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
            AI-powered PDF toolkit
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-7 text-balance text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[4.75rem]"
          >
            Every PDF tool, <span className="text-gradient">forged</span> in one place.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            Merge, split, compress, convert, and sign documents in seconds. Drop a file to
            start—your PDFs are processed securely and never leave your control.
          </motion.p>

          {/* Drag and drop area */}
          <motion.div variants={item} className="mt-10">
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload PDF files to open the merge tool"
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  inputRef.current?.click()
                }
              }}
              onDragEnter={handleDragEnter}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'group relative flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-dashed p-10 text-center backdrop-blur-xl transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isDragging
                  ? 'scale-[1.015] border-primary bg-primary/10 shadow-premium'
                  : 'border-border bg-card/40 hover:border-primary/50 hover:bg-card/60',
              )}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <motion.span
                animate={isDragging ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="bg-premium shadow-premium flex size-14 items-center justify-center rounded-2xl text-primary-foreground"
              >
                <CloudUpload className="size-6" />
              </motion.span>
              <div>
                <p className="text-base font-semibold tracking-tight text-foreground">
                  {isDragging ? 'Release to upload' : 'Drag & drop your PDF here'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  or click to browse — up to {MAX_FILE_SIZE_LABEL}
                </p>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="sr-only"
                onChange={(e) => {
                  handleFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </div>
          </motion.div>

          {/* Upload button */}
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-6">
            <motion.button
              type="button"
              onClick={() => inputRef.current?.click()}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="bg-premium shadow-premium group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-primary-foreground"
            >
              <Upload className="size-4" />
              Upload PDF
            </motion.button>
            <a
              href="#tools"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              Explore all tools
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right: floating 3D PDF illustration */}
        <div className="relative">
          <PdfIllustration />
        </div>
      </div>
    </section>
  )
}

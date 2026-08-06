'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Logo } from '@/components/logo'
import { MobileMenu } from '@/components/mobile-menu'
import { SITE_NAV_LINKS } from '@/lib/constants'

/**
 * Shared top navigation, styled to match the landing page hero navbar.
 * Reused across interior tool pages like /merge.
 */
export function SiteNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl"
    >
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="PDFForge home">
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="ring-highlight hidden items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-1.5 backdrop-blur-xl md:flex"
        >
          {SITE_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/#faq"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/merge"
            className="ring-highlight hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-[1.03] focus-visible:scale-[1.03] sm:inline-flex"
          >
            Get started
          </Link>
          <MobileMenu links={SITE_NAV_LINKS} getStartedHref="/merge" />
        </div>
      </div>
    </motion.header>
  )
}

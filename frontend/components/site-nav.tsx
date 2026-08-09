'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Compass, Sparkles, Grid, ShieldCheck, Feather } from 'lucide-react'
import { Logo } from '@/components/logo'
import { MobileMenu } from '@/components/mobile-menu'

export const APPROVED_NAV_LINKS = [
  { label: 'Workshop', href: '/#workshop', icon: Compass, iconColor: 'text-sky-azure' },
  { label: 'Transformations', href: '/#transformations', icon: Sparkles, iconColor: 'text-artisan-ochre' },
  { label: 'Toolkit', href: '/#tools', icon: Grid, iconColor: 'text-meadow-emerald' },
  { label: 'Security', href: '/#security', icon: ShieldCheck, iconColor: 'text-artisan-terracotta' },
]

export function SiteNav() {
  const scrollToWorkspace = () => {
    const el = document.getElementById('workshop') || document.getElementById('forge-workspace')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-parchment-100/95 backdrop-blur-md border-b border-sky-100/80 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Link href="/" aria-label="PDFYaar Homepage">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-parchment-800" aria-label="Main Navigation">
          {APPROVED_NAV_LINKS.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-sky-azure transition-colors flex items-center gap-1.5 focus-visible:rounded"
              >
                <Icon className={`w-4 h-4 ${link.iconColor}`} aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={scrollToWorkspace}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-azure to-meadow-emerald text-white font-medium text-xs sm:text-sm shadow-craft hover:shadow-artisan hover:opacity-95 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <Feather className="w-4 h-4" aria-hidden="true" />
            <span>Start Forging</span>
          </button>
          <MobileMenu links={APPROVED_NAV_LINKS.map(l => ({ label: l.label, href: l.href }))} getStartedHref="/#workshop" />
        </div>
      </div>
    </motion.header>
  )
}

'use client'

import Link from 'next/link'
import { Lock, Stamp, ShieldCheck } from 'lucide-react'

export function SecuritySanctumSection() {
  return (
    <section id="security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="rounded-3xl bg-artisan-twilight text-parchment-100 p-6 sm:p-10 relative overflow-hidden shadow-artisan">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-mono tracking-widest text-artisan-ochre uppercase font-bold">
              Security Sanctum
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal leading-tight">
              Protect with Passwords &amp; Watermarks
            </h2>
            <p className="text-xs sm:text-sm text-parchment-300 font-light leading-relaxed">
              Encrypt documents with passphrase locks, remove restrictions with valid keys, or stamp custom text watermarks onto your pages cleanly.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/protect"
                className="px-4 py-2 rounded-xl bg-artisan-ochre text-artisan-ink text-xs font-semibold hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
              >
                <Lock className="w-4 h-4" aria-hidden="true" />
                <span>Lock Document</span>
              </Link>
              <Link
                href="/watermark"
                className="px-4 py-2 rounded-xl bg-parchment-800/80 text-parchment-100 text-xs font-medium border border-parchment-800 hover:bg-parchment-800 transition-colors inline-flex items-center gap-2"
              >
                <Stamp className="w-4 h-4" aria-hidden="true" />
                <span>Apply Watermark</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2 w-full max-w-sm">
              <ShieldCheck className="w-8 h-8 text-meadow-clover mx-auto" aria-hidden="true" />
              <div className="text-sm font-semibold">Protected Processing</div>
              <p className="text-[11px] text-parchment-300 font-light leading-snug">
                All transfers use secure TLS encryption. Files are processed on production engines and deleted automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

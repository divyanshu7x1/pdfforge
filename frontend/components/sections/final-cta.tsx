'use client'

import { CloudSun, Feather } from 'lucide-react'

export function FinalCTASection() {
  const scrollToWorkspace = () => {
    const el = document.getElementById('workshop') || document.getElementById('forge-workspace')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="relative rounded-3xl bg-gradient-to-r from-sky-deep via-sky-azure to-meadow-emerald text-white p-8 sm:p-12 shadow-artisan overflow-hidden space-y-4">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-12 h-12 mx-auto rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
          <CloudSun className="w-6 h-6" aria-hidden="true" />
        </div>

        <h2 className="font-display text-2xl sm:text-4xl font-normal max-w-xl mx-auto leading-tight">
          Ready to forge your next document?
        </h2>

        <p className="text-xs sm:text-sm text-sky-mist font-light max-w-md mx-auto">
          Experience document tools crafted with precision, clarity, and care.
        </p>

        <div>
          <button
            type="button"
            onClick={scrollToWorkspace}
            className="px-6 py-3 rounded-xl bg-artisan-terracotta text-white font-medium shadow-xl hover:bg-artisan-clay transition-all inline-flex items-center gap-2 text-sm transform hover:-translate-y-0.5"
          >
            <Feather className="w-4 h-4" aria-hidden="true" />
            <span>Start Forging Now</span>
          </button>
        </div>
      </div>
    </section>
  )
}

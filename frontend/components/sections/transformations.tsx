'use client'

import Link from 'next/link'
import { FileText, ArrowRight, FileCheck, FileEdit, Image, FileStack } from 'lucide-react'

export function TransformationsSection() {
  return (
    <section id="transformations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono tracking-widest text-meadow-emerald uppercase font-bold">
          Transformations
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-artisan-ink font-normal">
          Seamless Format Conversion
        </h2>
        <p className="text-xs sm:text-sm text-parchment-800 font-light">
          Convert between Word, Excel, PowerPoint, PDF, and image formats with preserved layouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Word & Excel to PDF */}
        <div className="bg-parchment-100 rounded-2xl p-5 border border-parchment-300 shadow-paper hover:shadow-craft transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-mist text-sky-deep flex items-center justify-center">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <ArrowRight className="w-4 h-4 text-meadow-emerald group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            <div className="w-10 h-10 rounded-xl bg-meadow-emerald/10 text-meadow-emerald flex items-center justify-center">
              <FileCheck className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
          <h3 className="font-display text-lg text-artisan-ink font-medium">Documents &amp; Sheets &rarr; PDF</h3>
          <p className="text-xs text-parchment-800 font-light leading-relaxed">
            Convert Word (.docx) and Excel (.xlsx) workbooks into immutable, ready-to-share PDFs.
          </p>
          <Link
            href="/word-to-pdf"
            className="block w-full py-2 rounded-xl bg-sky-mist text-sky-deep text-xs text-center font-semibold hover:bg-sky-azure hover:text-white transition-colors"
          >
            Select Tool
          </Link>
        </div>

        {/* PDF to Word */}
        <div className="bg-parchment-100 rounded-2xl p-5 border border-parchment-300 shadow-paper hover:shadow-craft transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-meadow-emerald/10 text-meadow-emerald flex items-center justify-center">
              <FileCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <ArrowRight className="w-4 h-4 text-artisan-terracotta group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            <div className="w-10 h-10 rounded-xl bg-artisan-terracotta/10 text-artisan-terracotta flex items-center justify-center">
              <FileEdit className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
          <h3 className="font-display text-lg text-artisan-ink font-medium">PDF &rarr; Editable Word</h3>
          <p className="text-xs text-parchment-800 font-light leading-relaxed">
            Extract PDF content back into editable Word documents while preserving typography and tables.
          </p>
          <Link
            href="/pdf-to-word"
            className="block w-full py-2 rounded-xl bg-meadow-emerald/10 text-meadow-emerald text-xs text-center font-semibold hover:bg-meadow-emerald hover:text-white transition-colors"
          >
            Select Tool
          </Link>
        </div>

        {/* Images to PDF */}
        <div className="bg-parchment-100 rounded-2xl p-5 border border-parchment-300 shadow-paper hover:shadow-craft transition-all space-y-3 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-artisan-ochre/10 text-artisan-ochre flex items-center justify-center">
              <Image className="w-5 h-5" aria-hidden="true" />
            </div>
            <ArrowRight className="w-4 h-4 text-sky-azure group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            <div className="w-10 h-10 rounded-xl bg-sky-mist text-sky-deep flex items-center justify-center">
              <FileStack className="w-5 h-5" aria-hidden="true" />
            </div>
          </div>
          <h3 className="font-display text-lg text-artisan-ink font-medium">Images &harr; PDF Studio</h3>
          <p className="text-xs text-parchment-800 font-light leading-relaxed">
            Combine JPG/PNG images into single multi-page document albums or extract individual pages.
          </p>
          <Link
            href="/images-to-pdf"
            className="block w-full py-2 rounded-xl bg-artisan-ochre/10 text-artisan-ochre text-xs text-center font-semibold hover:bg-artisan-ochre hover:text-white transition-colors"
          >
            Select Tool
          </Link>
        </div>
      </div>
    </section>
  )
}

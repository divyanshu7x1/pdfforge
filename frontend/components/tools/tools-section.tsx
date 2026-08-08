'use client'

import { useState } from 'react'
import Link from 'next/link'
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

export type ToolCategory = 'all' | 'convert' | 'organize' | 'security'

export type ToolItem = {
  id: string
  icon: LucideIcon
  title: string
  desc: string
  href: string
  category: 'convert' | 'organize' | 'security'
  badge?: string
}

export const ALL_TOOLS: ToolItem[] = [
  { id: 'merge', icon: Combine, title: 'Merge PDF', desc: 'Combine multiple PDF documents into a single unified file.', href: '/merge', category: 'organize' },
  { id: 'split', icon: Scissors, title: 'Split PDF', desc: 'Extract pages or separate documents into individual files.', href: '/split', category: 'organize' },
  { id: 'compress', icon: Minimize2, title: 'Compress PDF', desc: 'Reduce file size while preserving high visual quality.', href: '/compress', category: 'organize' },
  { id: 'pdf-to-word', icon: FileOutput, title: 'PDF → Word', desc: 'Convert PDF documents into editable Microsoft Word (.docx).', href: '/pdf-to-word', category: 'convert' },
  { id: 'word-to-pdf', icon: FileType2, title: 'Word → PDF', desc: 'Convert Word documents (.docx, .doc) into standard PDF.', href: '/word-to-pdf', category: 'convert' },
  { id: 'pdf-to-images', icon: FileOutput, title: 'PDF → Images', desc: 'Extract pages from PDF as crisp PNG image files.', href: '/pdf-to-images', category: 'convert' },
  { id: 'images-to-pdf', icon: FileSignature, title: 'Images → PDF', desc: 'Convert JPG, PNG, and WebP images into a compiled PDF.', href: '/images-to-pdf', category: 'convert' },
  { id: 'powerpoint-to-pdf', icon: FileType2, title: 'PowerPoint → PDF', desc: 'Convert PowerPoint (.pptx) slide decks into PDF documents.', href: '/powerpoint-to-pdf', category: 'convert' },
  { id: 'excel-to-pdf', icon: FileType2, title: 'Excel → PDF', desc: 'Convert Excel spreadsheets (.xlsx) into structured PDF tables.', href: '/excel-to-pdf', category: 'convert' },
  { id: 'rotate', icon: RotateCw, title: 'Rotate PDF', desc: 'Adjust page orientation across document pages.', href: '/rotate', category: 'organize' },
  { id: 'organize', icon: Crop, title: 'Organize PDF', desc: 'Reorder, delete, or extract specific pages from PDF.', href: '/organize', category: 'organize' },
  { id: 'page-numbers', icon: Hash, title: 'Page Numbers', desc: 'Insert custom page numbers, headers, and labels.', href: '/page-numbers', category: 'organize' },
  { id: 'watermark', icon: Stamp, title: 'Watermark PDF', desc: 'Stamp custom text or image watermarks onto document pages.', href: '/watermark', category: 'security' },
  { id: 'protect', icon: Lock, title: 'Protect PDF', desc: 'Encrypt document with secure passphrase lock.', href: '/protect', category: 'security' },
  { id: 'unlock', icon: ScanText, title: 'Unlock PDF', desc: 'Remove password restrictions from protected PDF files.', href: '/unlock', category: 'security' },
]

export function ToolsSection() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all')

  const filteredTools = ALL_TOOLS.filter((t) => activeCategory === 'all' || t.category === activeCategory)

  return (
    <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-parchment-300 pb-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-sky-deep uppercase font-bold">
            Toolkit
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-artisan-ink font-normal">
            Artisan Document Toolkit ({ALL_TOOLS.length} Tools)
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 text-xs" role="tablist" aria-label="Tool Categories">
          {(['all', 'convert', 'organize', 'security'] as ToolCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all focus-visible:rounded-xl capitalize ${
                activeCategory === cat
                  ? 'bg-artisan-ink text-white shadow-sm'
                  : 'bg-parchment-200 text-parchment-800 hover:bg-parchment-300'
              }`}
            >
              {cat === 'all' ? 'All Tools' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Cards Grid */}
      <div id="toolGrid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredTools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="bg-parchment-100 rounded-2xl p-5 border border-parchment-300 shadow-paper hover:shadow-craft hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-mist text-sky-azure flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-parchment-400 group-hover:text-sky-azure group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" aria-hidden="true" />
                </div>
                <h3 className="font-display text-base text-artisan-ink font-semibold group-hover:text-sky-azure transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-parchment-800 font-light leading-relaxed mt-1">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-parchment-200/60 flex items-center justify-between text-[11px] text-sky-deep font-mono font-medium">
                <span>Select Tool</span>
                <span>&rarr;</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

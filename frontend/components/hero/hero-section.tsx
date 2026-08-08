'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CloudUpload,
  FolderOpen,
  ShieldCheck,
  Shield,
  Sparkles,
  Sun,
  Check,
  Download,
  AlertTriangle,
  Grid,
  FileText,
  Trash2,
} from 'lucide-react'
import { usePdfTool } from '@/hooks/use-pdf-tool'
import { consumePendingFiles } from '@/lib/pending-files'
import { ALL_TOOLS, ToolItem } from '@/components/tools/tools-section'

export function HeroSection() {
  const [selectedToolId, setSelectedToolId] = useState<string>('word-to-pdf')
  const [extraParams, setExtraParams] = useState<Record<string, string>>({})
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeTool: ToolItem =
    ALL_TOOLS.find((t) => t.id === selectedToolId) ?? ALL_TOOLS[4]!

  const toolConfigMap: Record<
    string,
    { endpoint: string; acceptTypes: string[]; defaultName: string; badge: string }
  > = {
    'merge': { endpoint: '/merge', acceptTypes: ['application/pdf'], defaultName: 'merged.pdf', badge: 'PDF → MERGED' },
    'split': { endpoint: '/split', acceptTypes: ['application/pdf'], defaultName: 'split.pdf', badge: 'PDF → PAGES' },
    'compress': { endpoint: '/compress', acceptTypes: ['application/pdf'], defaultName: 'compressed.pdf', badge: 'PDF → COMPRESSED' },
    'word-to-pdf': { endpoint: '/word-to-pdf', acceptTypes: ['.docx', '.doc'], defaultName: 'document.pdf', badge: 'DOCX → PDF' },
    'pdf-to-word': { endpoint: '/pdf-to-word', acceptTypes: ['application/pdf'], defaultName: 'document.docx', badge: 'PDF → DOCX' },
    'excel-to-pdf': { endpoint: '/excel-to-pdf', acceptTypes: ['.xlsx', '.xls'], defaultName: 'spreadsheet.pdf', badge: 'XLSX → PDF' },
    'powerpoint-to-pdf': { endpoint: '/powerpoint-to-pdf', acceptTypes: ['.pptx', '.ppt'], defaultName: 'presentation.pdf', badge: 'PPTX → PDF' },
    'images-to-pdf': { endpoint: '/images-to-pdf', acceptTypes: ['image/jpeg', 'image/png', 'image/webp'], defaultName: 'images.pdf', badge: 'IMG → PDF' },
    'pdf-to-images': { endpoint: '/pdf-to-images', acceptTypes: ['application/pdf'], defaultName: 'pages.zip', badge: 'PDF → ZIP' },
    'rotate': { endpoint: '/rotate', acceptTypes: ['application/pdf'], defaultName: 'rotated.pdf', badge: 'PDF → ROTATED' },
    'organize': { endpoint: '/organize', acceptTypes: ['application/pdf'], defaultName: 'organized.pdf', badge: 'PDF → ORGANIZED' },
    'page-numbers': { endpoint: '/page-numbers', acceptTypes: ['application/pdf'], defaultName: 'numbered.pdf', badge: 'PDF → NUMBERED' },
    'watermark': { endpoint: '/watermark', acceptTypes: ['application/pdf'], defaultName: 'watermarked.pdf', badge: 'PDF → STAMPED' },
    'protect': { endpoint: '/protect', acceptTypes: ['application/pdf'], defaultName: 'protected.pdf', badge: 'PDF → LOCKED' },
    'unlock': { endpoint: '/unlock', acceptTypes: ['application/pdf'], defaultName: 'unlocked.pdf', badge: 'PDF → UNLOCKED' },
  }

  const currentConfig = toolConfigMap[selectedToolId] ?? {
    endpoint: '/word-to-pdf',
    acceptTypes: ['.docx', '.doc'],
    defaultName: 'document.pdf',
    badge: 'DOCX → PDF',
  }

  const {
    files,
    status,
    progress,
    statusMessage,
    error,
    totalSize,
    result,
    addFiles,
    removeFile,
    executeTool,
    reset,
  } = usePdfTool({
    endpoint: currentConfig.endpoint,
    acceptTypes: currentConfig.acceptTypes,
    minFiles: selectedToolId === 'merge' ? 2 : 1,
    defaultOutputName: currentConfig.defaultName,
  })

  // Pick up pending files dropped on previous navigation
  useEffect(() => {
    const pending = consumePendingFiles()
    if (pending.length > 0) {
      addFiles(pending)
    }
  }, [addFiles])

  const handleToolChange = (toolId: string) => {
    setSelectedToolId(toolId)
    setExtraParams({})
    reset()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current += 1
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const handleProcess = () => {
    executeTool(extraParams)
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const scrollToWorkspace = () => {
    const el = document.getElementById('forge-workspace')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="workshop" className="relative pt-4 sm:pt-8 md:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      <div className="absolute -top-12 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] sunbeam-ray pointer-events-none rounded-full blur-3xl opacity-40" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Story & Mascot Column */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-mist border border-sky-breeze/30 text-sky-deep text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-meadow-moss animate-ping" aria-hidden="true" />
            <span>Hand-Crafted Document Atelier • Fast &amp; Secure</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-artisan-ink leading-[1.15] tracking-tight">
            Convert, organize, protect, and forge your documents with{' '}
            <span className="italic font-normal text-sky-azure underline decoration-artisan-ochre/50 decoration-wavy">
              ease.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-parchment-800 leading-relaxed font-light max-w-xl">
            A modern coastal document studio where Word, Excel, PowerPoint, images, and PDFs are converted, organized, compressed, and protected cleanly.
          </p>

          {/* Mascot Box: Sora & Pipo */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-parchment-100 to-sky-sunlit border border-sky-200/60 shadow-paper flex items-center gap-3.5 max-w-lg">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-sky-mist border border-sky-azure/30 p-1 flex items-center justify-center shadow-inner relative overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
                <circle cx="50" cy="50" r="45" fill="#E0F2FE" />
                <circle cx="50" cy="50" r="38" stroke="#FEF08A" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                <path d="M15 50 Q50 20 85 50 Q70 45 50 42 Q30 45 15 50 Z" fill="#D99B26" />
                <path d="M30 45 Q50 35 70 45" stroke="#C86D51" strokeWidth="3" fill="none" />
                <circle cx="50" cy="58" r="20" fill="#FDE68A" />
                <circle cx="43" cy="56" r="2.5" fill="#0F172A" />
                <circle cx="57" cy="56" r="2.5" fill="#0F172A" />
                <circle cx="38" cy="62" r="3" fill="#C86D51" opacity="0.6" />
                <circle cx="62" cy="62" r="3" fill="#C86D51" opacity="0.6" />
                <path d="M46 66 Q50 70 54 66" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M72 32 Q80 20 88 32 Q80 40 72 32 Z" fill="#FFFDF9" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="80" cy="30" r="1" fill="#0284C7" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-deep">Master Sora &amp; Pipo</div>
              <p className="text-xs text-parchment-800 italic mt-0.5 leading-snug">
                &quot;Select a tool below, choose your file, and we&apos;ll forge your document right away.&quot;
              </p>
            </div>
          </div>

          {/* Tool Selection Quick Pills */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-semibold text-parchment-800 uppercase tracking-wider">Select Tool:</div>
            <div className="flex flex-wrap gap-2">
              {ALL_TOOLS.slice(0, 8).map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToolChange(tool.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedToolId === tool.id
                      ? 'bg-sky-azure text-white border-sky-azure shadow-sm'
                      : 'bg-parchment-100 text-parchment-800 border-parchment-300 hover:bg-parchment-200'
                  }`}
                >
                  {tool.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#tools"
              className="px-4 py-2.5 rounded-xl bg-parchment-200 text-artisan-ink font-medium text-xs border border-parchment-300 hover:bg-parchment-300 transition-all flex items-center gap-2 focus-visible:rounded-xl"
            >
              <Grid className="w-4 h-4 text-meadow-emerald" aria-hidden="true" />
              <span>Explore All 15 Tools</span>
            </a>
            <div className="text-xs text-parchment-800 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-meadow-emerald" aria-hidden="true" />
              <span>Secure HTTPS Transfer &amp; Server Processing</span>
            </div>
          </div>
        </div>

        {/* Right Interactive Workbench Dropzone */}
        <div className="lg:col-span-7 w-full" id="forge-workspace">
          <div className="relative rounded-3xl bg-parchment-50 p-5 sm:p-7 shadow-craft border border-parchment-300">
            {/* Brackets */}
            <div className="absolute top-4 left-4 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-artisan-ochre pointer-events-none" />
            <div className="absolute top-4 right-4 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 border-artisan-ochre pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 border-artisan-ochre pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-artisan-ochre pointer-events-none" />

            {/* Active Tool Header Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3.5 mb-4 border-b border-parchment-200 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-sky-azure animate-pulse" aria-hidden="true" />
                <h2 className="font-display font-semibold text-base sm:text-lg text-artisan-ink">
                  {activeTool.title} Forge
                </h2>
              </div>
              <div className="text-xs px-2.5 py-1 rounded-md bg-sky-mist text-sky-deep font-mono font-bold">
                {currentConfig.badge}
              </div>
            </div>

            {/* Tool Specific Config Parameters */}
            {(selectedToolId === 'watermark' ||
              selectedToolId === 'protect' ||
              selectedToolId === 'unlock' ||
              selectedToolId === 'rotate' ||
              selectedToolId === 'split' ||
              selectedToolId === 'page-numbers') && (
              <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-parchment-100 border border-parchment-300 space-y-3">
                {selectedToolId === 'watermark' && (
                  <div>
                    <label className="block text-xs font-semibold text-artisan-ink mb-1">Watermark Text</label>
                    <input
                      type="text"
                      placeholder="CONFIDENTIAL"
                      value={extraParams.text || ''}
                      onChange={(e) => setExtraParams((p) => ({ ...p, text: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-parchment-300 bg-parchment-50 text-xs font-mono text-artisan-ink"
                    />
                  </div>
                )}
                {(selectedToolId === 'protect' || selectedToolId === 'unlock') && (
                  <div>
                    <label className="block text-xs font-semibold text-artisan-ink mb-1">Passphrase Password</label>
                    <input
                      type="password"
                      placeholder="Enter password..."
                      value={extraParams.password || ''}
                      onChange={(e) => setExtraParams((p) => ({ ...p, password: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-parchment-300 bg-parchment-50 text-xs font-mono text-artisan-ink"
                    />
                  </div>
                )}
                {selectedToolId === 'rotate' && (
                  <div>
                    <label className="block text-xs font-semibold text-artisan-ink mb-1">Rotation Angle</label>
                    <select
                      value={extraParams.rotation || '90'}
                      onChange={(e) => setExtraParams((p) => ({ ...p, rotation: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-parchment-300 bg-parchment-50 text-xs font-mono text-artisan-ink"
                    >
                      <option value="90">90° Clockwise</option>
                      <option value="180">180° Flip</option>
                      <option value="270">270° Counter-Clockwise</option>
                    </select>
                  </div>
                )}
                {selectedToolId === 'page-numbers' && (
                  <div>
                    <label className="block text-xs font-semibold text-artisan-ink mb-1">Format Label</label>
                    <input
                      type="text"
                      placeholder="Page {page} of {total}"
                      value={extraParams.format || 'Page {page} of {total}'}
                      onChange={(e) => setExtraParams((p) => ({ ...p, format: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-parchment-300 bg-parchment-50 text-xs font-mono text-artisan-ink"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Drop Zone */}
            {status === 'idle' && files.length === 0 && (
              <div
                tabIndex={0}
                role="button"
                aria-label="Upload document dropzone"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    fileInputRef.current?.click()
                  }
                }}
                onDragEnter={handleDragEnter}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`hand-drawn-border p-6 sm:p-10 text-center transition-all cursor-pointer group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-sky-azure ${
                  isDragging
                    ? 'bg-sky-mist/60 border-sky-azure scale-[1.01]'
                    : 'bg-gradient-to-b from-parchment-100/60 to-sky-sunlit/40 hover:bg-sky-mist/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                  multiple={selectedToolId === 'merge' || selectedToolId === 'images-to-pdf'}
                />

                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl bg-sky-mist border border-sky-breeze/40 flex items-center justify-center text-sky-deep group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <CloudUpload className="w-8 h-8 sm:w-10 sm:h-10 text-sky-azure" aria-hidden="true" />
                </div>

                <h3 className="font-display text-lg sm:text-xl text-artisan-ink font-medium mb-1">
                  Drop document onto the workbench
                </h3>
                <p className="text-xs text-parchment-800 mb-5 font-light">
                  Accepts {currentConfig.acceptTypes.join(', ')} up to 100 MB
                </p>

                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-meadow-emerald text-white text-xs sm:text-sm font-medium shadow-sm hover:bg-meadow-forest transition-all inline-flex items-center gap-2"
                >
                  <FolderOpen className="w-4 h-4" aria-hidden="true" />
                  <span>Choose File</span>
                </button>

                <div className="mt-4 text-[11px] text-parchment-800 flex items-center justify-center gap-1 font-mono">
                  <Shield className="w-3.5 h-3.5 text-meadow-emerald" aria-hidden="true" />
                  <span>Encrypted TLS Transit &amp; Direct Server Processing</span>
                </div>
              </div>
            )}

            {/* Selected Files Tray */}
            {status === 'idle' && files.length > 0 && (
              <div className="p-4 rounded-xl bg-parchment-200 border border-parchment-300">
                <div className="text-xs font-mono font-bold text-parchment-800 mb-2 uppercase tracking-wider">
                  Loaded Documents ({files.length}) • {formatSize(totalSize)}
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-parchment-50 border border-parchment-300 text-xs text-artisan-ink"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-sky-azure shrink-0" />
                        <span className="truncate font-medium">{f.name}</span>
                        <span className="text-[10px] text-parchment-800 font-mono">({formatSize(f.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        className="text-artisan-terracotta hover:bg-artisan-terracotta/10 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {error && (
                  <div role="alert" className="mt-3 p-2.5 rounded-lg bg-artisan-terracotta/10 border border-artisan-terracotta/30 text-artisan-terracotta text-xs font-mono break-words">
                    {error.message}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-parchment-300/70 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-artisan-terracotta hover:bg-artisan-terracotta/10 transition-colors"
                  >
                    Clear Files
                  </button>
                  <button
                    type="button"
                    onClick={handleProcess}
                    className="px-5 py-2.5 rounded-xl bg-artisan-terracotta text-white font-medium text-xs sm:text-sm shadow-artisan hover:bg-artisan-clay transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>Begin Forging</span>
                  </button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {status === 'processing' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-sky-mist/50 border border-sky-azure/30 text-center" role="status" aria-live="polite">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3">
                  <div className="absolute inset-0 rounded-full border-4 border-sky-breeze/30 border-t-sky-azure animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-sky-azure">
                    <Sun className="w-6 h-6 animate-pulse" aria-hidden="true" />
                  </div>
                </div>
                <h4 className="font-display text-base sm:text-lg font-medium text-artisan-ink">
                  {statusMessage}
                </h4>
                <p className="text-xs text-parchment-800 mt-1 font-mono">
                  https://pdfforge-backend.onrender.com
                </p>
                <div className="w-full bg-parchment-300 h-2.5 rounded-full mt-4 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className="bg-gradient-to-r from-sky-azure to-meadow-moss h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Success State Tray */}
            {status === 'success' && result && (
              <div className="p-5 sm:p-6 rounded-2xl bg-meadow-emerald/10 border border-meadow-emerald/30 text-center space-y-3" role="status" aria-live="polite">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-meadow-emerald text-white flex items-center justify-center shadow-sm">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-display text-lg sm:text-xl text-artisan-ink font-medium">
                    Document Successfully Forged!
                  </h4>
                  <p className="text-xs text-parchment-800 mt-0.5 font-mono">
                    {result.fileName} ({formatSize(result.fileSize)})
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <a
                    href={result.downloadUrl}
                    download={result.fileName}
                    className="px-5 py-2.5 rounded-xl bg-meadow-emerald text-white text-xs sm:text-sm font-medium shadow-md hover:bg-meadow-forest transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Download File</span>
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className="px-4 py-2.5 rounded-xl bg-parchment-200 text-artisan-ink text-xs sm:text-sm font-medium border border-parchment-300 hover:bg-parchment-300 transition-all"
                  >
                    Forge Another
                  </button>
                </div>
              </div>
            )}

            {/* Real Error State Tray */}
            {error && status === 'idle' && files.length === 0 && (
              <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-artisan-terracotta/10 border border-artisan-terracotta/30 text-center space-y-3" role="alert">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-artisan-terracotta text-white flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-display text-lg sm:text-xl text-artisan-ink font-medium">
                    Conversion Request Error
                  </h4>
                  <p className="text-xs text-artisan-terracotta font-mono mt-1 max-w-md mx-auto break-words">
                    {error.message}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={reset}
                    className="px-4 py-2 rounded-xl bg-parchment-200 text-artisan-ink text-xs font-medium border border-parchment-300 hover:bg-parchment-300"
                  >
                    Choose Different File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

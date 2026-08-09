'use client'

import { useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHeader } from '@/components/pdf/page-header'
import { ProgressSection } from '@/components/pdf/progress-section'
import { SuccessSection } from '@/components/pdf/success-section'
import { ErrorMessage } from '@/components/pdf/error-message'
import { ToolWorkspace } from '@/components/pdf/tool-workspace'
import { getApiBaseUrl } from '@/lib/api-config'
import { parseNetworkError, parseResponseError } from '@/lib/api-error'
import { FileType2 } from 'lucide-react'

export default function ConvertPage() {
  const [content, setContent] = useState('<h1>Sample Document</h1><p>Welcome to PDFYaar instant document converter!</p>')
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ fileName: string; fileSize: number; downloadUrl: string } | null>(null)

  const handleConvert = async () => {
    if (!content.trim()) return
    setError(null)
    setStatus('processing')
    setProgress(30)

    const requestUrl = `${getApiBaseUrl()}/pdf/convert-html`

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: content }),
      })

      if (!response.ok) {
        throw new Error(await parseResponseError(response))
      }

      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      setProgress(100)
      setResult({
        fileName: 'converted-document.pdf',
        fileSize: blob.size,
        downloadUrl,
      })
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setProgress(0)
      setError(parseNetworkError(err, requestUrl))
    }
  }

  return (
    <div className="relative min-h-screen bg-parchment-100 text-artisan-ink paper-grain">

      <div className="relative">
        <SiteNav />

        <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <PageHeader
            eyebrow="Convert to PDF"
            title="Convert HTML & Text to"
            highlight="PDF document"
            subtitle="Paste raw HTML or plain text to instantly render a clean, paginated PDF document."
          />

          <div className="mt-12">
            <ToolWorkspace
              status={status}
              idle={
                <>
                  <div className="rounded-2xl border border-parchment-300 bg-parchment-50 p-5 shadow-sm">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-artisan-ink">
                      HTML / Plain Text Content
                    </label>
                    <textarea
                      rows={8}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter HTML or plain text..."
                      className="mt-3 w-full rounded-xl border border-parchment-300 bg-parchment-100 p-4 font-mono text-xs text-artisan-ink outline-none focus:border-sky-azure"
                    />
                  </div>

                  {error && (
                    <ErrorMessage
                      error={{ code: 'server', message: error }}
                      onDismiss={() => setError(null)}
                    />
                  )}

                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      disabled={!content.trim()}
                      onClick={handleConvert}
                      className="px-6 py-3 rounded-xl bg-artisan-terracotta text-white font-medium text-xs sm:text-sm shadow-artisan hover:bg-artisan-clay transition-all flex items-center gap-2"
                    >
                      <FileType2 className="w-4 h-4" />
                      <span>Convert to PDF</span>
                    </button>
                  </div>
                </>
              }
              processing={
                <ProgressSection
                  progress={progress}
                  statusMessage="Converting HTML to PDF..."
                  fileCount={1}
                />
              }
              success={
                result ? (
                  <SuccessSection
                    fileName={result.fileName}
                    fileSize={result.fileSize}
                    downloadUrl={result.downloadUrl}
                    onReset={() => setStatus('idle')}
                  />
                ) : (
                  <div />
                )
              }
            />
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

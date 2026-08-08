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
  const [content, setContent] = useState('<h1>Sample Document</h1><p>Welcome to PDFForge instant document converter!</p>')
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
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

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
                  <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      HTML / Plain Text Content
                    </label>
                    <textarea
                      rows={8}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter HTML or plain text..."
                      className="mt-3 w-full rounded-xl border border-border bg-background/60 p-4 font-mono text-sm text-foreground outline-none focus:border-primary/50"
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
                      className="bg-premium shadow-premium inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                    >
                      <FileType2 className="size-4" />
                      Convert to PDF
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

'use client'

import { useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHeader } from '@/components/pdf/page-header'
import { UploadZone } from '@/components/pdf/upload-zone'
import { SelectedFiles } from '@/components/pdf/selected-files'
import { ProgressSection } from '@/components/pdf/progress-section'
import { SuccessSection } from '@/components/pdf/success-section'
import { ErrorMessage } from '@/components/pdf/error-message'
import { ToolWorkspace } from '@/components/pdf/tool-workspace'
import { usePdfTool } from '@/hooks/use-pdf-tool'
import { Minimize2 } from 'lucide-react'

export default function CompressPage() {
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const {
    files,
    status,
    progress,
    statusMessage,
    error,
    totalSize,
    result,
    canExecute,
    addFiles,
    removeFile,
    reorderFiles,
    executeTool,
    reset,
    dismissError,
  } = usePdfTool({
    endpoint: '/compress',
    minFiles: 1,
    defaultOutputName: 'compressed.pdf',
  })

  return (
    <div className="relative min-h-screen bg-parchment-100 text-artisan-ink paper-grain">

      <div className="relative">
        <SiteNav />

        <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <PageHeader
            eyebrow="Compress PDF"
            title="Reduce PDF size"
            highlight="dramatically"
            subtitle="Optimize PDF streams and downsample images for maximum file size reduction while maintaining crisp quality."
          />

          <div className="mt-12">
            <ToolWorkspace
              status={status}
              idle={
                <>
                  {files.length === 0 ? (
                    <UploadZone onFiles={addFiles} />
                  ) : (
                    <UploadZone compact onFiles={addFiles} />
                  )}

                  <ErrorMessage error={error} onDismiss={dismissError} />

                  {files.length > 0 && (
                    <>
                      <SelectedFiles
                        files={files}
                        totalSize={totalSize}
                        onReorder={reorderFiles}
                        onRemove={removeFile}
                        onAddMore={() => {}}
                      />

                      <div className="mt-6 rounded-2xl border border-parchment-300 bg-parchment-50 p-5 text-center shadow-sm">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-artisan-ink">
                          Compression Level
                        </label>
                        <div className="mt-3 flex justify-center gap-3">
                          {(['low', 'medium', 'high'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setQuality(lvl)}
                              className={`capitalize rounded-xl border px-5 py-2 text-xs font-semibold transition-all ${
                                quality === lvl
                                  ? 'border-sky-azure bg-sky-azure text-white shadow-sm'
                                  : 'border-parchment-300 bg-parchment-100 text-parchment-800 hover:bg-parchment-200'
                              }`}
                            >
                              {lvl} Compression
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          disabled={!canExecute}
                          onClick={() => executeTool({ quality })}
                          className="px-6 py-3 rounded-xl bg-artisan-terracotta text-white font-medium text-xs sm:text-sm shadow-artisan hover:bg-artisan-clay transition-all flex items-center gap-2"
                        >
                          <Minimize2 className="w-4 h-4" />
                          <span>Compress PDF</span>
                        </button>
                      </div>
                    </>
                  )}
                </>
              }
              processing={
                <ProgressSection
                  progress={progress}
                  statusMessage={statusMessage}
                  fileCount={files.length}
                />
              }
              success={
                result ? (
                  <SuccessSection
                    fileName={result.fileName}
                    fileSize={result.fileSize}
                    downloadUrl={result.downloadUrl}
                    onReset={reset}
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

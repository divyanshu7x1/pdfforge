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
import { Crop } from 'lucide-react'

export default function OrganizePage() {
  const [deletePages, setDeletePages] = useState('')
  const [pageOrder, setPageOrder] = useState('')
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
    endpoint: '/organize',
    minFiles: 1,
    defaultOutputName: 'organized.pdf',
  })

  return (
    <div className="relative min-h-screen bg-parchment-100 text-artisan-ink paper-grain">

      <div className="relative">
        <SiteNav />

        <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <PageHeader
            eyebrow="Organize PDF"
            title="Delete & reorder"
            highlight="PDF pages"
            subtitle="Remove unwanted pages or reorder document pages in your desired sequence."
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

                      <div className="mt-6 space-y-4 rounded-2xl border border-parchment-300 bg-parchment-50 p-4 shadow-sm">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-artisan-ink">
                            Delete Pages (e.g. &quot;2, 4&quot;)
                          </label>
                          <input
                            type="text"
                            value={deletePages}
                            onChange={(e) => setDeletePages(e.target.value)}
                            placeholder="e.g. 2, 4"
                            className="mt-2 w-full rounded-xl border border-parchment-300 bg-parchment-100 px-4 py-2.5 text-xs font-mono text-artisan-ink outline-none focus:border-sky-azure"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-artisan-ink">
                            New Page Order (Optional e.g. &quot;3, 1, 2&quot;)
                          </label>
                          <input
                            type="text"
                            value={pageOrder}
                            onChange={(e) => setPageOrder(e.target.value)}
                            placeholder="e.g. 3, 1, 2"
                            className="mt-2 w-full rounded-xl border border-parchment-300 bg-parchment-100 px-4 py-2.5 text-xs font-mono text-artisan-ink outline-none focus:border-sky-azure"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          disabled={!canExecute}
                          onClick={() => executeTool({ deletePages, pageOrder })}
                          className="px-6 py-3 rounded-xl bg-artisan-terracotta text-white font-medium text-xs sm:text-sm shadow-artisan hover:bg-artisan-clay transition-all flex items-center gap-2"
                        >
                          <Crop className="w-4 h-4" />
                          <span>Organize Pages</span>
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

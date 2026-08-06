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
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

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

                      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Delete Pages (e.g. "2, 4")
                          </label>
                          <input
                            type="text"
                            value={deletePages}
                            onChange={(e) => setDeletePages(e.target.value)}
                            placeholder="e.g. 2, 4"
                            className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            New Page Order (Optional e.g. "3, 1, 2")
                          </label>
                          <input
                            type="text"
                            value={pageOrder}
                            onChange={(e) => setPageOrder(e.target.value)}
                            placeholder="e.g. 3, 1, 2"
                            className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          disabled={!canExecute}
                          onClick={() => executeTool({ deletePages, pageOrder })}
                          className="bg-premium shadow-premium inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                        >
                          <Crop className="size-4" />
                          Organize Pages
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

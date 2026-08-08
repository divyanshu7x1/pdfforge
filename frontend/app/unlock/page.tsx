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
import { Unlock } from 'lucide-react'

export default function UnlockPage() {
  const [password, setPassword] = useState('')
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
    endpoint: '/unlock',
    minFiles: 1,
    defaultOutputName: 'unlocked.pdf',
  })

  return (
    <div className="relative min-h-screen bg-parchment-100 text-artisan-ink paper-grain">

      <div className="relative">
        <SiteNav />

        <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <PageHeader
            eyebrow="Unlock PDF"
            title="Remove security & password"
            highlight="from PDF"
            subtitle="Decrypt and remove password security from protected PDF files you own."
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

                      <div className="mt-6 rounded-2xl border border-parchment-300 bg-parchment-50 p-4 shadow-sm">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-artisan-ink">
                          PDF Password (If Required)
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="mt-2 w-full rounded-xl border border-parchment-300 bg-parchment-100 px-4 py-2.5 text-xs font-mono text-artisan-ink outline-none focus:border-sky-azure"
                        />
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          disabled={!canExecute}
                          onClick={() => executeTool({ password })}
                          className="px-6 py-3 rounded-xl bg-artisan-terracotta text-white font-medium text-xs sm:text-sm shadow-artisan hover:bg-artisan-clay transition-all flex items-center gap-2"
                        >
                          <Unlock className="w-4 h-4" />
                          <span>Unlock PDF</span>
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
                    onReset={() => {
                      setPassword('')
                      reset()
                    }}
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

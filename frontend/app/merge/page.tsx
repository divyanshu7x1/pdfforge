'use client'

import { useRef } from 'react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { PageHeader } from '@/components/pdf/page-header'
import { UploadZone } from '@/components/pdf/upload-zone'
import { SelectedFiles } from '@/components/pdf/selected-files'
import { MergeButton } from '@/components/pdf/merge-button'
import { ProgressSection } from '@/components/pdf/progress-section'
import { SuccessSection } from '@/components/pdf/success-section'
import { ErrorMessage } from '@/components/pdf/error-message'
import { ToolWorkspace } from '@/components/pdf/tool-workspace'
import { useMergePdf } from '@/hooks/use-merge-pdf'

export default function MergePage() {
  const {
    files,
    status,
    progress,
    statusMessage,
    error,
    totalSize,
    result,
    canMerge,
    addFiles,
    removeFile,
    reorder,
    merge,
    reset,
    dismissError,
  } = useMergePdf()

  const addMoreRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative min-h-screen bg-parchment-100 text-artisan-ink paper-grain">

      <div className="relative">
        <SiteNav />

        <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <PageHeader
            eyebrow="Merge PDF"
            title="Combine PDFs into"
            highlight="one document"
            subtitle="Combine multiple PDF files into one document in seconds. Reorder them, then download the merged result."
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
                        onReorder={reorder}
                        onRemove={removeFile}
                        onAddMore={() => addMoreRef.current?.click()}
                      />

                      <div className="mt-2 flex justify-center">
                        <MergeButton
                          disabled={!canMerge}
                          count={files.length}
                          onMerge={() => {
                            void merge()
                          }}
                        />
                      </div>
                    </>
                  )}

                  <input
                    ref={addMoreRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    className="sr-only"
                    aria-hidden="true"
                    tabIndex={-1}
                    onChange={(event) => {
                      addFiles(event.target.files ?? [])
                      event.target.value = ''
                    }}
                  />
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

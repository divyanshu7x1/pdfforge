'use client'

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
import { FileText } from 'lucide-react'

export default function ExcelToPdfPage() {
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
    endpoint: '/excel-to-pdf',
    acceptTypes: ['.xlsx', '.xls'],
    minFiles: 1,
    defaultOutputName: 'excel-converted.pdf',
  })

  return (
    <div className="relative min-h-screen bg-parchment-100 text-artisan-ink paper-grain">

      <div className="relative">
        <SiteNav />

        <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <PageHeader
            eyebrow="Excel to PDF"
            title="Convert Excel spreadsheets to"
            highlight="PDF document"
            subtitle="Convert Excel (.xlsx, .xls) workbooks and spreadsheets into formatted PDF tables."
          />

          <div className="mt-12">
            <ToolWorkspace
              status={status}
              idle={
                <>
                  {files.length === 0 ? (
                    <UploadZone
                      onFiles={addFiles}
                      accept=".xlsx,.xls"
                      acceptLabel="Excel (.xlsx, .xls)"
                      title="Drag & drop your Excel file here"
                    />
                  ) : (
                    <UploadZone
                      compact
                      onFiles={addFiles}
                      accept=".xlsx,.xls"
                      acceptLabel="Excel (.xlsx, .xls)"
                      title="Drag & drop your Excel file here"
                    />
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

                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          disabled={!canExecute}
                          onClick={() => executeTool()}
                          className="px-6 py-3 rounded-xl bg-artisan-terracotta text-white font-medium text-xs sm:text-sm shadow-artisan hover:bg-artisan-clay transition-all flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Convert Excel to PDF</span>
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

import { EncryptedPDFError, PDFDocument } from 'pdf-lib';

import { logger } from '../../config/logger';
import { AppError } from '../../core/errors/app-error';
import {
  CorruptedPdfError,
  EmptyPdfUploadError,
  InvalidPdfError,
  PdfMergeFailureError
} from './pdf.errors';

export interface MergePdfInputFile {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

interface MergeLogger {
  info(payload: object, message: string): void;
  warn(payload: object, message: string): void;
  error(payload: object, message: string): void;
}

const pdfSignaturePattern = /%PDF-/;

export class MergeService {
  constructor(
    private readonly serviceLogger: MergeLogger = logger.child({
      module: 'pdf-merge-service'
    })
  ) {}

  public async merge(files: readonly MergePdfInputFile[]): Promise<Buffer> {
    if (files.length === 0) {
      throw new EmptyPdfUploadError({ reason: 'No PDF files were provided.' });
    }

    const totalInputBytes = files.reduce((sum, file) => sum + file.size, 0);

    this.serviceLogger.info(
      {
        fileCount: files.length,
        totalInputBytes
      },
      'Starting PDF merge'
    );

    try {
      const mergedDocument = await PDFDocument.create();
      let mergedPageCount = 0;

      for (const [fileIndex, file] of files.entries()) {
        this.assertFileHasContent(file, fileIndex);
        this.assertPdfSignature(file, fileIndex);

        const sourceDocument = await this.loadSourceDocument(file, fileIndex);
        let copiedPages;
        try {
          const sourcePageIndices = sourceDocument.getPageIndices();
          copiedPages = await mergedDocument.copyPages(
            sourceDocument,
            sourcePageIndices
          );
        } catch (copyError) {
          if (AppError.isAppError(copyError)) {
            throw copyError;
          }

          throw new CorruptedPdfError(
            file.originalName,
            fileIndex,
            copyError instanceof Error ? copyError.message : 'Invalid page structure.'
          );
        }

        copiedPages.forEach((page) => mergedDocument.addPage(page));
        mergedPageCount += copiedPages.length;
      }

      if (mergedPageCount === 0) {
        throw new InvalidPdfError(
          files[0]?.originalName ?? 'document.pdf',
          0,
          'PDF files contain no pages to merge.'
        );
      }

      const mergedPdfBytes = await mergedDocument.save();
      const mergedPdfBuffer = Buffer.from(mergedPdfBytes);

      this.serviceLogger.info(
        {
          fileCount: files.length,
          mergedPageCount,
          outputBytes: mergedPdfBuffer.length
        },
        'PDF merge completed'
      );

      return mergedPdfBuffer;
    } catch (error) {
      if (AppError.isAppError(error)) {
        this.serviceLogger.warn(
          {
            code: error.code,
            details: error.details
          },
          'PDF merge validation failed'
        );
        throw error;
      }

      const wrappedError = new PdfMergeFailureError(
        error instanceof Error ? error.message : 'An unexpected merge error occurred.'
      );

      this.serviceLogger.error(
        {
          err: error,
          code: wrappedError.code
        },
        'PDF merge failed unexpectedly'
      );

      throw wrappedError;
    }
  }

  private assertFileHasContent(
    file: MergePdfInputFile,
    fileIndex: number
  ): void {
    if (file.buffer.length > 0) {
      return;
    }

    throw new EmptyPdfUploadError({
      fileName: file.originalName,
      fileIndex,
      reason: 'Uploaded PDF file is empty.'
    });
  }

  private assertPdfSignature(
    file: MergePdfInputFile,
    fileIndex: number
  ): void {
    const headerProbe = file.buffer
      .subarray(0, Math.min(file.buffer.length, 1024))
      .toString('latin1');

    if (pdfSignaturePattern.test(headerProbe)) {
      return;
    }

    throw new InvalidPdfError(
      file.originalName,
      fileIndex,
      'Missing PDF file signature.'
    );
  }

  private async loadSourceDocument(
    file: MergePdfInputFile,
    fileIndex: number
  ): Promise<PDFDocument> {
    try {
      return await PDFDocument.load(file.buffer, {
        ignoreEncryption: false,
        throwOnInvalidObject: true,
        updateMetadata: false
      });
    } catch (error) {
      if (error instanceof EncryptedPDFError) {
        throw new CorruptedPdfError(
          file.originalName,
          fileIndex,
          'Encrypted PDF files are not supported.'
        );
      }

      throw new CorruptedPdfError(
        file.originalName,
        fileIndex,
        error instanceof Error ? error.message : 'Unable to parse PDF document.'
      );
    }
  }
}

export const mergeService = new MergeService();

import { AppError } from '../../core/errors/app-error';

interface PdfErrorDetails {
  fileName?: string;
  fileIndex?: number;
  reason?: string;
}

class PdfMergeError extends AppError {
  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: PdfErrorDetails
  ) {
    super(message, statusCode, code, details);
    this.name = 'PdfMergeError';
  }
}

export class EmptyPdfUploadError extends PdfMergeError {
  constructor(details?: PdfErrorDetails) {
    super(
      'At least one PDF file is required for merging.',
      'EMPTY_PDF_UPLOAD',
      400,
      details
    );

    this.name = 'EmptyPdfUploadError';
  }
}

export class InvalidPdfError extends PdfMergeError {
  constructor(fileName: string, fileIndex: number, reason?: string) {
    super(
      `File "${fileName}" is not a valid PDF.`,
      'INVALID_PDF',
      422,
      {
        fileName,
        fileIndex,
        ...(reason !== undefined ? { reason } : {})
      }
    );

    this.name = 'InvalidPdfError';
  }
}

export class CorruptedPdfError extends PdfMergeError {
  constructor(fileName: string, fileIndex: number, reason?: string) {
    super(
      `File "${fileName}" is corrupted or unreadable.`,
      'CORRUPTED_PDF',
      422,
      {
        fileName,
        fileIndex,
        ...(reason !== undefined ? { reason } : {})
      }
    );

    this.name = 'CorruptedPdfError';
  }
}

export class PdfMergeFailureError extends PdfMergeError {
  constructor(reason?: string) {
    super(
      'Failed to merge PDF files.',
      'PDF_MERGE_FAILED',
      500,
      reason !== undefined ? { reason } : undefined
    );

    this.name = 'PdfMergeFailureError';
  }
}

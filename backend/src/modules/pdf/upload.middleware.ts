import type { Request, RequestHandler } from 'express';
import multer, { MulterError } from 'multer';

import { env } from '../../config/env';
import { AppError } from '../../core/errors/app-error';

const PDF_MAGIC_BYTES = Buffer.from('%PDF-');
const PNG_MAGIC_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC_BYTES = Buffer.from([0xff, 0xd8, 0xff]);

const PDF_MIME_TYPES = new Set([
  'application/pdf',
  'application/x-pdf',
  'application/acrobat',
  'applications/vnd.pdf',
  'text/pdf',
  'application/x-bzpdf'
]);

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp'
]);

const DEFAULT_MAX_FILE_COUNT = 50;
const DEFAULT_UPLOAD_FIELD_NAME = 'files';

interface UploadFilesOptions {
  fieldName?: string;
  maxCount?: number;
  allowedTypes?: ('pdf' | 'image' | 'text' | 'html')[];
}

function formatMaxFileSizeLabel(bytes: number): string {
  const mb = Math.round(bytes / (1024 * 1024));
  return `${mb}MB`;
}

function validateBufferMagicBytes(buffer: Buffer, type: 'pdf' | 'image'): boolean {
  if (buffer.length < 4) return false;

  if (type === 'pdf') {
    const probe = buffer.subarray(0, Math.min(buffer.length, 1024));
    return probe.includes(PDF_MAGIC_BYTES);
  }

  if (type === 'image') {
    return (
      buffer.subarray(0, 8).equals(PNG_MAGIC_BYTES) ||
      buffer.subarray(0, 3).equals(JPEG_MAGIC_BYTES) ||
      (buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP')
    );
  }

  return false;
}

const fileUploadHandler = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.PDF_UPLOAD_MAX_FILE_SIZE_BYTES
  }
});

function normalizeUploadError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return new AppError(
          `Each uploaded file must be ${formatMaxFileSizeLabel(env.PDF_UPLOAD_MAX_FILE_SIZE_BYTES)} or smaller.`,
          413,
          'FILE_TOO_LARGE',
          {
            maxFileSizeBytes: env.PDF_UPLOAD_MAX_FILE_SIZE_BYTES
          }
        );
      case 'LIMIT_FILE_COUNT':
      case 'LIMIT_UNEXPECTED_FILE':
        return new AppError(
          `Too many files uploaded in a single request. Maximum allowed is ${DEFAULT_MAX_FILE_COUNT} files.`,
          400,
          'FILE_COUNT_EXCEEDED',
          {
            maxFileCount: DEFAULT_MAX_FILE_COUNT,
            field: DEFAULT_UPLOAD_FIELD_NAME
          }
        );
      default:
        return new AppError('The file upload request could not be processed.', 400, 'UPLOAD_FAILED');
    }
  }

  return new AppError('The file upload request could not be processed.', 400, 'UPLOAD_FAILED');
}

export function uploadPdfFiles(options: UploadFilesOptions = {}): RequestHandler {
  const fieldName = options.fieldName ?? DEFAULT_UPLOAD_FIELD_NAME;
  const maxCount = options.maxCount ?? DEFAULT_MAX_FILE_COUNT;
  const handler = fileUploadHandler.array(fieldName, maxCount);

  return (req, res, next) => {
    handler(req, res, (error?: unknown) => {
      if (error !== undefined) {
        next(normalizeUploadError(error));
        return;
      }

      const files = getUploadedPdfFiles(req);
      for (const [index, file] of files.entries()) {
        const isPdfExt = file.originalname.toLowerCase().endsWith('.pdf');
        const isPdfMime = PDF_MIME_TYPES.has(file.mimetype.toLowerCase());

        if (!isPdfExt && !isPdfMime) {
          next(
            new AppError(
              `File "${file.originalname}" must be a PDF document.`,
              415,
              'INVALID_PDF_MIME_TYPE',
              { fileName: file.originalname, fileIndex: index }
            )
          );
          return;
        }

        if (!validateBufferMagicBytes(file.buffer, 'pdf')) {
          next(
            new AppError(
              `File "${file.originalname}" lacks valid PDF magic bytes signature.`,
              422,
              'INVALID_PDF_SIGNATURE',
              { fileName: file.originalname, fileIndex: index }
            )
          );
          return;
        }
      }

      next();
    });
  };
}

export function uploadImageFiles(options: UploadFilesOptions = {}): RequestHandler {
  const fieldName = options.fieldName ?? DEFAULT_UPLOAD_FIELD_NAME;
  const maxCount = options.maxCount ?? DEFAULT_MAX_FILE_COUNT;
  const handler = fileUploadHandler.array(fieldName, maxCount);

  return (req, res, next) => {
    handler(req, res, (error?: unknown) => {
      if (error !== undefined) {
        next(normalizeUploadError(error));
        return;
      }

      const files = getUploadedPdfFiles(req);
      for (const [index, file] of files.entries()) {
        const isImgMime = IMAGE_MIME_TYPES.has(file.mimetype.toLowerCase());
        const isImgExt = /\.(jpe?g|png|webp)$/i.test(file.originalname);

        if (!isImgMime && !isImgExt) {
          next(
            new AppError(
              `File "${file.originalname}" must be a JPEG, PNG, or WebP image.`,
              415,
              'INVALID_IMAGE_TYPE',
              { fileName: file.originalname, fileIndex: index }
            )
          );
          return;
        }

        if (!validateBufferMagicBytes(file.buffer, 'image')) {
          next(
            new AppError(
              `File "${file.originalname}" lacks valid image magic bytes signature.`,
              422,
              'INVALID_IMAGE_SIGNATURE',
              { fileName: file.originalname, fileIndex: index }
            )
          );
          return;
        }
      }

      next();
    });
  };
}

export function uploadOfficeFiles(options: UploadFilesOptions = {}): RequestHandler {
  const fieldName = options.fieldName ?? DEFAULT_UPLOAD_FIELD_NAME;
  const maxCount = options.maxCount ?? DEFAULT_MAX_FILE_COUNT;
  const handler = fileUploadHandler.array(fieldName, maxCount);

  return (req, res, next) => {
    handler(req, res, (error?: unknown) => {
      if (error !== undefined) {
        next(normalizeUploadError(error));
        return;
      }

      const files = getUploadedPdfFiles(req);
      for (const [index, file] of files.entries()) {
        const isOfficeExt = /\.(docx?|xlsx?|pptx?)$/i.test(file.originalname);
        if (!isOfficeExt) {
          next(
            new AppError(
              `File "${file.originalname}" must be a Word (.docx), Excel (.xlsx), or PowerPoint (.pptx) document.`,
              415,
              'INVALID_OFFICE_TYPE',
              { fileName: file.originalname, fileIndex: index }
            )
          );
          return;
        }
      }

      next();
    });
  };
}

export function validateMinimumPdfFiles(minimumFileCount: number): RequestHandler {
  return (req, _res, next) => {
    const files = getUploadedPdfFiles(req);

    if (files.length < minimumFileCount) {
      next(
        new AppError(
          `At least ${minimumFileCount} ${minimumFileCount === 1 ? 'file is' : 'files are'} required for this operation.`,
          400,
          'INSUFFICIENT_FILES',
          {
            minimumFileCount,
            receivedFileCount: files.length
          }
        )
      );
      return;
    }

    next();
  };
}

export function getUploadedPdfFiles(req: Request): Express.Multer.File[] {
  if (!Array.isArray(req.files)) {
    return [];
  }

  return req.files;
}
